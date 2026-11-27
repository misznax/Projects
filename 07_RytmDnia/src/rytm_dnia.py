# -*- coding: utf-8 -*-
"""Rytm Dnia - ekonomiczny widget na pulpit (tkinter + SQLite, zero zależności).

Mierzy czas przy komputerze, w przeglądarce i na aktywnej karcie; pyta o sen, samopoczucie
i posiłki; zlicza płyny (woda / kawa / herbata / inne).
Autor: Michał Rzekiecki · kontakt: kontakt@smialo.org
"""
from __future__ import annotations

import os
import re
import sys
import time
import traceback
import webbrowser
from datetime import datetime, timedelta
import tkinter as tk
from tkinter import filedialog, messagebox, ttk

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import rytm_core as core  # noqa: E402
from rytm_core import APP_AUTHOR, APP_CONTACT, APP_NAME, APP_VERSION  # noqa: E402

# --------------------------------------------------------------------------- motyw "Morze i limonka"
BORDER = "#2a4a52"
BG = "#0f1f26"
BAR = "#0a161b"
PANEL = "#16303a"
PANEL2 = "#1b3a46"
FG = "#e6f2ef"
MUTED = "#8fb0b0"
LIME = "#b8e04a"
SEA = "#2fb8a6"
SEA_D = "#1f7a70"
PAREN = "#7ec8ff"   # treść w (nawiasach) - jasnoniebieski
QUOTE = "#ffd84a"   # treść w „cudzysłowach" - żółty
WARN = "#ff7a6b"
ZEBRA = ("#12262e", "#173039")
MOOD_COLORS = {1: "#c9473b", 2: "#cf7d3d", 3: "#bfa93a", 4: "#79b43f", 5: "#2f9e6b"}

FONT = ("Segoe UI", 9)
FONT_B = ("Segoe UI", 9, "bold")
FONT_S = ("Segoe UI", 8)
FONT_H = ("Segoe UI", 11, "bold")
FONT_BIG = ("Segoe UI", 17, "bold")
WEEKDAYS = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"]

_RICH = re.compile(r"(\([^)]*\)|„[^”]*”|\"[^\"]*\")")


def ell(s: str, n: int) -> str:
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"


def mk_button(parent, text, cmd, accent=False, small=False):
    return tk.Button(
        parent, text=text, command=cmd, relief="flat", bd=0, cursor="hand2",
        bg=LIME if accent else PANEL2, fg=BG if accent else FG,
        activebackground=SEA if accent else SEA_D, activeforeground=BG if accent else FG,
        font=FONT_S if small else FONT_B, padx=10, pady=3 if small else 5,
    )


def mk_entry(parent, var, width=8):
    return tk.Entry(
        parent, textvariable=var, width=width, relief="flat", bg=PANEL2, fg=FG, insertbackground=FG,
        highlightthickness=1, highlightbackground=BORDER, highlightcolor=SEA, font=FONT,
    )


def mk_label(parent, text="", fg=FG, font=FONT, **kw):
    return tk.Label(parent, text=text, bg=kw.pop("bg", BG), fg=fg, font=font, **kw)


class RichLine(tk.Text):
    """Jednolinijkowy tekst: (nawiasy) jasnoniebieskie, „cudzysłowy" żółte (zasada czytelności)."""

    def __init__(self, parent, width=36, font=FONT, bg=BG, fg=FG, lines=1):
        super().__init__(
            parent, width=width, height=lines, bd=0, highlightthickness=0, bg=bg, fg=fg, font=font,
            wrap="word", cursor="arrow", padx=0, pady=0, takefocus=0, relief="flat", state="disabled",
            spacing1=0, spacing3=0,
        )
        self.tag_configure("paren", foreground=PAREN)
        self.tag_configure("quote", foreground=QUOTE)
        self._last = None

    def set(self, s: str, base=()):
        if s == self._last:
            return
        self._last = s
        self.config(state="normal")
        self.delete("1.0", "end")
        for part in _RICH.split(s):
            if not part:
                continue
            tag = "paren" if part.startswith("(") else ("quote" if part[0] in "„\"" else None)
            self.insert("end", part, tuple(base) + ((tag,) if tag else ()))
        self.config(state="disabled")


# --------------------------------------------------------------------------- okna dialogowe

class Dlg(tk.Toplevel):
    def __init__(self, app: "RytmApp", title: str, key: str | None = None):
        super().__init__(app.root)
        self.app = app
        self.key = key
        self.title(title)
        self.configure(bg=BG, padx=16, pady=12)
        self.attributes("-topmost", True)
        self.resizable(False, False)
        self.protocol("WM_DELETE_WINDOW", self.close)
        self.bind("<Escape>", lambda e: self.close())
        if key:
            app.dialogs[key] = self

    def present(self):
        self.update_idletasks()
        w, h = self.winfo_reqwidth(), self.winfo_reqheight()
        sw, sh = self.winfo_screenwidth(), self.winfo_screenheight()
        self.geometry(f"+{max(0, (sw - w) // 2)}+{max(20, (sh - h) // 3)}")
        self.deiconify()
        self.lift()

    def close(self):
        if self.key and self.app.dialogs.get(self.key) is self:
            del self.app.dialogs[self.key]
        try:
            self.destroy()
        except tk.TclError:
            pass


