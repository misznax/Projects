# -*- coding: utf-8 -*-
"""Rytm Dnia - logika bez GUI: baza SQLite, śledzenie okien, harmonogram pytań, eksport.

Tylko biblioteka standardowa (zero zależności = mały, lekki widget).
Autor: Michał Rzekiecki · kontakt: kontakt@smialo.org
"""
from __future__ import annotations

import csv
import logging
import os
import re
import sqlite3
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timedelta
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Optional

APP_NAME = "Rytm Dnia"
APP_TECH = "RytmDnia"
APP_VERSION = "v0.01"
APP_AUTHOR = "Michał Rzekiecki"
APP_CONTACT = "kontakt@smialo.org"

DAY_START_HOUR = 4          # "dzień" zaczyna się o 4:00 (praca po północy liczy się do poprzedniego dnia)
TICK_SEC = 2.0              # próbkowanie aktywnego okna
IDLE_TICK_SEC = 5.0         # rzadziej, gdy nikt nie dotyka komputera
FLUSH_SEC = 60.0            # zapis do bazy raz na minutę
MAX_GAP_SEC = 30.0          # dłuższa luka = uśpienie/hibernacja, nie liczymy
SNOOZE_MIN = 15
TS_FMT = "%Y-%m-%d %H:%M:%S"
MAX_ITEMS_PER_DAY = 5000    # bezpiecznik na tytuły zmieniające się co sekundę

DRINK_KINDS = ("Woda", "Kawa", "Herbata", "Inne")
MOOD_LABELS = {1: "1 – słabo", 2: "2", 3: "3 – ok", 4: "4", 5: "5 – super"}

DEFAULTS = {
    "interval_min": "120",   # 60, 120 albo 0 (wyłączone)
    "glass_ml": "300",
    "goal_ml": "2000",
    "idle_min": "5",
    "topmost": "1",
    "compact": "0",
    "autostart": "0",
    "x": "",
    "y": "",
    "last_bed": "23:00",
    "last_wake": "07:00",
    "next_prompt": "",
}

log = logging.getLogger("rytmdnia")


# --------------------------------------------------------------------------- ścieżki / log

def data_dir() -> Path:
    """Folder danych: %LOCALAPPDATA%\\smialo\\RytmDnia (RYTM_DATA_DIR nadpisuje - testy)."""
    env = os.environ.get("RYTM_DATA_DIR")
    if env:
        return Path(env)
    base = os.environ.get("LOCALAPPDATA")
    if base:
        return Path(base) / "smialo" / APP_TECH
    return Path.home() / ".local" / "share" / "smialo" / APP_TECH


def setup_logging() -> Path:
    d = data_dir()
    d.mkdir(parents=True, exist_ok=True)
    path = d / "rytmdnia.log"
    handler = RotatingFileHandler(path, maxBytes=200_000, backupCount=1, encoding="utf-8")
    handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    log.setLevel(logging.INFO)
    log.handlers = [handler]
    return path


# --------------------------------------------------------------------------- czas

def logical_day(now: datetime) -> str:
    return (now - timedelta(hours=DAY_START_HOUR)).strftime("%Y-%m-%d")


def day_bounds(day: str) -> tuple[str, str]:
    d0 = datetime.strptime(day, "%Y-%m-%d") + timedelta(hours=DAY_START_HOUR)
    return d0.strftime(TS_FMT), (d0 + timedelta(days=1)).strftime(TS_FMT)


def shift_day(day: str, delta: int) -> str:
    return (datetime.strptime(day, "%Y-%m-%d") + timedelta(days=delta)).strftime("%Y-%m-%d")


def parse_hm(text: str) -> Optional[tuple[int, int]]:
    """'7:30', '07.30', '730', '19', '7h30' -> (h, m) albo None."""
    s = (text or "").strip().lower()
    if not s:
        return None
    if s.isdigit():
        if len(s) <= 2:
            h, m = int(s), 0
        elif len(s) == 3:
            h, m = int(s[0]), int(s[1:])
        elif len(s) == 4:
            h, m = int(s[:2]), int(s[2:])
        else:
            return None
    else:
        mt = re.match(r"^(\d{1,2})\s*[:.,h]\s*(\d{1,2})$", s)
        if not mt:
            return None
        h, m = int(mt.group(1)), int(mt.group(2))
    if 0 <= h < 24 and 0 <= m < 60:
        return h, m
    return None