class SleepDialog(Dlg):
    """Pytanie o sen: wczorajsze położenie się spać + dzisiejsza pobudka."""

    def __init__(self, app: "RytmApp", auto: bool):
        super().__init__(app, f"{APP_NAME} – sen", key="sleep")
        self.auto = auto
        st = app.store
        row = st.get_sleep(app.tracker.day)
        bed_v = st.get("last_bed")
        wake_v = st.get("last_wake")
        if row and row[2] == "ok" and row[0] and row[1]:
            bed_v, wake_v = row[0][11:16], row[1][11:16]
        mk_label(self, "Dzień dobry! Jak minęła noc?" if auto else "Sen – wpisz lub popraw", LIME, FONT_H).grid(
            row=0, column=0, columnspan=2, sticky="w", pady=(0, 8))
        mk_label(self, "1. Poszedłem spać (wczoraj / w nocy), godz.:").grid(row=1, column=0, sticky="w", pady=3)
        self.bed = tk.StringVar(value=bed_v)
        mk_entry(self, self.bed, 7).grid(row=1, column=1, padx=(10, 0))
        mk_label(self, "2. Wstałem (dziś), godz.:").grid(row=2, column=0, sticky="w", pady=3)
        self.wake = tk.StringVar(value=wake_v)
        mk_entry(self, self.wake, 7).grid(row=2, column=1, padx=(10, 0))
        self.info = RichLine(self, width=44, fg=MUTED)
        self.info.grid(row=3, column=0, columnspan=2, sticky="w", pady=(8, 8))
        bf = tk.Frame(self, bg=BG)
        bf.grid(row=4, column=0, columnspan=2, sticky="e")
        mk_button(bf, "Pomiń dzisiaj", self.skip).pack(side="right")
        mk_button(bf, "Zapisz sen", self.save, accent=True).pack(side="right", padx=(0, 8))
        self.bed.trace_add("write", lambda *a: self.recalc())
        self.wake.trace_add("write", lambda *a: self.recalc())
        self.recalc()
        self.present()

    def _parsed(self):
        b, w = core.parse_hm(self.bed.get()), core.parse_hm(self.wake.get())
        if not b or not w:
            return None
        return core.resolve_sleep(b, w, datetime.now())

    def recalc(self):
        r = self._parsed()
        if not r:
            self.info.set("(wpisz godzinę, np. 23:30 i 07:05)")
            return
        bed, wake = r
        dur = (wake - bed).total_seconds()
        self.info.set(f"Sen: {core.fmt_dur(dur)} ({bed:%d.%m %H:%M} → {wake:%d.%m %H:%M})")

    def save(self):
        r = self._parsed()
        if not r:
            self.info.set("(popraw godziny – np. 23:30 i 07:05)")
            return
        bed, wake = r
        st = self.app.store
        st.set_sleep(self.app.tracker.day, bed, wake, "ok")
        st.set("last_bed", f"{bed:%H:%M}")
        st.set("last_wake", f"{wake:%H:%M}")
        self.app.sleep_done = self.app.tracker.day
        self.app.after_prompt(self, reschedule=self.auto)

    def skip(self):
        self.app.store.set_sleep(self.app.tracker.day, None, None, "skip")
        self.app.sleep_done = self.app.tracker.day
        self.app.after_prompt(self, reschedule=self.auto)

    def close(self):
        if self.auto and self.app.sleep_done != self.app.tracker.day:
            self.app.sleep_snooze_until = datetime.now() + timedelta(minutes=60)
        self.app.after_prompt(self, reschedule=False)


class CheckinDialog(Dlg):
    """Co 1-2 h: samopoczucie + czy był posiłek (co i kiedy)."""

    def __init__(self, app: "RytmApp", auto: bool):
        super().__init__(app, f"{APP_NAME} – co u Ciebie?", key="checkin")
        self.auto = auto
        self.saved: list[str] = []
        now = datetime.now()
        mk_label(self, "Co u Ciebie?", LIME, FONT_H).grid(row=0, column=0, columnspan=3, sticky="w")
        lm = app.store.last_meal()
        info = f"Ostatni posiłek: {lm[0][11:16]} „{ell(lm[1], 28)}” ({core.ago(now, lm[0])})" if lm else "(brak zapisanych posiłków)"
        li = RichLine(self, width=52, fg=MUTED)
        li.grid(row=1, column=0, columnspan=3, sticky="w", pady=(2, 10))
        li.set(info)

        mk_label(self, "1. Samopoczucie:").grid(row=2, column=0, sticky="w")
        self.mood = tk.IntVar(value=0)
        mf = tk.Frame(self, bg=BG)
        mf.grid(row=3, column=0, columnspan=3, sticky="w", pady=(2, 6))
        for v in range(1, 6):
            tk.Radiobutton(
                mf, text=core.MOOD_LABELS[v], variable=self.mood, value=v, indicatoron=0, width=9,
                bg=PANEL2, fg=FG, selectcolor=MOOD_COLORS[v], activebackground=PANEL, activeforeground=FG,
                relief="flat", bd=0, font=FONT, pady=4, cursor="hand2",
            ).pack(side="left", padx=(0, 4))
        mk_label(self, "Notatka (opcjonalnie):", MUTED).grid(row=4, column=0, sticky="w")
        self.note = tk.StringVar()
        mk_entry(self, self.note, 40).grid(row=4, column=1, columnspan=2, sticky="w", padx=(8, 0), pady=(0, 10))

        mk_label(self, "2. Posiłek (zostaw puste, jeśli nic nie jadłeś):").grid(row=5, column=0, columnspan=3, sticky="w")
        mk_label(self, "Co jadłem:").grid(row=6, column=0, sticky="w", pady=3)
        self.what = tk.StringVar()
        ttk.Combobox(self, textvariable=self.what, values=app.store.recent_meals(), width=36).grid(
            row=6, column=1, columnspan=2, sticky="w", padx=(8, 0))
        mk_label(self, "Kiedy (godz.):").grid(row=7, column=0, sticky="w", pady=3)
        self.when = tk.StringVar(value=f"{now:%H:%M}")
        mk_entry(self, self.when, 7).grid(row=7, column=1, sticky="w", padx=(8, 0))
        mk_button(self, "Dodaj kolejny posiłek", self.add_another, small=True).grid(row=7, column=2, sticky="e")
        self.msg = RichLine(self, width=52, fg=MUTED, lines=2)
        self.msg.grid(row=8, column=0, columnspan=3, sticky="w", pady=(6, 8))
        bf = tk.Frame(self, bg=BG)
        bf.grid(row=9, column=0, columnspan=3, sticky="e")
        mk_button(bf, "Pomiń to pytanie", self.skip).pack(side="right")
        mk_button(bf, f"Zapytaj za {core.SNOOZE_MIN} min", self.snooze).pack(side="right", padx=8)
        mk_button(bf, "Zapisz odpowiedzi", self.save, accent=True).pack(side="right")
        self.present()

    def _commit_meal(self) -> bool:
        what = self.what.get().strip()
        if not what:
            return True
        hm = core.parse_hm(self.when.get())
        if not hm:
            self.msg.set("(popraw godzinę posiłku – np. 12:30)")
            return False
        ts = core.resolve_recent(hm, datetime.now())
        self.app.store.add_meal(ts, what)
        self.saved.append(f"{len(self.saved) + 1}. {ts:%H:%M} {ell(what, 30)}")
        return True

    def add_another(self):
        if not self.what.get().strip():
            self.msg.set("(wpisz najpierw, co jadłeś)")
            return
        if self._commit_meal():
            self.what.set("")
            self.when.set(f"{datetime.now():%H:%M}")
            self.msg.set("Zapisano: " + " · ".join(self.saved))

    def save(self):
        if not self._commit_meal():
            return
        mood = self.mood.get() or None
        note = self.note.get().strip()
        if mood or note:
            self.app.store.add_checkin(datetime.now(), mood, note)
        self.app.refresh_last()
        self.app.after_prompt(self, reschedule=self.auto)

    def snooze(self):
        if self.auto:
            self.app.set_next_prompt(datetime.now() + timedelta(minutes=core.SNOOZE_MIN))
        self.app.after_prompt(self, reschedule=False)

    def skip(self):
        self.app.after_prompt(self, reschedule=self.auto)

    def close(self):  # krzyżyk / Esc = odłóż
        self.snooze()


class AskMl(Dlg):
    def __init__(self, app: "RytmApp"):
        super().__init__(app, "Własna ilość", key="askml")
        mk_label(self, "Ile ml wypiłeś?", LIME, FONT_H).grid(row=0, column=0, columnspan=2, sticky="w", pady=(0, 6))
        self.ml = tk.StringVar(value=str(app.cfg["glass_ml"]))
        e = mk_entry(self, self.ml, 8)
        e.grid(row=1, column=0, sticky="w")
        mk_label(self, f"ml ({app.var_kind.get()})", PAREN).grid(row=1, column=1, sticky="w", padx=6)
        self.err = RichLine(self, width=30, fg=WARN)
        self.err.grid(row=2, column=0, columnspan=2, sticky="w", pady=4)
        bf = tk.Frame(self, bg=BG)
        bf.grid(row=3, column=0, columnspan=2, sticky="e", pady=(4, 0))
        mk_button(bf, "Anuluj", self.close).pack(side="right")
        mk_button(bf, "Dodaj do płynów", self.ok, accent=True).pack(side="right", padx=8)
        self.present()
        e.focus_set()

    def ok(self):
        try:
            v = int(self.ml.get().strip())
            if not 10 <= v <= 3000:
                raise ValueError
        except ValueError:
            self.err.set("(wpisz liczbę 10–3000)")
            return
        self.app.add_drink(v)
        self.close()


class SettingsDialog(Dlg):
    def __init__(self, app: "RytmApp"):
        super().__init__(app, f"{APP_NAME} – ustawienia", key="settings")
        st = app.store
        mk_label(self, "Ustawienia", LIME, FONT_H).grid(row=0, column=0, columnspan=3, sticky="w", pady=(0, 8))
        mk_label(self, "1. Pytaj o samopoczucie i posiłek co:").grid(row=1, column=0, sticky="w")
        self.interval = tk.StringVar(value=str(st.get_int("interval_min")))
        rf = tk.Frame(self, bg=BG)
        rf.grid(row=1, column=1, columnspan=2, sticky="w")
        for txt, val in (("1 godz.", "60"), ("2 godz.", "120"), ("wyłączone", "0")):
            tk.Radiobutton(rf, text=txt, variable=self.interval, value=val, bg=BG, fg=FG, selectcolor=PANEL2,
                           activebackground=BG, activeforeground=FG, font=FONT, bd=0, highlightthickness=0).pack(side="left", padx=4)
        self.glass = tk.StringVar(value=str(st.get_int("glass_ml")))
        self.goal = tk.StringVar(value=str(st.get_int("goal_ml")))
        self.idle = tk.StringVar(value=str(st.get_int("idle_min")))
        for i, (txt, var, w) in enumerate((
            ("2. Pojemność szklanki (ml):", self.glass, 7),
            ("3. Cel płynów na dzień (ml):", self.goal, 7),
            ("4. Uznaj przerwę po (min bez ruchu myszą/klawiaturą):", self.idle, 5),
        )):
            mk_label(self, txt).grid(row=2 + i, column=0, sticky="w", pady=3)
            mk_entry(self, var, w).grid(row=2 + i, column=1, sticky="w", padx=8)
        self.top = tk.IntVar(value=st.get_int("topmost"))
        self.auto = tk.IntVar(value=st.get_int("autostart"))
        for i, (txt, var) in enumerate((("5. Widget zawsze na wierzchu", self.top), ("6. Uruchamiaj razem z Windows", self.auto))):
            tk.Checkbutton(self, text=txt, variable=var, bg=BG, fg=FG, selectcolor=PANEL2, activebackground=BG,
                           activeforeground=FG, font=FONT, bd=0, highlightthickness=0).grid(row=5 + i, column=0, columnspan=3, sticky="w")
        self.msg = RichLine(self, width=52, fg=WARN, lines=2)
        self.msg.grid(row=7, column=0, columnspan=3, sticky="w", pady=6)
        bf = tk.Frame(self, bg=BG)
        bf.grid(row=8, column=0, columnspan=3, sticky="e")
        mk_button(bf, "Anuluj", self.close).pack(side="right")
        mk_button(bf, "Zapisz ustawienia", self.save, accent=True).pack(side="right", padx=8)
        self.present()

    def save(self):
        try:
            glass = int(self.glass.get())
            goal = int(self.goal.get())
            idle = int(self.idle.get())
            if not (50 <= glass <= 2000 and 500 <= goal <= 8000 and 1 <= idle <= 60):
                raise ValueError
        except ValueError:
            self.msg.set("(szklanka 50–2000 ml, cel 500–8000 ml, przerwa 1–60 min)")
            return
        st = self.app.store
        st.set("interval_min", self.interval.get())
        st.set("glass_ml", glass)
        st.set("goal_ml", goal)
        st.set("idle_min", idle)
        st.set("topmost", self.top.get())
        try:
            core.set_autostart(bool(self.auto.get()))
            st.set("autostart", self.auto.get())
        except Exception as e:  # prawdziwa przyczyna w komunikacie
            core.log.exception("autostart")
            self.msg.set(f"(nie udało się zmienić autostartu: {type(e).__name__}: {e})")
            return
        self.app.load_cfg()
        self.app.apply_settings()
        self.close()