def resolve_recent(hm: tuple[int, int], now: datetime, slack_min: int = 10) -> datetime:
    """Ostatnie wystąpienie godziny HH:MM nie później niż 'teraz' (+ drobny zapas)."""
    t = now.replace(hour=hm[0], minute=hm[1], second=0, microsecond=0)
    if t > now + timedelta(minutes=slack_min):
        t -= timedelta(days=1)
    return t


def resolve_sleep(bed_hm: tuple[int, int], wake_hm: tuple[int, int], now: datetime) -> tuple[datetime, datetime]:
    wake = resolve_recent(wake_hm, now)
    bed = wake.replace(hour=bed_hm[0], minute=bed_hm[1])
    if bed >= wake:
        bed -= timedelta(days=1)
    return bed, wake


def fmt_hm(sec: float) -> str:
    """3 h 12 min -> '3:12'."""
    m = int(sec // 60)
    return f"{m // 60}:{m % 60:02d}"


def fmt_dur(sec: float) -> str:
    sec = int(sec)
    if sec < 60:
        return f"{sec} s"
    m = sec // 60
    if m < 60:
        return f"{m} min"
    return f"{m // 60} h {m % 60:02d} min"


def ago(now: datetime, ts: str) -> str:
    try:
        d = now - datetime.strptime(ts, TS_FMT)
    except ValueError:
        return ""
    return fmt_dur(max(0, d.total_seconds())) + " temu"


# --------------------------------------------------------------------------- klasyfikacja okien

BROWSER_NAMES = {
    "chrome": "Chrome", "msedge": "Edge", "firefox": "Firefox", "brave": "Brave",
    "opera": "Opera", "vivaldi": "Vivaldi", "chromium": "Chromium", "iexplore": "Internet Explorer",
    "waterfox": "Waterfox", "librewolf": "LibreWolf", "arc": "Arc", "yandex": "Yandex",
}
APP_NAMES = {
    "explorer": "Eksplorator", "excel": "Excel", "winword": "Word", "powerpnt": "PowerPoint",
    "outlook": "Outlook", "code": "VS Code", "notepad": "Notatnik", "notepad++": "Notepad++",
    "totalcmd": "Total Commander", "totalcmd64": "Total Commander", "teams": "Teams",
    "ms-teams": "Teams", "slack": "Slack", "discord": "Discord", "spotify": "Spotify",
    "python": "Python", "pythonw": "Python", "windowsterminal": "Terminal", "cmd": "Wiersz poleceń",
    "powershell": "PowerShell", "rytmdnia": "Rytm Dnia", "startupboard": "Startup Board",
    "acrobat": "Acrobat", "acrord32": "Acrobat Reader", "vlc": "VLC", "zoom": "Zoom",
}
PRIVATE_MARKERS = (
    "incognito", "inprivate", "private browsing", "tryb prywatny", "okno prywatne",
    "przeglądanie prywatne", "prywatne okno",
)
_ZW = {0x200B: None, 0x200C: None, 0x200D: None, 0xFEFF: None, 0x00A0: " "}
_BROWSER_SUFFIX = re.compile(
    r"\s+[-–—]\s+(?:Google Chrome|Microsoft Edge|Mozilla Firefox|Firefox|Brave|Opera(?: GX)?|Vivaldi|Chromium|Arc)\b",
    re.IGNORECASE,
)
_MORE_PAGES = re.compile(r"\s+(?:and|i)\s+\d+\s+(?:more\s+pages?|więcej\s+\w+|innych\s+\w+).*$", re.IGNORECASE)
_LEAD_COUNT = re.compile(r"^\(\d+\+?\)\s*")


@dataclass(frozen=True)
class Activity:
    app: str
    title: str
    is_browser: bool
    private: bool = False


def _short(s: str, n: int = 90) -> str:
    s = re.sub(r"\s+", " ", s).strip()
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"


def classify(proc: str, title: str) -> Activity:
    """(nazwa procesu, tytuł okna) -> aplikacja + karta. Dla przeglądarek tytuł okna = aktywna karta."""
    stem = (proc or "").lower()
    if stem.endswith(".exe"):
        stem = stem[:-4]
    title = (title or "").translate(_ZW).strip()
    if stem in BROWSER_NAMES:
        app = BROWSER_NAMES[stem]
        low = title.lower()
        if any(m in low for m in PRIVATE_MARKERS):
            return Activity(app, "Okno prywatne", True, True)
        matches = list(_BROWSER_SUFFIX.finditer(title))
        if matches:
            title = title[: matches[-1].start()]
        title = _MORE_PAGES.sub("", title)
        title = _LEAD_COUNT.sub("", title)
        return Activity(app, _short(title) or "(pusta karta)", True)
    app = APP_NAMES.get(stem) or (stem[:1].upper() + stem[1:] if stem else "Nieznana aplikacja")
    if stem == "explorer" and title in ("Program Manager", ""):
        title = "Pulpit"
    return Activity(app, _short(title) or "(bez tytułu)", False)


# --------------------------------------------------------------------------- baza

class Store:
    def __init__(self, path: Path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.db = sqlite3.connect(str(self.path), timeout=5)
        self.db.execute("PRAGMA journal_mode=WAL")
        self.db.execute("PRAGMA synchronous=NORMAL")
        self._init()

    def _init(self):
        self.db.executescript(
            """
            CREATE TABLE IF NOT EXISTS settings(k TEXT PRIMARY KEY, v TEXT);
            CREATE TABLE IF NOT EXISTS usage(day TEXT, app TEXT, title TEXT, sec REAL, browser INTEGER,
                                             PRIMARY KEY(day, app, title));
            CREATE TABLE IF NOT EXISTS daily(day TEXT PRIMARY KEY, first_ts TEXT, last_ts TEXT);
            CREATE TABLE IF NOT EXISTS sleep(day TEXT PRIMARY KEY, bed TEXT, wake TEXT, status TEXT);
            CREATE TABLE IF NOT EXISTS checkin(id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT, mood INTEGER, note TEXT);
            CREATE TABLE IF NOT EXISTS meal(id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT, what TEXT);
            CREATE TABLE IF NOT EXISTS drink(id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT, kind TEXT, ml INTEGER);
            CREATE INDEX IF NOT EXISTS i_checkin ON checkin(ts);
            CREATE INDEX IF NOT EXISTS i_meal ON meal(ts);
            CREATE INDEX IF NOT EXISTS i_drink ON drink(ts);
            """
        )
        self.db.commit()

    def close(self):
        try:
            self.db.commit()
            self.db.close()
        except sqlite3.Error:
            log.exception("close")

    # ustawienia
    def get(self, key: str) -> str:
        row = self.db.execute("SELECT v FROM settings WHERE k=?", (key,)).fetchone()
        return row[0] if row else DEFAULTS.get(key, "")

    def get_int(self, key: str) -> int:
        try:
            return int(self.get(key))
        except ValueError:
            return int(DEFAULTS.get(key) or 0)

    def set(self, key: str, value) -> None:
        self.db.execute("INSERT INTO settings(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v", (key, str(value)))
        self.db.commit()

    # aktywność
    def usage_rows(self, day: str):
        return self.db.execute("SELECT app, title, sec, browser FROM usage WHERE day=?", (day,)).fetchall()

    def save_usage(self, day: str, rows, first_ts: str, last_ts: str):
        self.db.executemany(
            "INSERT INTO usage(day,app,title,sec,browser) VALUES(?,?,?,?,?) "
            "ON CONFLICT(day,app,title) DO UPDATE SET sec=excluded.sec",
            [(day, a, t, s, b) for a, t, s, b in rows],
        )
        self.db.execute(
            "INSERT INTO daily(day,first_ts,last_ts) VALUES(?,?,?) "
            "ON CONFLICT(day) DO UPDATE SET last_ts=excluded.last_ts, "
            "first_ts=COALESCE(daily.first_ts, excluded.first_ts)",
            (day, first_ts, last_ts),
        )
        self.db.commit()

    def daily_span(self, day: str):
        row = self.db.execute("SELECT first_ts, last_ts FROM daily WHERE day=?", (day,)).fetchone()
        return (row[0], row[1]) if row else (None, None)

    # sen
    def set_sleep(self, day: str, bed: Optional[datetime], wake: Optional[datetime], status: str):
        self.db.execute(
            "INSERT INTO sleep(day,bed,wake,status) VALUES(?,?,?,?) "
            "ON CONFLICT(day) DO UPDATE SET bed=excluded.bed, wake=excluded.wake, status=excluded.status",
            (day, bed.strftime(TS_FMT) if bed else None, wake.strftime(TS_FMT) if wake else None, status),
        )
        self.db.commit()

    def get_sleep(self, day: str):
        return self.db.execute("SELECT bed, wake, status FROM sleep WHERE day=?", (day,)).fetchone()

    # samopoczucie
    def add_checkin(self, ts: datetime, mood: Optional[int], note: str):
        self.db.execute("INSERT INTO checkin(ts,mood,note) VALUES(?,?,?)", (ts.strftime(TS_FMT), mood, note.strip()))
        self.db.commit()

    def checkins(self, day: str):
        a, b = day_bounds(day)
        return self.db.execute("SELECT ts, mood, note FROM checkin WHERE ts>=? AND ts<? ORDER BY ts", (a, b)).fetchall()

    def last_checkin(self):
        return self.db.execute("SELECT ts, mood, note FROM checkin WHERE mood IS NOT NULL ORDER BY ts DESC LIMIT 1").fetchone()

    # posiłki
    def add_meal(self, ts: datetime, what: str):
        self.db.execute("INSERT INTO meal(ts,what) VALUES(?,?)", (ts.strftime(TS_FMT), what.strip()))
        self.db.commit()

    def meals(self, day: str):
        a, b = day_bounds(day)
        return self.db.execute("SELECT ts, what FROM meal WHERE ts>=? AND ts<? ORDER BY ts", (a, b)).fetchall()

    def last_meal(self):
        return self.db.execute("SELECT ts, what FROM meal ORDER BY ts DESC LIMIT 1").fetchone()

    def recent_meals(self, limit: int = 30) -> list[str]:
        rows = self.db.execute("SELECT what FROM meal GROUP BY what ORDER BY MAX(ts) DESC LIMIT ?", (limit,)).fetchall()
        return [r[0] for r in rows]

    # płyny
    def add_drink(self, ts: datetime, kind: str, ml: int):
        self.db.execute("INSERT INTO drink(ts,kind,ml) VALUES(?,?,?)", (ts.strftime(TS_FMT), kind, int(ml)))
        self.db.commit()

    def drinks(self, day: str):
        a, b = day_bounds(day)
        return self.db.execute("SELECT ts, kind, ml FROM drink WHERE ts>=? AND ts<? ORDER BY ts", (a, b)).fetchall()

    def drink_totals(self, day: str) -> dict[str, int]:
        a, b = day_bounds(day)
        rows = self.db.execute("SELECT kind, SUM(ml) FROM drink WHERE ts>=? AND ts<? GROUP BY kind", (a, b)).fetchall()
        return {k: int(v or 0) for k, v in rows}

    def undo_last_drink(self, day: str):
        a, b = day_bounds(day)
        row = self.db.execute("SELECT id, ts, kind, ml FROM drink WHERE ts>=? AND ts<? ORDER BY id DESC LIMIT 1", (a, b)).fetchone()
        if row:
            self.db.execute("DELETE FROM drink WHERE id=?", (row[0],))
            self.db.commit()
        return row

    # kopie
    def daily_backup(self, folder: Path, today: str, keep: int = 7) -> Optional[Path]:
        folder.mkdir(parents=True, exist_ok=True)
        dst = folder / f"{APP_TECH}_{APP_VERSION}_kopia_{today}.db"
        if dst.exists():
            return None
        out = sqlite3.connect(str(dst))
        try:
            self.db.backup(out)
        finally:
            out.close()
        olds = sorted(folder.glob(f"{APP_TECH}_*_kopia_*.db"))
        for p in olds[:-keep]:
            try:
                p.unlink()
            except OSError:
                pass
        return dst


# --------------------------------------------------------------------------- śledzenie

class Tracker:
    """Zlicza czas aktywnego okna. Pamięć: słownik dnia; zapis do bazy raz na minutę."""

    def __init__(self, store: Store, now: datetime, mono: float):
        self.store = store
        self.last_mono = mono
        self.last_flush = mono
        self.current: Optional[Activity] = None
        self.idle = False
        self._load_day(logical_day(now))

    def _load_day(self, day: str):
        self.day = day
        self.items: dict[tuple[str, str], list] = {}
        for app, title, sec, br in self.store.usage_rows(day):
            self.items[(app, title)] = [float(sec), bool(br)]
        self.dirty: set[tuple[str, str]] = set()
        self.pc = sum(v[0] for v in self.items.values())
        self.web = sum(v[0] for v in self.items.values() if v[1])
        self.first_ts, self.last_ts = self.store.daily_span(day)

    def tick(self, now: datetime, mono: float, sample, idle_s: float, idle_limit: float) -> Optional[Activity]:
        day = logical_day(now)
        if day != self.day:
            self.flush(mono)
            self._load_day(day)
        dt = mono - self.last_mono
        self.last_mono = mono
        if dt < 0 or dt > MAX_GAP_SEC:
            dt = 0.0
        act = classify(*sample) if sample else None
        self.current = act
        self.idle = idle_s >= idle_limit
        if act is not None and not self.idle and dt > 0:
            key = (act.app, act.title)
            if key not in self.items and len(self.items) >= MAX_ITEMS_PER_DAY:
                key = (act.app, "(inne)")
            rec = self.items.setdefault(key, [0.0, act.is_browser])
            rec[0] += dt
            self.pc += dt
            if act.is_browser:
                self.web += dt
            self.dirty.add(key)
            ts = now.strftime(TS_FMT)
            if not self.first_ts:
                self.first_ts = ts
            self.last_ts = ts
        if mono - self.last_flush >= FLUSH_SEC:
            self.flush(mono)
        return act

    def current_seconds(self) -> float:
        if not self.current:
            return 0.0
        rec = self.items.get((self.current.app, self.current.title))
        return rec[0] if rec else 0.0

    def flush(self, mono: Optional[float] = None):
        if self.dirty:
            rows = [(a, t, self.items[(a, t)][0], int(self.items[(a, t)][1])) for a, t in self.dirty]
            self.store.save_usage(self.day, rows, self.first_ts or "", self.last_ts or "")
            self.dirty.clear()
        if mono is not None:
            self.last_flush = mono


# --------------------------------------------------------------------------- pytania

def normalize_next_prompt(now: datetime, next_iso: str, interval_min: int) -> str:
    """Przy starcie: puste / bardzo spóźnione -> za pełny interwał; inaczej bez zmian."""
    if interval_min <= 0:
        return ""
    try:
        nxt = datetime.strptime(next_iso, TS_FMT)
    except (ValueError, TypeError):
        return (now + timedelta(minutes=interval_min)).strftime(TS_FMT)
    if nxt < now - timedelta(minutes=30):
        return (now + timedelta(minutes=interval_min)).strftime(TS_FMT)
    return next_iso


def prompt_due(now: datetime, next_iso: str, interval_min: int, idle_s: float) -> bool:
    """Pytamy dopiero gdy ktoś siedzi przy komputerze (nie wyskakujemy do pustego pokoju)."""
    if interval_min <= 0 or not next_iso:
        return False
    try:
        nxt = datetime.strptime(next_iso, TS_FMT)
    except ValueError:
        return False
    return now >= nxt and idle_s < 60


def need_sleep_question(store: Store, now: datetime) -> bool:
    return now.hour >= DAY_START_HOUR and store.get_sleep(logical_day(now)) is None


# --------------------------------------------------------------------------- podsumowanie / eksport

def day_summary(store: Store, day: str, tracker: Optional[Tracker] = None) -> dict:
    if tracker is not None and tracker.day == day:
        tracker.flush()
    rows = store.usage_rows(day)
    apps: dict[str, float] = {}
    tabs = []
    pc = web = 0.0
    for app, title, sec, br in rows:
        apps[app] = apps.get(app, 0.0) + sec
        pc += sec
        if br:
            web += sec
            tabs.append((app, title, sec))
    first, last = store.daily_span(day)
    sl = store.get_sleep(day)
    sleep = None
    if sl and sl[2] == "ok" and sl[0] and sl[1]:
        bed = datetime.strptime(sl[0], TS_FMT)
        wake = datetime.strptime(sl[1], TS_FMT)
        sleep = (bed, wake, (wake - bed).total_seconds())
    totals = store.drink_totals(day)
    return {
        "day": day,
        "sleep": sleep,
        "sleep_status": sl[2] if sl else None,
        "first": first, "last": last,
        "pc": pc, "web": web,
        "apps": sorted(apps.items(), key=lambda x: -x[1]),
        "tabs": sorted(tabs, key=lambda x: -x[2]),
        "meals": store.meals(day),
        "checkins": store.checkins(day),
        "drinks": totals,
        "total_ml": sum(totals.values()),
    }


def export_csv(store: Store, folder: Path, today: str) -> list[Path]:
    """Dwa pliki CSV (UTF-8 z BOM, separator ';' - otwierają się w Excelu). Wersja w nazwie."""
    folder.mkdir(parents=True, exist_ok=True)
    ev = folder / f"{APP_TECH}_{APP_VERSION}_zdarzenia_{today}.csv"
    us = folder / f"{APP_TECH}_{APP_VERSION}_aktywnosc_{today}.csv"
    with open(ev, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["data", "godzina", "typ", "wartość", "opis"])
        for day, bed, wake, status in store.db.execute("SELECT day, bed, wake, status FROM sleep ORDER BY day"):
            if status == "ok" and bed and wake:
                hrs = (datetime.strptime(wake, TS_FMT) - datetime.strptime(bed, TS_FMT)).total_seconds() / 3600
                w.writerow([wake[:10], wake[11:16], "sen", f"{hrs:.2f}".replace(".", ","), f"od {bed[:16]} do {wake[:16]}"])
        for ts, what in store.db.execute("SELECT ts, what FROM meal ORDER BY ts"):
            w.writerow([ts[:10], ts[11:16], "posiłek", "", what])
        for ts, mood, note in store.db.execute("SELECT ts, mood, note FROM checkin ORDER BY ts"):
            w.writerow([ts[:10], ts[11:16], "samopoczucie", mood if mood is not None else "", note or ""])
        for ts, kind, ml in store.db.execute("SELECT ts, kind, ml FROM drink ORDER BY ts"):
            w.writerow([ts[:10], ts[11:16], "picie", ml, kind])
    with open(us, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["dzień", "aplikacja", "karta/tytuł", "przeglądarka", "sekundy", "minuty"])
        for day, app, title, sec, br in store.db.execute("SELECT day, app, title, sec, browser FROM usage ORDER BY day, sec DESC"):
            w.writerow([day, app, title, int(br), int(sec), f"{sec / 60:.1f}".replace(".", ",")])
    return [ev, us]


# --------------------------------------------------------------------------- Windows (ctypes)

class NullProbe:
    """Bez systemu Windows (testy / Linux): brak aktywnego okna."""

    def foreground(self):
        return None

    def idle_seconds(self) -> float:
        return 0.0


class FakeProbe:
    """Do testów: kolejne próbki z listy."""

    def __init__(self, samples, idle=0.0):
        self.samples = list(samples)
        self.i = 0
        self.idle = idle

    def foreground(self):
        s = self.samples[self.i % len(self.samples)]
        self.i += 1
        return s

    def idle_seconds(self) -> float:
        return self.idle


class WinProbe:
    """Aktywne okno + czas bezczynności przez user32/kernel32. Trzy tanie wywołania na próbkę."""

    def __init__(self):
        import ctypes
        from ctypes import wintypes

        self.ct = ctypes
        self.wt = wintypes
        self.u32 = ctypes.WinDLL("user32", use_last_error=True)
        self.k32 = ctypes.WinDLL("kernel32", use_last_error=True)
        u, k = self.u32, self.k32
        u.GetForegroundWindow.restype = wintypes.HWND
        u.GetWindowTextLengthW.argtypes = [wintypes.HWND]
        u.GetWindowTextLengthW.restype = ctypes.c_int
        u.GetWindowTextW.argtypes = [wintypes.HWND, wintypes.LPWSTR, ctypes.c_int]
        u.GetWindowTextW.restype = ctypes.c_int
        u.GetWindowThreadProcessId.argtypes = [wintypes.HWND, ctypes.POINTER(wintypes.DWORD)]
        u.GetWindowThreadProcessId.restype = wintypes.DWORD
        k.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
        k.OpenProcess.restype = wintypes.HANDLE
        k.QueryFullProcessImageNameW.argtypes = [wintypes.HANDLE, wintypes.DWORD, wintypes.LPWSTR, ctypes.POINTER(wintypes.DWORD)]
        k.QueryFullProcessImageNameW.restype = wintypes.BOOL
        k.CloseHandle.argtypes = [wintypes.HANDLE]
        k.GetTickCount.restype = wintypes.DWORD

        class LASTINPUTINFO(ctypes.Structure):
            _fields_ = [("cbSize", wintypes.UINT), ("dwTime", wintypes.DWORD)]

        self._lii = LASTINPUTINFO()
        self._lii.cbSize = ctypes.sizeof(LASTINPUTINFO)
        u.GetLastInputInfo.argtypes = [ctypes.POINTER(LASTINPUTINFO)]
        u.GetLastInputInfo.restype = wintypes.BOOL
        self._names: dict[int, str] = {}

    def _proc_name(self, pid: int) -> str:
        name = self._names.get(pid)
        if name is not None:
            return name
        name = "?"
        h = self.k32.OpenProcess(0x1000, False, pid)  # PROCESS_QUERY_LIMITED_INFORMATION
        if h:
            try:
                buf = self.ct.create_unicode_buffer(1024)
                size = self.wt.DWORD(1024)
                if self.k32.QueryFullProcessImageNameW(h, 0, buf, self.ct.byref(size)):
                    name = os.path.basename(buf.value)
            finally:
                self.k32.CloseHandle(h)
        if len(self._names) > 300:
            self._names.clear()
        self._names[pid] = name
        return name

    def foreground(self):
        hwnd = self.u32.GetForegroundWindow()
        if not hwnd:
            return None
        n = self.u32.GetWindowTextLengthW(hwnd)
        title = ""
        if n > 0:
            buf = self.ct.create_unicode_buffer(n + 1)
            self.u32.GetWindowTextW(hwnd, buf, n + 1)
            title = buf.value
        pid = self.wt.DWORD(0)
        self.u32.GetWindowThreadProcessId(hwnd, self.ct.byref(pid))
        return self._proc_name(pid.value), title

    def idle_seconds(self) -> float:
        if not self.u32.GetLastInputInfo(self.ct.byref(self._lii)):
            return 0.0
        return ((self.k32.GetTickCount() - self._lii.dwTime) & 0xFFFFFFFF) / 1000.0


def make_probe():
    if os.name == "nt":
        try:
            return WinProbe()
        except Exception:
            log.exception("WinProbe")
    return NullProbe()


def acquire_single_instance() -> bool:
    """Windows: nazwany mutex. Drugie uruchomienie zwraca False."""
    if os.name != "nt":
        return True
    import ctypes

    k32 = ctypes.WinDLL("kernel32", use_last_error=True)
    k32.CreateMutexW.restype = ctypes.c_void_p
    k32.CreateMutexW.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_wchar_p]
    handle = k32.CreateMutexW(None, 0, "Local\\smialo_RytmDnia_single")
    acquire_single_instance._h = handle  # trzymamy uchwyt do końca procesu
    return ctypes.get_last_error() != 183  # ERROR_ALREADY_EXISTS


def enable_dpi_awareness():
    if os.name != "nt":
        return
    import ctypes

    try:
        ctypes.windll.shcore.SetProcessDpiAwareness(1)
    except Exception:
        try:
            ctypes.windll.user32.SetProcessDPIAware()
        except Exception:
            pass


def set_autostart(enable: bool) -> None:
    """HKCU\\...\\Run (bez uprawnień administratora)."""
    if os.name != "nt":
        return
    import winreg

    key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run", 0, winreg.KEY_SET_VALUE)
    try:
        if enable:
            if getattr(sys, "frozen", False):
                cmd = f'"{sys.executable}"'
            else:
                py = sys.executable.replace("python.exe", "pythonw.exe")
                cmd = f'"{py}" "{Path(sys.argv[0]).resolve()}"'
            winreg.SetValueEx(key, APP_TECH, 0, winreg.REG_SZ, cmd)
        else:
            try:
                winreg.DeleteValue(key, APP_TECH)
            except FileNotFoundError:
                pass
    finally:
        winreg.CloseKey(key)