class SummaryDialog(Dlg):
    def __init__(self, app: "RytmApp"):
        super().__init__(app, f"{APP_NAME} – podsumowanie dnia", key="summary")
        self.resizable(True, True)
        self.day = app.tracker.day
        top = tk.Frame(self, bg=BG)
        top.pack(fill="x", pady=(0, 6))
        mk_button(top, "Poprzedni dzień", lambda: self.go(-1), small=True).pack(side="left")
        self.title_lbl = mk_label(top, "", LIME, FONT_H)
        self.title_lbl.pack(side="left", padx=12)
        mk_button(top, "Następny dzień", lambda: self.go(1), small=True).pack(side="left")
        mk_button(top, "Dziś", lambda: self.go(0), small=True).pack(side="left", padx=6)
        wrap = tk.Frame(self, bg=BG)
        wrap.pack(fill="both", expand=True)
        self.text = tk.Text(wrap, width=70, height=30, bg=BG, fg=FG, font=FONT, bd=0, highlightthickness=1,
                            highlightbackground=BORDER, wrap="word", padx=8, pady=6, state="disabled")
        sb = tk.Scrollbar(wrap, command=self.text.yview)
        self.text.config(yscrollcommand=sb.set)
        sb.pack(side="right", fill="y")
        self.text.pack(side="left", fill="both", expand=True)
        t = self.text
        t.tag_configure("h", foreground=LIME, font=FONT_B, spacing1=8, spacing3=2)
        t.tag_configure("paren", foreground=PAREN)
        t.tag_configure("quote", foreground=QUOTE)
        t.tag_configure("z0", background=ZEBRA[0])
        t.tag_configure("z1", background=ZEBRA[1])
        self.render()
        self.present()

    def go(self, d):
        if d == 0:
            self.day = self.app.tracker.day
        else:
            self.day = core.shift_day(self.day, d)
        self.render()

    def _put(self, txt, base):
        for part in _RICH.split(txt):
            if not part:
                continue
            tag = "paren" if part.startswith("(") else ("quote" if part[0] in "„\"" else None)
            self.text.insert("end", part, tuple(base) + ((tag,) if tag else ()))
        self.text.insert("end", "\n", tuple(base))

    def render(self):
        app = self.app
        s = core.day_summary(app.store, self.day, app.tracker)
        d = datetime.strptime(self.day, "%Y-%m-%d")
        self.title_lbl.config(text=f"{WEEKDAYS[d.weekday()]} {self.day}")
        t = self.text
        t.config(state="normal")
        t.delete("1.0", "end")

        def head(x):
            t.insert("end", x + "\n", ("h",))

        def rows(items):
            if not items:
                self._put("(brak danych)", ("z0",))
            for i, line in enumerate(items, 1):
                self._put(f"{i}. {line}", ("z0" if i % 2 else "z1",))

        head("Sen")
        if s["sleep"]:
            bed, wake, dur = s["sleep"]
            rows([f"Poszedłem spać {bed:%d.%m %H:%M} → wstałem {wake:%d.%m %H:%M} ({core.fmt_dur(dur)})"])
        else:
            rows([f"({'pominięty' if s['sleep_status'] == 'skip' else 'brak wpisu'})"])
        head("Czas przy komputerze")
        span = f" (od {s['first'][11:16]} do {s['last'][11:16]})" if s["first"] and s["last"] else ""
        share = f" ({round(100 * s['web'] / s['pc'])}% czasu)" if s["pc"] > 0 else ""
        rows([f"Przy PC (aktywnie): {core.fmt_dur(s['pc'])}{span}", f"W przeglądarce: {core.fmt_dur(s['web'])}{share}"])
        head("Aplikacje (top 10)")
        rows([f"{a} – {core.fmt_dur(sec)}" for a, sec in s["apps"][:10]])
        head("Karty przeglądarki (top 15)")
        rows([f"{a}: „{ell(ti, 60)}” – {core.fmt_dur(sec)}" for a, ti, sec in s["tabs"][:15]])
        head("Posiłki")
        rows([f"{ts[11:16]} – {what}" for ts, what in s["meals"]])
        head("Samopoczucie")
        rows([f"{ts[11:16]} – {mood if mood else '–'}/5" + (f" („{note}”)" if note else "") for ts, mood, note in s["checkins"]])
        head("Płyny")
        goal = app.cfg["goal_ml"]
        parts = " · ".join(f"{k} {v} ml" for k, v in s["drinks"].items()) or "(nic nie zapisano)"
        rows([f"{parts}", f"Razem: {s['total_ml']} ml (cel {goal} ml)"])
        t.config(state="disabled")


class AboutDialog(Dlg):
    def __init__(self, app: "RytmApp"):
        super().__init__(app, "O autorze", key="about")
        mk_label(self, APP_NAME, LIME, ("Segoe UI", 16, "bold")).pack(anchor="w")
        mk_label(self, f"Wersja {APP_VERSION}", MUTED).pack(anchor="w", pady=(0, 8))
        mk_label(self, f"Autor: {APP_AUTHOR}").pack(anchor="w")
        link = mk_label(self, f"Kontakt: {APP_CONTACT}", SEA, ("Segoe UI", 9, "underline"), cursor="hand2")
        link.pack(anchor="w", pady=(2, 8))
        link.bind("<Button-1>", lambda e: webbrowser.open(f"mailto:{APP_CONTACT}"))
        mk_label(self, "Widget mierzy czas przy komputerze, w przeglądarce i na karcie,\n"
                       "pyta o sen, samopoczucie, posiłki i liczy płyny.", MUTED, justify="left").pack(anchor="w")
        mk_label(self, f"Dane: {core.data_dir()}", MUTED, FONT_S, justify="left", wraplength=380).pack(anchor="w", pady=(8, 8))
        bf = tk.Frame(self, bg=BG)
        bf.pack(anchor="e", fill="x")
        mk_button(bf, "Zamknij", self.close).pack(side="right")
        mk_button(bf, "Otwórz folder z danymi", self.open_dir).pack(side="right", padx=8)
        self.present()

    def open_dir(self):
        try:
            os.startfile(str(core.data_dir()))  # type: ignore[attr-defined]
        except Exception as e:
            messagebox.showinfo(APP_NAME, f"Nie udało się otworzyć folderu: {type(e).__name__}: {e}")


class SuggestDialog(Dlg):
    def __init__(self, app: "RytmApp"):
        super().__init__(app, "Sugestie", key="suggest")
        mk_label(self, "Co sprawiłoby, że Rytm Dnia byłby jeszcze lepszy?", LIME, FONT_H).pack(anchor="w", pady=(0, 6))
        self.box = tk.Text(self, width=56, height=8, bg=PANEL2, fg=FG, insertbackground=FG, font=FONT, bd=0,
                           highlightthickness=1, highlightbackground=BORDER, wrap="word", padx=6, pady=4)
        self.box.pack()
        self.msg = RichLine(self, width=56, fg=WARN)
        self.msg.pack(anchor="w", pady=4)
        bf = tk.Frame(self, bg=BG)
        bf.pack(fill="x")
        mk_button(bf, "Anuluj", self.close).pack(side="right")
        mk_button(bf, "Utwórz e-mail z sugestią", self.send, accent=True).pack(side="right", padx=8)
        self.present()

    def send(self):
        txt = self.box.get("1.0", "end").strip()
        if not txt:
            self.msg.set("(wpisz najpierw sugestię)")
            return
        from urllib.parse import quote

        subj = quote(f"{APP_NAME} {APP_VERSION} - sugestia")
        webbrowser.open(f"mailto:{APP_CONTACT}?subject={subj}&body={quote(txt[:1500])}")
        self.close()


# --------------------------------------------------------------------------- główny widget

class RytmApp:
    def __init__(self, smoke: bool = False):
        self.smoke = smoke
        self.exit_code = 0
        self.dialogs: dict[str, Dlg] = {}
        self.prompt: Dlg | None = None
        self.sleep_snooze_until: datetime | None = None
        self.sleep_done: str | None = None
        self.last_idle = 0.0
        self._cache: dict[str, str] = {}
        self.store = core.Store(core.data_dir() / "rytmdnia.db")
        self.probe = core.make_probe()
        now = datetime.now()
        self.tracker = core.Tracker(self.store, now, time.monotonic())
        try:
            self.store.daily_backup(core.data_dir() / "kopie", core.logical_day(now))
        except Exception:
            core.log.exception("backup")
        self.load_cfg()
        self.next_prompt = core.normalize_next_prompt(now, self.store.get("next_prompt"), self.cfg["interval_min"])
        self.store.set("next_prompt", self.next_prompt)

        self.root = tk.Tk()
        self.root.report_callback_exception = self._cb_exc
        self.root.title(APP_NAME)
        try:  # ikona okien dialogowych (Windows; w exe plik leży obok bibliotek)
            base = getattr(sys, "_MEIPASS", os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
            ico = os.path.join(base, "icon.ico")
            if os.name == "nt" and os.path.exists(ico):
                self.root.iconbitmap(default=ico)
        except tk.TclError:
            core.log.exception("ikona")
        self.k = max(1.0, self.root.winfo_fpixels("1i") / 96.0)
        self._style()
        self.var_kind = tk.StringVar(value=self.store.get("kind") if self.store.get("kind") in core.DRINK_KINDS else "Woda")
        self.var_kind.trace_add("write", lambda *a: self.store.set("kind", self.var_kind.get()))
        self.var_title = tk.StringVar(value=APP_NAME)
        self.shown_day = self.tracker.day
        self._build_main()
        self.apply_settings()
        self.refresh_hydration()
        self.refresh_last()
        self._place_window()
        self.root.after(400, self.tick)
        if smoke:
            self.root.after(200, self.run_smoke)

    # -- konfiguracja
    def load_cfg(self):
        st = self.store
        self.cfg = {
            "interval_min": st.get_int("interval_min"),
            "glass_ml": st.get_int("glass_ml") or 300,
            "goal_ml": st.get_int("goal_ml") or 2000,
            "idle_limit": max(60, st.get_int("idle_min") * 60),
        }

    def apply_settings(self):
        self.root.attributes("-topmost", bool(self.store.get_int("topmost")))
        self.btn_drink.config(text=f"Dodaj szklankę ({self.cfg['glass_ml']} ml)")
        self.refresh_hydration()
        if self.cfg["interval_min"] <= 0:
            self.set_next_prompt(None)
        elif not self.next_prompt:
            self.set_next_prompt(datetime.now() + timedelta(minutes=self.cfg["interval_min"]))

    def set_next_prompt(self, when: datetime | None):
        self.next_prompt = when.strftime(core.TS_FMT) if when else ""
        self.store.set("next_prompt", self.next_prompt)

    def _style(self):
        r = self.root
        s = ttk.Style(r)
        try:
            s.theme_use("clam")
        except tk.TclError:
            pass
        s.configure("TCombobox", fieldbackground=PANEL2, background=PANEL, foreground=FG, arrowcolor=FG,
                    bordercolor=BORDER, lightcolor=PANEL2, darkcolor=PANEL2, insertcolor=FG)
        s.map("TCombobox", fieldbackground=[("readonly", PANEL2)], foreground=[("readonly", FG)])
        r.option_add("*TCombobox*Listbox.background", PANEL2)
        r.option_add("*TCombobox*Listbox.foreground", FG)
        r.option_add("*TCombobox*Listbox.selectBackground", SEA_D)

    # -- budowa okna
    def _link(self, parent, text, cmd):
        lb = tk.Label(parent, text=text, bg=BAR, fg=MUTED, font=FONT_S, cursor="hand2", padx=6)
        lb.bind("<Button-1>", lambda e: cmd())
        lb.bind("<Enter>", lambda e: lb.config(fg=LIME))
        lb.bind("<Leave>", lambda e: lb.config(fg=MUTED))
        return lb

    def _build_main(self):
        r = self.root
        r.overrideredirect(True)
        r.configure(bg=BORDER)
        outer = tk.Frame(r, bg=BG)
        outer.pack(fill="both", expand=True, padx=1, pady=1)
        self.bar = tk.Frame(outer, bg=BAR)
        self.bar.pack(fill="x")
        self.title_lbl = tk.Label(self.bar, textvariable=self.var_title, bg=BAR, fg=LIME, font=FONT_B, anchor="w", padx=8, pady=3)
        self.title_lbl.pack(side="left", fill="x", expand=True)
        self._link(self.bar, "✕", self.quit).pack(side="right")
        self._link(self.bar, "Menu", self.show_menu_btn).pack(side="right")
        self.lnk_compact = self._link(self.bar, "Zwiń", self.toggle_compact)
        self.lnk_compact.pack(side="right")
        for w in (self.bar, self.title_lbl):
            w.bind("<ButtonPress-1>", self._drag_start)
            w.bind("<B1-Motion>", self._drag_move)
            w.bind("<ButtonRelease-1>", self._drag_end)

        self.body = tk.Frame(outer, bg=BG, padx=10, pady=8)
        b = self.body
        stats = tk.Frame(b, bg=BG)
        stats.pack(fill="x")
        for i, (cap, color, attr) in enumerate((("czas przy PC", LIME, "lbl_pc"), ("w przeglądarce", SEA, "lbl_web"))):
            f = tk.Frame(stats, bg=BG)
            f.pack(side="left", expand=True, fill="x")
            lb = tk.Label(f, text="0:00", bg=BG, fg=color, font=FONT_BIG, anchor="w")
            lb.pack(anchor="w")
            setattr(self, attr, lb)
            mk_label(f, cap, MUTED, FONT_S, anchor="w").pack(anchor="w")
        self.lbl_app = mk_label(b, "—", FG, FONT_B, anchor="w")
        self.lbl_app.pack(fill="x", pady=(8, 0))
        self.lbl_tab = RichLine(b, width=40)
        self.lbl_tab.pack(fill="x")
        self.lbl_meta = RichLine(b, width=40, fg=MUTED)
        self.lbl_meta.pack(fill="x")
        tk.Frame(b, bg=BORDER, height=1).pack(fill="x", pady=8)

        kf = tk.Frame(b, bg=BG)
        kf.pack(fill="x")
        mk_label(kf, "Płyny:", MUTED, FONT_S).pack(side="left", padx=(0, 4))
        for kind in core.DRINK_KINDS:
            tk.Radiobutton(kf, text=kind, variable=self.var_kind, value=kind, indicatoron=0, bg=PANEL2, fg=FG,
                           selectcolor=SEA_D, activebackground=PANEL, activeforeground=FG, relief="flat", bd=0,
                           font=FONT_S, padx=7, pady=2, cursor="hand2").pack(side="left", padx=2)
        self.btn_drink = mk_button(b, "Dodaj szklankę", self.add_drink, accent=True)
        self.btn_drink.pack(fill="x", pady=(6, 4))
        self.btn_drink.bind("<Button-3>", self.drink_menu)
        self.bar_canvas = tk.Canvas(b, width=int(250 * self.k), height=int(6 * self.k), bg=PANEL, bd=0, highlightthickness=0)
        self.bar_canvas.pack(fill="x")
        self.lbl_ml = RichLine(b, width=40, fg=FG, lines=2)
        self.lbl_ml.pack(fill="x", pady=(3, 0))
        tk.Frame(b, bg=BORDER, height=1).pack(fill="x", pady=8)
        self.lbl_meal = RichLine(b, width=40, fg=MUTED, lines=2)
        self.lbl_meal.pack(fill="x")
        self.lbl_mood = RichLine(b, width=40, fg=MUTED)
        self.lbl_mood.pack(fill="x")
        self.body.pack(fill="x")
        r.bind("<Button-3>", self.show_menu_event)
        self.apply_compact()

    def _place_window(self):
        r = self.root
        r.update_idletasks()
        w, h = r.winfo_reqwidth(), r.winfo_reqheight()
        sw, sh = r.winfo_screenwidth(), r.winfo_screenheight()
        try:
            x, y = int(self.store.get("x")), int(self.store.get("y"))
        except ValueError:
            x, y = sw - w - 24, sh - h - 80
        x = min(max(0, x), max(0, sw - 60))
        y = min(max(0, y), max(0, sh - 40))
        r.geometry(f"+{x}+{y}")

    def _drag_start(self, e):
        self._dx, self._dy = e.x_root - self.root.winfo_x(), e.y_root - self.root.winfo_y()

    def _drag_move(self, e):
        self.root.geometry(f"+{e.x_root - self._dx}+{e.y_root - self._dy}")

    def _drag_end(self, e):
        self.store.set("x", self.root.winfo_x())
        self.store.set("y", self.root.winfo_y())

    # -- tryb zwinięty
    def toggle_compact(self):
        self.store.set("compact", 0 if self.store.get_int("compact") else 1)
        self.apply_compact()

    def apply_compact(self):
        if self.store.get_int("compact"):
            self.body.pack_forget()
            self.lnk_compact.config(text="Rozwiń")
        else:
            self.body.pack(fill="x")
            self.var_title.set(APP_NAME)
            self.lnk_compact.config(text="Zwiń")
        self._cache.clear()
        self.root.update_idletasks()
        if self.root.winfo_viewable():
            self._place_window()

    # -- menu
    def _menu(self) -> tk.Menu:
        m = tk.Menu(self.root, tearoff=0, bg=PANEL, fg=FG, activebackground=SEA, activeforeground=BG, bd=0, font=FONT)
        items = [
            ("Podsumowanie dnia…", lambda: self.open_dialog("summary", SummaryDialog)),
            ("Zapytaj teraz o samopoczucie i posiłek…", lambda: self.open_checkin(False)),
            ("Wpisz lub popraw sen…", lambda: self.open_sleep(False)),
            None,
            ("Ustawienia…", lambda: self.open_dialog("settings", SettingsDialog)),
            ("Eksport danych do CSV…", self.export),
            ("Sugestie…", lambda: self.open_dialog("suggest", SuggestDialog)),
            ("O autorze", lambda: self.open_dialog("about", AboutDialog)),
            None,
            ("Zakończ Rytm Dnia", self.quit),
        ]
        for it in items:
            if it is None:
                m.add_separator()
            else:
                m.add_command(label=it[0], command=it[1])
        return m

    def _popup(self, menu: tk.Menu, x: int, y: int):
        try:
            menu.tk_popup(x, y)
        finally:
            menu.grab_release()

    def show_menu_btn(self):
        self._popup(self._menu(), self.root.winfo_rootx() + self.root.winfo_width() - 150, self.root.winfo_rooty() + 24)

    def show_menu_event(self, e):
        self._popup(self._menu(), e.x_root, e.y_root)

    def drink_menu(self, e):
        m = tk.Menu(self.root, tearoff=0, bg=PANEL, fg=FG, activebackground=SEA, activeforeground=BG, bd=0, font=FONT)
        for ml in (150, 250, 500):
            m.add_command(label=f"Dodaj {ml} ml ({self.var_kind.get()})", command=lambda v=ml: self.add_drink(v))
        m.add_command(label="Dodaj własną ilość…", command=lambda: self.open_dialog("askml", AskMl))
        m.add_separator()
        m.add_command(label="Cofnij ostatni wpis płynów", command=self.undo_drink)
        self._popup(m, e.x_root, e.y_root)
        return "break"

    def open_dialog(self, key, cls):
        d = self.dialogs.get(key)
        if d is not None:
            try:
                d.lift()
                return d
            except tk.TclError:
                self.dialogs.pop(key, None)
        return cls(self)

    # -- płyny
    def add_drink(self, ml: int | None = None):
        ml = int(ml or self.cfg["glass_ml"])
        self.store.add_drink(datetime.now(), self.var_kind.get(), ml)
        self.refresh_hydration()

    def undo_drink(self):
        self.store.undo_last_drink(self.tracker.day)
        self.refresh_hydration()

    def refresh_hydration(self):
        totals = self.store.drink_totals(self.tracker.day)
        total = sum(totals.values())
        goal = max(1, self.cfg["goal_ml"])
        self.total_ml = total
        c = self.bar_canvas
        c.delete("all")
        w = max(1, c.winfo_width() if c.winfo_width() > 1 else int(250 * self.k))
        h = int(6 * self.k)
        c.create_rectangle(0, 0, int(w * min(1.0, total / goal)), h, fill=SEA if total < goal else LIME, width=0)
        parts = " · ".join(f"{k} {v}" for k, v in totals.items() if v) or "(jeszcze nic)"
        self.lbl_ml.set(f"{total} / {goal} ml  ({parts})")
        self._cache.pop("title", None)

    def refresh_last(self):
        now = datetime.now()
        lm = self.store.last_meal()
        if lm:
            self.lbl_meal.set(f"Posiłek: {lm[0][11:16]} „{ell(lm[1], 22)}” ({core.ago(now, lm[0])})")
        else:
            self.lbl_meal.set("Posiłek: (brak wpisów)")
        lc = self.store.last_checkin()
        self.lbl_mood.set(f"Samopoczucie: {lc[1]}/5 ({lc[0][11:16]})" if lc else "Samopoczucie: (brak wpisów)")

    # -- pętla
    def tick(self):
        try:
            self.tick_once()
        except Exception:
            core.log.exception("tick")
        finally:
            delay = core.IDLE_TICK_SEC if self.tracker.idle else core.TICK_SEC
            self.root.after(int(delay * 1000), self.tick)

    def tick_once(self):
        now = datetime.now()
        idle = self.probe.idle_seconds()
        self.last_idle = idle
        self.tracker.tick(now, time.monotonic(), self.probe.foreground(), idle, self.cfg["idle_limit"])
        if self.tracker.day != self.shown_day:
            self.shown_day = self.tracker.day
            self.refresh_hydration()
        self.update_stats()
        if not self.smoke:
            self.check_prompts(now, idle)

    def _set(self, key, widget, text, **kw):
        if self._cache.get(key) != text:
            self._cache[key] = text
            widget.config(text=text, **kw)

    def update_stats(self):
        tr = self.tracker
        pc, web = core.fmt_hm(tr.pc), core.fmt_hm(tr.web)
        if self.store.get_int("compact"):
            v = f"PC {pc} · Web {web} · {self.total_ml} ml"
            if self.var_title.get() != v:
                self.var_title.set(v)
            return
        self._set("pc", self.lbl_pc, pc)
        self._set("web", self.lbl_web, web)
        act = tr.current
        if act is None:
            app, title, meta = "—", "(brak aktywnego okna)", ""
        elif tr.idle:
            app, title = "Przerwa", f"Bez aktywności od {int(self.last_idle // 60)} min"
            meta = f"(przerwa nie liczy się; ostatnio: {act.app})"
        else:
            app = f"{act.app} · aktywna karta" if act.is_browser else act.app
            title = ell(act.title, 38)
            meta = f"(dziś tutaj: {core.fmt_dur(tr.current_seconds())})"
        self._set("app", self.lbl_app, app)
        self.lbl_tab.set(title)
        self.lbl_meta.set(meta)

    def check_prompts(self, now: datetime, idle: float):
        if self.prompt is not None or idle >= 60:
            return
        if self.sleep_done != self.tracker.day:
            if not core.need_sleep_question(self.store, now):
                self.sleep_done = self.tracker.day
            elif not self.sleep_snooze_until or now >= self.sleep_snooze_until:
                self.open_sleep(True)
                return
        if core.prompt_due(now, self.next_prompt, self.cfg["interval_min"], idle):
            self.open_checkin(True)

    def open_sleep(self, auto: bool):
        if self.prompt is not None:
            self.prompt.lift()
            return
        self.prompt = SleepDialog(self, auto)

    def open_checkin(self, auto: bool):
        if self.prompt is not None:
            self.prompt.lift()
            return
        self.prompt = CheckinDialog(self, auto)

    def after_prompt(self, dlg: Dlg, reschedule: bool):
        if reschedule and self.cfg["interval_min"] > 0:
            self.set_next_prompt(datetime.now() + timedelta(minutes=self.cfg["interval_min"]))
        if self.prompt is dlg:
            self.prompt = None
        Dlg.close(dlg)
        self.refresh_last()

    # -- eksport / koniec
    def export(self):
        folder = filedialog.askdirectory(title="Wybierz folder, do którego zapisać pliki CSV")
        if not folder:
            return
        try:
            self.tracker.flush()
            files = core.export_csv(self.store, core.Path(folder), core.logical_day(datetime.now()))
            messagebox.showinfo(APP_NAME, "Zapisano:\n" + "\n".join(str(f) for f in files))
        except Exception as e:
            core.log.exception("export")
            messagebox.showerror(APP_NAME, f"Eksport nie powiódł się: {type(e).__name__}: {e}")

    def quit(self):
        try:
            self.tracker.flush()
            self.store.close()
        finally:
            self.root.destroy()

    def _cb_exc(self, exc, val, tb):
        core.log.error("callback: %s", "".join(traceback.format_exception(exc, val, tb)))
        if self.smoke:
            self.exit_code = 1
            print("BŁĄD w callbacku:", "".join(traceback.format_exception(exc, val, tb)))

    def run(self):
        self.root.mainloop()

    # -- test dymny (CI: python rytm_dnia.py --smoke)
    def run_smoke(self):
        try:
            fake = core.FakeProbe([("chrome.exe", "YouTube - Google Chrome"), ("EXCEL.EXE", "Budżet.xlsx - Excel")])
            base, mono = datetime.now(), self.tracker.last_mono
            for i in range(10):
                mono += 2
                self.tracker.tick(base + timedelta(seconds=2 * (i + 1)), mono, fake.foreground(), 0.0, 300)
            assert self.tracker.pc >= 18, f"pc={self.tracker.pc}"
            assert self.tracker.web >= 8, f"web={self.tracker.web}"
            self.update_stats()
            real = core.make_probe()
            print("sonda:", type(real).__name__, "okno:", real.foreground(), "bezczynność:", round(real.idle_seconds(), 1))
            self.probe = real
            self.tick_once()
            self.add_drink(300)
            self.add_drink(150)
            self.var_kind.set("Kawa")
            self.add_drink()
            assert self.total_ml == 300 + 150 + self.cfg["glass_ml"], self.total_ml
            self.undo_drink()
            self.store.add_meal(datetime.now(), "Jajka")
            self.store.add_checkin(datetime.now(), 4, "ok")
            self.refresh_last()
            self.toggle_compact()
            self.root.update()
            self.toggle_compact()
            self.root.update()
            for key, cls in (("summary", SummaryDialog), ("settings", SettingsDialog), ("about", AboutDialog),
                             ("suggest", SuggestDialog), ("askml", AskMl)):
                d = self.open_dialog(key, cls)
                self.root.update()
                d.close()
            for cls in (SleepDialog, CheckinDialog):
                d = cls(self, False)
                self.root.update()
                Dlg.close(d)
            self.tracker.flush()
            files = core.export_csv(self.store, core.data_dir() / "eksport_smoke", "smoke")
            assert all(f.exists() for f in files)
            print("SMOKE OK")
        except Exception:
            traceback.print_exc()
            core.log.exception("smoke")
            self.exit_code = 1
        finally:
            self.root.after(100, self.quit)


def main(argv=None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    smoke = "--smoke" in argv
    log_path = core.setup_logging()
    core.enable_dpi_awareness()
    if not smoke and not core.acquire_single_instance():
        r = tk.Tk()
        r.withdraw()
        messagebox.showinfo(APP_NAME, "Rytm Dnia już działa – widget jest na pulpicie.")
        r.destroy()
        return 0
    try:
        app = RytmApp(smoke=smoke)
    except Exception as e:
        core.log.exception("start")
        r = tk.Tk()
        r.withdraw()
        messagebox.showerror(APP_NAME, f"Nie udało się uruchomić: {type(e).__name__}: {e}\nLog: {log_path}")
        r.destroy()
        return 1
    app.run()
    return app.exit_code


if __name__ == "__main__":
    sys.exit(main())
