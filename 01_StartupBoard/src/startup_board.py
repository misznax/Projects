#!/usr/bin/env python3
"""Startup Board - do 8 swobodnych paneli roboczych z pamięcią stanu.

Skróty: Ctrl+N nowy plik | Ctrl+O otwórz | Ctrl+S zapisz | Ctrl+Shift+S zapisz jako | Ctrl+W zamknij plik
        Ctrl+F znajdź (F3 / Shift+F3 dalej / wstecz) | Ctrl+Shift+O folder w panelu (F5 kopiuj, F6 przenieś, F7 nowy folder) | Ctrl+V wklej tekst/obraz/plik do pustego panelu | Ctrl+Shift+V obraz
        Ctrl+, ustawienia | Ctrl+M pokaż/ukryj pasek menu | Ctrl+Shift+E układ siatki | Alt+1..8 panel
Panele: przeciągaj za pasek tytułowy, zmieniaj rozmiar łapiąc krawędź/róg.
        Przyciąganie magnetyczne do krawędzi innych paneli (Alt = wyłącz).
"""
from __future__ import annotations

import base64
import codecs
import hashlib
import json
import math
import os
import re
import shutil
import uuid
from datetime import datetime, timedelta
import sys
import tempfile
import time
from functools import lru_cache
from pathlib import Path

from PySide6.QtCore import (QByteArray, QEvent, QLockFile, QPoint, QPointF, QRect, QRectF, QSize, QStandardPaths,
                            Qt, QThread, QTimer, QUrl, Signal)
from PySide6.QtGui import (QAction, QActionGroup, QColor, QDesktopServices, QFont, QIcon, QImage, QImageReader,
                           QKeySequence, QLinearGradient, QPainter, QPalette, QPen, QPixmap, QPolygonF, QShortcut, QSyntaxHighlighter,
                           QTextCharFormat, QTextCursor, QTextDocument, QBrush)
from PySide6.QtWidgets import (
    QAbstractButton, QApplication, QBoxLayout, QButtonGroup, QCheckBox, QColorDialog, QComboBox, QDialog, QFileDialog,
    QFrame, QGridLayout, QGroupBox, QHBoxLayout, QInputDialog, QLabel, QLineEdit, QListWidget, QListWidgetItem,
    QMainWindow, QMenu, QMessageBox, QPlainTextEdit, QPushButton, QScrollArea, QSizePolicy, QSpinBox, QStackedWidget,
    QToolButton, QVBoxLayout, QWidget,
)
from PySide6.QtWidgets import QAbstractItemView, QFileIconProvider, QFileSystemModel, QHeaderView, QTreeView
from PySide6.QtCore import QDate, QDateTime, QDir, QFile, QTime
from PySide6.QtWidgets import QDateEdit, QTimeEdit

APP_NAME = "Startup Board"
APP_VERSION = "v1.1"  # zmieniać tylko na polecenie autora
APP_AUTHOR = "Michał Rzekiecki"
APP_CONTACT = "kontakt@smialo.org"

MAX_BYTES = 10 * 1024 * 1024        # limit pliku tekstowego
MAX_PDF_BYTES = 200 * 1024 * 1024   # limit PDF
MAX_IMG_BYTES = 60 * 1024 * 1024    # limit pliku obrazu
MAX_IMG_PIXELS = 120_000_000        # limit rozdzielczości obrazu (pamięć)
IMG_EXTS = {".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp", ".ico", ".tif", ".tiff"}
HL_MAX_CHARS = 2_000_000            # powyżej: bez kolorowania
STATE_VERSION = 2
FONTS = ["Consolas", "Arial", "Courier New", "Segoe UI"]
MONO = {"Consolas", "Courier New"}
LANGS = [("auto", "Automatycznie (wg rozszerzenia)"), ("text", "Zwykły tekst"),
         ("python", "Python"), ("html", "HTML"), ("sql", "SQL")]
BORDERS = [1, 2, 3, 4, 6, 8, 0]  # grubość ramki w px (0 = brak)
DEFAULT_BORDER = 2
DEFAULT_SCHEME = "morze"
LOOK_VERSION = 2  # wygląd v2 (Morze i limonka); starszy stan jest raz przestawiany na nowy domyślny motyw
DEFAULT_PANES, MAX_PANES = 6, 8
SCHEME_ORDER = ["morze", "morze_j", "night", "graphite", "contrast", "light", "paper"]
ICON_COLORS = [("sealime", "Morze i limonka", "grad"), ("lime", "Limonkowy", "#b8e642"), ("sea", "Morski", "#12a6b0"),
               ("red", "Czerwony", "#e53935"), ("orange", "Pomarańczowy", "#fb8c00"),
               ("yellow", "Żółty", "#fdd835"), ("green", "Zielony", "#43a047"),
               ("cyan", "Turkusowy", "#00acc1"), ("blue", "Niebieski", "#1e88e5"),
               ("purple", "Fioletowy", "#8e24aa"), ("pink", "Różowy", "#ec407a")]
EXT_LANG = {".py": "python", ".pyw": "python", ".html": "html", ".htm": "html",
            ".xhtml": "html", ".sql": "sql"}
LAST = {"dir": ""}        # ostatnio używany folder w oknach wyboru pliku (zapisywany w stanie)
AUTO = {"on": True, "ms": 2000}   # autozapis plików tekstowych: włączony, zapis 2 s po ostatniej zmianie
HIST = {"dir": None, "keep": 5, "gap": 120.0, "last": {}}  # historia wersji: folder, ile kopii, min. odstęp (s), czasy
THEME = {"dark": True, "grad": True}  # ciemny schemat (pasek tytułu okien); gradient włączony


def grad(c1: str, c2: str, diag: bool = False) -> str:
    """Subtelny gradient w stylesheet (lewo -> prawo albo po przekątnej); wyłączony lub równe kolory = jeden kolor."""
    if c1 == c2 or not THEME.get("grad", True):
        return c1
    return f"qlineargradient(x1:0,y1:0,x2:1,y2:{1 if diag else 0},stop:0 {c1},stop:1 {c2})"


def hdr_css(active: bool) -> str:
    u = UI
    bg = grad(u["hdr_bg_a"], u["hdr_bg_a2"]) if active else grad(u["hdr_bg"], u["hdr_bg2"])
    line = u["border_a"] if active else u["border"]
    return (f"#hdr{{background:{bg};border-bottom:1px solid {line};}}"
            f"#hdr QLabel{{color:{u['hdr_fg']};font-size:8pt;}}"
            f"#hdr QToolButton{{border:none;color:{u['mute']};padding:0 5px;font-size:9pt;}}"
            f"#hdr QToolButton:hover{{background:{u['border']};color:{u['border_a']};}}"
            f"#hdr QToolButton:checked{{color:{u['hdr_fg']};}}")


def scroll_css(sel: str) -> str:
    """Cienkie, spokojne paski przewijania w kolorach motywu (hover = kolor akcentu)."""
    u = UI
    return (f"{sel} QScrollBar:vertical{{background:transparent;width:11px;margin:0;}}"
            f"{sel} QScrollBar:horizontal{{background:transparent;height:11px;margin:0;}}"
            f"{sel} QScrollBar::handle:vertical{{background:{u['border']};min-height:28px;border-radius:4px;margin:2px;}}"
            f"{sel} QScrollBar::handle:horizontal{{background:{u['border']};min-width:28px;border-radius:4px;margin:2px;}}"
            f"{sel} QScrollBar::handle:hover{{background:{u['border_a']};}}"
            f"{sel} QScrollBar::add-line,{sel} QScrollBar::sub-line{{width:0;height:0;}}"
            f"{sel} QScrollBar::add-page,{sel} QScrollBar::sub-page{{background:none;}}")


def app_css() -> str:
    """Globalny arkusz: cienkie paski przewijania, menu i podpowiedzi w kolorach motywu."""
    u = UI
    return (scroll_css("")
            + f"QMenuBar{{background:{grad(u['hdr_bg'], u['hdr_bg2'])};color:{u['hdr_fg']};"
              f"border-bottom:1px solid {u['border']};}}"
              f"QMenuBar::item{{background:transparent;padding:4px 10px;}}"
              f"QMenuBar::item:selected{{background:{u['border']};color:{u['border_a']};}}"
              f"QMenu{{background:{u['hdr_bg']};color:{u['hdr_fg']};border:1px solid {u['border_a']};padding:4px 0;}}"
              f"QMenu::item{{padding:5px 28px 5px 26px;}}"
              f"QMenu::item:selected{{background:{u['sel']};color:{COLORS['text']};}}"
              f"QMenu::item:disabled{{color:{u['mute']};}}"
              f"QMenu::separator{{height:1px;background:{u['border']};margin:4px 8px;}}"
              f"QMenu::icon{{padding-left:6px;}}"
              f"QMenu::indicator{{width:14px;height:14px;left:6px;}}"
              f"QToolTip{{background:{u['hdr_bg']};color:{u['hdr_fg']};border:1px solid {u['border_a']};padding:3px 5px;}}")


# ---------- pomocnicze ----------

def human_size(n: float) -> str:
    if n < 1024:
        return f"{int(n)} B"
    for unit in ("KB", "MB", "GB"):
        n /= 1024
        if n < 1024 or unit == "GB":
            return f"{n:.1f} {unit}"
    return ""


def decode_bytes(raw: bytes) -> tuple[str, str]:
    if raw.startswith(codecs.BOM_UTF8):
        return raw.decode("utf-8-sig"), "utf-8-sig"
    if raw.startswith((codecs.BOM_UTF16_LE, codecs.BOM_UTF16_BE)):
        return raw.decode("utf-16"), "utf-16"
    for enc in ("utf-8", "cp1250"):
        try:
            return raw.decode(enc), enc
        except UnicodeDecodeError:
            pass
    return raw.decode("latin-1"), "latin-1"


def atomic_write(path: Path, data: bytes) -> None:
    """Zapis przez plik tymczasowy; na Windowsie ponawia, gdy plik chwilowo zablokowany (AV, sync)."""
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix=".sb_", suffix=".tmp")
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(data)
        for _ in range(10):
            try:
                os.replace(tmp, path)
                return
            except OSError:
                time.sleep(0.05)
        path.write_bytes(data)  # ostatnia deska ratunku: zapis bezpośredni
        os.unlink(tmp)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def hist_dir(path: str) -> Path | None:
    """Folder z kopiami jednego pliku: <stan>/historia/<nazwa>_<skrót ścieżki>."""
    if HIST["dir"] is None:
        return None
    key = hashlib.sha1(os.path.normcase(os.path.abspath(path)).encode("utf-8", "replace")).hexdigest()[:10]
    name = re.sub(r'[\\/:*?"<>|]', "_", Path(path).stem)[:40] or "plik"
    return Path(HIST["dir"]) / f"{name}_{key}"


def hist_list(path: str) -> list[Path]:
    """Kopie pliku od najnowszej."""
    d = hist_dir(path)
    if d is None or not d.is_dir():
        return []
    try:
        return sorted((f for f in d.iterdir() if f.is_file()), key=lambda f: f.name, reverse=True)
    except OSError:
        return []


def hist_push(path: str, data: bytes) -> bool:
    """Dodaj kopię (pomija identyczną z najnowszą), zostaw ostatnie HIST['keep']."""
    d = hist_dir(path)
    if d is None or not data:
        return False
    try:
        items = hist_list(path)
        if items and items[0].read_bytes() == data:
            return False
        d.mkdir(parents=True, exist_ok=True)
        base = time.strftime("%Y%m%d-%H%M%S")
        suf, n = Path(path).suffix, 1
        f = d / f"{base}{suf}"
        while f.exists():
            n += 1
            f = d / f"{base}_{n}{suf}"
        f.write_bytes(data)
        for old in hist_list(path)[HIST["keep"]:]:
            old.unlink(missing_ok=True)
        return True
    except OSError:
        return False


def star_pixmap(color: str, size: int) -> QPixmap:
    pm = QPixmap(size, size)
    pm.fill(Qt.GlobalColor.transparent)
    p = QPainter(pm)
    p.setRenderHint(QPainter.RenderHint.Antialiasing)
    if color == "grad":  # logo "SB": zaokrąglony kafel limonka -> morski, ciemne litery
        m = size * 0.02
        g = QLinearGradient(0, 0, size, size)
        g.setColorAt(0, QColor("#c6ef4a"))
        g.setColorAt(1, QColor("#0fa3ad"))
        p.setBrush(QBrush(g))
        p.setPen(QPen(QColor("#04161c"), max(1.0, size / 40)))
        p.drawRoundedRect(QRectF(m, m, size - 2 * m, size - 2 * m), size * 0.2, size * 0.2)
        f = QFont()
        f.setFamilies(["Segoe UI", "Arial", "DejaVu Sans"])
        f.setBold(True)
        f.setPixelSize(max(6, int(size * 0.66)))
        f.setLetterSpacing(QFont.SpacingType.PercentageSpacing, 86)
        p.setFont(f)
        p.setPen(QColor("#04161c"))
        p.drawText(QRectF(0, size * 0.015, size, size), Qt.AlignmentFlag.AlignCenter, "SB")
        p.end()
        return pm
    cx, cy, R = size / 2, size / 2 + size * 0.03, size * 0.47
    pts = [QPointF(cx + (R if i % 2 == 0 else R * 0.42) * math.sin(i * math.pi / 5),
                   cy - (R if i % 2 == 0 else R * 0.42) * math.cos(i * math.pi / 5)) for i in range(10)]
    if color == "grad":  # limonka -> morski
        g = QLinearGradient(0, 0, size, size)
        g.setColorAt(0, QColor("#c6ef4a"))
        g.setColorAt(1, QColor("#0fa3ad"))
        p.setBrush(QBrush(g))
        col = QColor("#0fa3ad")
    else:
        col = QColor(color)
        p.setBrush(col)
    pen = QPen(col.darker(160), max(1.0, size / 14))
    pen.setJoinStyle(Qt.PenJoinStyle.RoundJoin)
    p.setPen(pen)
    p.drawPolygon(QPolygonF(pts))
    p.end()
    return pm


def star_icon(color: str) -> QIcon:
    ic = QIcon()
    for sz in (16, 24, 32, 48, 64, 128, 256):
        ic.addPixmap(star_pixmap(color, sz))
    return ic


def clipboard_image_source() -> str | None:
    """Co jest w schowku: "image" (obraz), "file" (skopiowany plik graficzny) albo None."""
    md = QApplication.clipboard().mimeData()
    if md is None:
        return None
    if md.hasImage():
        return "image"
    if md.hasUrls() and any(u.isLocalFile() and Path(u.toLocalFile()).suffix.lower() in IMG_EXTS for u in md.urls()):
        return "file"
    return None


def set_titlebar_dark(w: QWidget, dark: bool):
    """Windows 10/11: ciemny lub jasny pasek tytułu okna zgodnie ze schematem."""
    if sys.platform != "win32" or not w.isVisible():
        return
    try:
        import ctypes
        v = ctypes.c_int(1 if dark else 0)
        for attr in (20, 19):
            ctypes.windll.dwmapi.DwmSetWindowAttribute(int(w.winId()), attr, ctypes.byref(v), ctypes.sizeof(v))
    except Exception:
        pass


class ThemedDialog(QDialog):
    """Okno dialogowe z paskiem tytułu zgodnym ze schematem kolorów."""

    def showEvent(self, e):
        super().showEvent(e)
        set_titlebar_dark(self, THEME["dark"])


# ---------- kolorowanie składni (Python / HTML / SQL + cyfry) ----------

def _fmt(color: str, bold=False, italic=False, underline=False) -> QTextCharFormat:
    f = QTextCharFormat()
    f.setForeground(QColor(color))
    if bold:
        f.setFontWeight(QFont.Weight.Bold)
    if italic:
        f.setFontItalic(True)
    if underline:
        f.setFontUnderline(True)
    return f


# Gotowe schematy: każdy kolor ma policzony kontrast względem tła (jasne >= 4.8:1, ciemne >= 6:1).
SCHEMES = {
    "morze": {"name": 'Ciemny – Morze i limonka (domyślny)', "dark": True,
        "colors": {"bg": "#071e25", "text": "#e4f3ef", "com": "#7fa9a5", "kw": "#b8e642", "kw2": "#f8a0ef", "const": "#f9aab7", "num": "#f6ad86", "str": "#11dd47", "func": "#eeb519", "builtin": "#6cc9f4", "cls": "#10d8ad", "deco": "#aebdf9", "tag": "#f8a7bc", "attr": "#dfbd11", "link": "#7fc6f5", "date": "#10d8b0", "mark": "#f9aab0",
                   "p;": "#f8ab9b", "p*/%": "#f7ca90", "p!": "#cac30f",
                   "p()": "#9ae811", "p{}": "#3fda10", "p+": "#33f052",
                   "p[]": "#10da83", "p-": "#12ebe4", "p,.:": "#78c7f5",
                   "p=": "#c4d1fb", "p<>": "#c1b5f9", "p_": "#e4c6fb",
                   "p\\@$": "#f5a0f8", "p?": "#fac1e5", "p&|^~": "#f9aabc",
        },
        "ui": {"hdr_bg": "#0c353f", "hdr_bg2": "#1d463f", "hdr_bg_a": "#0f4753", "hdr_bg_a2": "#33694e", "hdr_fg": "#e6f5f1", "mute": "#86adaa", "border": "#17525c", "border2": "#1d5d4c", "border_a": "#b5e43a", "border_a2": "#22b8bd", "canvas": "#04161c", "canvas2": "#0a2b2a", "sel": "#2c6b3a", "ok": "#9bdc4a", "warn": "#f2b84b", "err": "#ff8a80", "info": "#4fd1d6"}},
    "morze_j": {"name": 'Jasny – Morze i limonka', "dark": False,
        "colors": {"bg": "#f7fbf8", "text": "#10303a", "com": "#527174", "kw": "#4d7a00", "kw2": "#c316b2", "const": "#d51837", "num": "#b54d14", "str": "#0e7e2c", "func": "#87670f", "builtin": "#1275a3", "cls": "#0e7c64", "deco": "#1942e6", "tag": "#d51847", "attr": "#7e6c0e", "link": "#1472b1", "date": "#0e7c66", "mark": "#d81828",
                   "p;": "#cc3517", "p*/%": "#87530f", "p!": "#736f0d",
                   "p()": "#46670b", "p{}": "#287e0e", "p+": "#0c6e1d",
                   "p[]": "#0e7c4c", "p-": "#0c6a66", "p,.:": "#1372aa",
                   "p=": "#1949e6", "p<>": "#3b19e6", "p_": "#8919df",
                   "p\\@$": "#bd16c3", "p?": "#b31479", "p&|^~": "#d51844",
        },
        "ui": {"hdr_bg": "#d5ebe9", "hdr_bg2": "#e1efcf", "hdr_bg_a": "#bfe2e3", "hdr_bg_a2": "#d4eba3", "hdr_fg": "#0d3039", "mute": "#3f6266", "border": "#a6cfd0", "border2": "#bfd9a6", "border_a": "#0f8a94", "border_a2": "#7fb516", "canvas": "#dcefec", "canvas2": "#e9f3d6", "sel": "#c4e88f", "ok": "#27701a", "warn": "#a85d00", "err": "#b3261e", "info": "#0b7482"}},
    "night": {"name": 'Ciemny – Nocna sowa (jak na miniaturce)', "dark": True,
        "colors": {"bg": "#0b1529", "text": "#e3ebf7", "com": "#8da0bd", "kw": "#c29cf7", "kw2": "#f589c6", "const": "#f6918b", "num": "#ec9c13", "str": "#12e23f", "func": "#b3b30f", "builtin": "#92c8f6", "cls": "#10c67a", "deco": "#92aaf6", "tag": "#f68ea4", "attr": "#cdab11", "link": "#8eaaf6", "date": "#10bfc8", "mark": "#f68ea3",
                   "p;": "#f69090", "p*/%": "#f6b495", "p!": "#d0c611",
                   "p()": "#8ebd0f", "p{}": "#67de12", "p+": "#23c810",
                   "p[]": "#10c671", "p-": "#12dbbd", "p,.:": "#12bddb",
                   "p=": "#95aaf6", "p<>": "#c3bdfa", "p_": "#e5aff8",
                   "p\\@$": "#f582ef", "p?": "#f8aadc", "p&|^~": "#f68eaf",
        },
        "ui": {"hdr_bg": "#15233f", "hdr_bg_a": "#1d3358", "hdr_fg": "#d7e2f5", "mute": "#8da0bd", "border": "#2a3d62", "border_a": "#7aa7d9", "canvas": "#060d1c", "sel": "#2a4a80", "ok": "#4cc38a", "warn": "#f0994c", "err": "#ff7b7b", "info": "#7aa7d9"}},
    "graphite": {"name": 'Ciemny – grafit', "dark": True,
        "colors": {"bg": "#1e1e1e", "text": "#e6e6e6", "com": "#9aa0a6", "kw": "#c7a5f5", "kw2": "#f498cc", "const": "#f49f9a", "num": "#e9a837", "str": "#35e95c", "func": "#baba15", "builtin": "#a5d0f5", "cls": "#17cf82", "deco": "#9fb3f4", "tag": "#f49caf", "attr": "#d5b318", "link": "#9cb4f4", "date": "#17c8d1", "mark": "#f49cae",
                   "p;": "#f49c9c", "p*/%": "#f5bfa5", "p!": "#dad018",
                   "p()": "#95c316", "p{}": "#6ee619", "p+": "#2ad117",
                   "p[]": "#17cf79", "p-": "#19e6c7", "p,.:": "#19c5e3",
                   "p=": "#a1b3f5", "p<>": "#cbc6f9", "p_": "#e8bcf8",
                   "p\\@$": "#f391ee", "p?": "#f7b8e0", "p&|^~": "#f49ab6",
        },
        "ui": {"hdr_bg": "#2a2a2a", "hdr_bg_a": "#353a42", "hdr_fg": "#e0e0e0", "mute": "#9aa0a6", "border": "#454545", "border_a": "#6aa5ff", "canvas": "#141414", "sel": "#3a4a66", "ok": "#6fcf97", "warn": "#f2994a", "err": "#ff7b7b", "info": "#6aa5ff"}},
    "contrast": {"name": 'Ciemny – wysoki kontrast (czarny)', "dark": True,
        "colors": {"bg": "#000000", "text": "#ffffff", "com": "#b0b8c4", "kw": "#ceadfd", "kw2": "#fd9ed4", "const": "#fda5a1", "num": "#faad29", "str": "#06ef39", "func": "#c2c205", "builtin": "#a3d3fd", "cls": "#06d880", "deco": "#a5bafd", "tag": "#fda3b6", "attr": "#e0b806", "link": "#a3bbfd", "date": "#06d0db", "mark": "#fda3b5",
                   "p;": "#fda5a5", "p*/%": "#fdc1a5", "p!": "#ddd206",
                   "p()": "#99ce05", "p{}": "#65ea06", "p+": "#1bdb06",
                   "p[]": "#06d876", "p-": "#06e7c5", "p,.:": "#06cef1",
                   "p=": "#a8bafd", "p<>": "#cec8fe", "p_": "#edbefd",
                   "p\\@$": "#fc99f7", "p?": "#fdb9e4", "p&|^~": "#fda1be",
        },
        "ui": {"hdr_bg": "#101010", "hdr_bg_a": "#1c1c1c", "hdr_fg": "#ffffff", "mute": "#c0c0c0", "border": "#707070", "border_a": "#ffd400", "canvas": "#000000", "sel": "#1f4aa0", "ok": "#3dff7a", "warn": "#ffb000", "err": "#ff6b6b", "info": "#66b3ff"}},
    "light": {"name": 'Jasny – wyraźny', "dark": False,
        "colors": {"bg": "#ffffff", "text": "#1b1f2a", "com": "#6b7280", "kw": "#6f1ce3", "kw2": "#d51a84", "const": "#dc251b", "num": "#986713", "str": "#0e7124", "func": "#76760f", "builtin": "#1563a8", "cls": "#108152", "deco": "#1c4ae3", "tag": "#de1b46", "attr": "#867011", "link": "#1c51e3", "date": "#107e84", "mark": "#de1b42",
                   "p;": "#de1b1b", "p*/%": "#a64214", "p!": "#68640d",
                   "p()": "#5e7b0f", "p{}": "#366f0e", "p+": "#1c8410",
                   "p[]": "#10814c", "p-": "#0d6d5f", "p,.:": "#127c8f",
                   "p=": "#1c47e3", "p<>": "#301ce3", "p_": "#9b19ca",
                   "p\\@$": "#c819bf", "p?": "#b6167b", "p&|^~": "#dc1b58",
        },
        "ui": {"hdr_bg": "#eef1f6", "hdr_bg_a": "#dce8f8", "hdr_fg": "#2b3340", "mute": "#5f6673", "border": "#c3cad6", "border_a": "#2f6fd6", "canvas": "#d5dbe5", "sel": "#bcd7ff", "ok": "#1f7a3a", "warn": "#b4531a", "err": "#b3261e", "info": "#2f55b5"}},
    "paper": {"name": 'Jasny – papier', "dark": False,
        "colors": {"bg": "#fbf4e4", "text": "#2a2418", "com": "#6f695a", "kw": "#7024db", "kw2": "#c3207c", "const": "#c82920", "num": "#8a6016", "str": "#116723", "func": "#6b6b11", "builtin": "#195c97", "cls": "#13764d", "deco": "#244fdb", "tag": "#ca2145", "attr": "#7b6814", "link": "#2455db", "date": "#147479", "mark": "#ca2143",
                   "p;": "#cc2121", "p*/%": "#954018", "p!": "#605c10",
                   "p()": "#577012", "p{}": "#346510", "p+": "#1e7914",
                   "p[]": "#137648", "p-": "#106558", "p,.:": "#157384",
                   "p=": "#244bdb", "p<>": "#3624db", "p_": "#8d1eb6",
                   "p\\@$": "#b61eae", "p?": "#a41b72", "p&|^~": "#c82055",
        },
        "ui": {"hdr_bg": "#efe6cf", "hdr_bg_a": "#e4d8b8", "hdr_fg": "#3a3222", "mute": "#6f695a", "border": "#cdbf9c", "border_a": "#b4691f", "canvas": "#dccfae", "sel": "#e8cf9a", "ok": "#2e6b2e", "warn": "#a84a12", "err": "#a8201a", "info": "#40569c"}},
}
for _sc in SCHEMES.values():  # końce gradientów: domyślnie równe początkom (schematy płaskie)
    for _k in ("hdr_bg", "hdr_bg_a", "border", "border_a", "canvas"):
        _sc["ui"].setdefault(_k + "2", _sc["ui"][_k])
COLORS = dict(SCHEMES[DEFAULT_SCHEME]["colors"])  # aktualna paleta składni (globalna)
UI = dict(SCHEMES[DEFAULT_SCHEME]["ui"])          # aktualne kolory interfejsu (paski, ramki, tło)
COLOR_LABELS = [("text", "Tekst"), ("bg", "Tło edytora"), ("str", "Wartości w 'x' i \"x\""),
                ("num", "Cyfry"), ("com", "Komentarze"), ("kw", "Słowa kluczowe"), ("kw2", "Definicje"),
                ("const", "Stałe"), ("func", "Funkcje"), ("builtin", "Wbudowane"), ("cls", "Klasy i typy"),
                ("deco", "Dekoratory"), ("tag", "Znaczniki HTML"), ("attr", "Atrybuty HTML"),
                ("link", "Adresy www i e-mail"), ("date", "Daty i godziny"), ("mark", "Znaczniki TODO / UWAGA")]
PUNCT_GROUPS = [("p;", ";"), ("p?", "?"), ("p!", "!"), ("p-", "-"), ("p_", "_"), ("p=", "="), ("p+", "+"),
                ("p*/%", "* / %"), ("p<>", "< >"), ("p&|^~", "& | ^ ~"), ("p,.:", ", . :"),
                ("p()", "( )"), ("p[]", "[ ]"), ("p{}", "{ }"), ("p\\@$", "\\ @ $")]


@lru_cache(maxsize=1)
def _formats() -> dict:
    c = COLORS
    return {
        "num": _fmt(c["num"]), "str": _fmt(c["str"]), "com": _fmt(c["com"], italic=True),
        "kw": _fmt(c["kw"], bold=True), "kw2": _fmt(c["kw2"], bold=True), "const": _fmt(c["const"], bold=True),
        "func": _fmt(c["func"]), "builtin": _fmt(c["builtin"]), "cls": _fmt(c["cls"]), "deco": _fmt(c["deco"]),
        "tag": _fmt(c["tag"]), "attr": _fmt(c["attr"]), "link": _fmt(c["link"], underline=True),
        "date": _fmt(c["date"]), "mark": _fmt(c["mark"], bold=True),
    }


@lru_cache(maxsize=1)
def _punct_formats() -> dict:
    return {ch: _fmt(COLORS[key]) for key, chars in ((k, k[1:]) for k, _l in PUNCT_GROUPS) for ch in chars}


def refresh_colors():
    """Po zmianie COLORS: wyczyść pamięć podręczną formatów."""
    _formats.cache_clear()
    _punct_formats.cache_clear()
    _lang_def.cache_clear()


NUM_RE = re.compile(r"0[xX][0-9a-fA-F]+|\d+(?:\.\d+)?")  # każda cyfra, także w abc123 i 3px
PUNCT_RE = re.compile(r"[;?!\-_=+*/%<>&|^~\\@$,.:()\[\]{}]")
PY_CTRL = ("and assert async await break continue del elif else except finally for if in is not or pass raise "
           "return try while with yield match case").split()
PY_DEF = "as class def from global import lambda nonlocal".split()
PY_CONST = "False None True".split()
PY_BI = ("print len range int str float list dict set tuple bool open type isinstance super self cls "
         "enumerate zip map filter sorted sum min max abs any all repr input id hash iter next").split()
SQL_CTRL = ("select from where join inner left right outer full cross on and or not in is like between exists "
            "union all distinct group by order having limit offset case when then else end asc desc as with top").split()
SQL_DDL = ("insert into values update set delete create alter drop table index view database primary key foreign "
           "references default unique check constraint add column begin commit rollback transaction truncate replace "
           "procedure function trigger grant revoke if").split()
SQL_CONST = "null true false".split()
SQL_TYPES = ("int integer bigint smallint tinyint decimal numeric float double real varchar char text date datetime "
             "timestamp boolean bool blob json uuid").split()
SQL_FN = "count sum avg min max coalesce ifnull upper lower length substr substring trim now cast convert round"
URL_RE = re.compile(r"https?://[^\s<>\"']+|www\.[^\s<>\"']+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+")
DATE_RE = re.compile(r"\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b|\b\d{1,2}:\d{2}(?::\d{2})?\b")
MARK_RE = re.compile(r"\b(?:TODO|FIXME|NOTE|UWAGA|WAŻNE|PILNE|BŁĄD|ZADANIE)\b")


def _words(ws, flags=0):
    return re.compile(r"\b(?:" + "|".join(ws) + r")\b", flags)


@lru_cache(maxsize=None)
def _lang_def(lang: str):
    """-> (reguły przed cyframi, reguły po cyfrach, strcom (re, {grupa: fmt}) | None, ml [(start, end, fmt)]).
    Reguły stosowane po kolei: późniejsze nadpisują wcześniejsze."""
    F = _formats()
    rules, post = [], []
    strcom, ml = None, []
    if lang == "python":
        rules += [(re.compile(r"\b[A-Za-z_]\w*(?=\()"), F["func"]),                     # wywołania funkcji
                  (re.compile(r"\b[A-Z][A-Za-z0-9]*[a-z][A-Za-z0-9]*\b"), F["cls"]),     # Klasy / Wielkie
                  (_words(PY_BI), F["builtin"]), (_words(PY_CTRL), F["kw"]), (_words(PY_DEF), F["kw2"]),
                  (_words(PY_CONST), F["const"]), (re.compile(r"@\w[\w.]*"), F["deco"]),
                  (re.compile(r"(?<=\bdef )\w+"), F["func"]), (re.compile(r"(?<=\bclass )\w+"), F["cls"])]
        strcom = (re.compile(r"(?P<c>#[^\n]*)|(?P<s>[rRbBfFuU]{0,2}(?:\"(?:\\.|[^\"\\])*\"|'(?:\\.|[^'\\])*'))"),
                  {"c": F["com"], "s": F["str"]})
        ml = [(re.compile(r'"""'), re.compile(r'"""'), F["str"]), (re.compile(r"'''"), re.compile(r"'''"), F["str"])]
    elif lang == "html":
        rules += [(re.compile(r"</?[A-Za-z][\w:-]*|/?>"), F["tag"]), (re.compile(r"\b[\w:-]+(?==)"), F["attr"]),
                  (re.compile(r"&#?\w+;"), F["builtin"]), (re.compile(r"<!DOCTYPE[^>]*>", re.I), F["kw2"])]
        strcom = (re.compile(r"=\s*(?P<s>\"[^\"]*\"|'[^']*')"), {"s": F["str"]})
        ml = [(re.compile(r"<!--"), re.compile(r"-->"), F["com"])]
    elif lang == "sql":
        rules += [(_words(SQL_CTRL, re.I), F["kw"]), (_words(SQL_DDL, re.I), F["kw2"]),
                  (_words(SQL_CONST, re.I), F["const"]), (_words(SQL_TYPES, re.I), F["cls"]),
                  (re.compile(r"\b(?:" + SQL_FN.replace(" ", "|") + r")\b(?=\s*\()", re.I), F["func"])]
        strcom = (re.compile(r"(?P<c>--[^\n]*)|(?P<s>'(?:''|[^'])*')|(?P<i>\"[^\"]*\")"),
                  {"c": F["com"], "s": F["str"], "i": F["cls"]})
        ml = [(re.compile(r"/\*"), re.compile(r"\*/"), F["com"])]
    else:  # zwykły tekst: wartości w 'x' i "x" (apostrof w słowie, np. it's, pomijany), adresy, daty, znaczniki
        post += [(URL_RE, F["link"]), (DATE_RE, F["date"]), (MARK_RE, F["mark"])]
        strcom = (re.compile(r"(?P<s>\"[^\"\n]*\"|(?<!\w)'[^'\n]*'(?!\w))"), {"s": F["str"]})
    return rules, post, strcom, ml


def make_palette(dark: bool) -> QPalette:
    """Paleta Qt zgodna ze schematem (menu, okna dialogowe, przyciski)."""
    P, R, G = QPalette(), QPalette.ColorRole, QPalette.ColorGroup
    c, u = COLORS, UI
    roles = {R.Window: u["hdr_bg"], R.WindowText: u["hdr_fg"], R.Base: c["bg"], R.AlternateBase: u["hdr_bg_a"],
             R.Text: c["text"], R.Button: u["hdr_bg"], R.ButtonText: u["hdr_fg"], R.ToolTipBase: u["hdr_bg_a"],
             R.ToolTipText: u["hdr_fg"], R.Highlight: u["sel"], R.HighlightedText: c["text"],
             R.PlaceholderText: u["mute"], R.Link: u["info"], R.BrightText: "#ffffff" if dark else "#000000",
             R.Light: QColor(u["hdr_bg_a"]).lighter(125).name(), R.Mid: u["border"], R.Dark: u["canvas"],
             R.Shadow: u["canvas"]}
    for r, col in roles.items():
        P.setColor(r, QColor(col))
    for r in (R.WindowText, R.Text, R.ButtonText):
        P.setColor(G.Disabled, r, QColor(u["mute"]))
    return P


class Highlighter(QSyntaxHighlighter):
    def __init__(self, doc, lang="text"):
        super().__init__(doc)
        self.lang = lang

    def set_language(self, lang: str):
        if lang != self.lang:
            self.lang = lang
            self.rehighlight()

    def highlightBlock(self, text: str):
        rules, post, strcom, ml = _lang_def(self.lang)
        self.setCurrentBlockState(0)
        pf = _punct_formats()
        for m in PUNCT_RE.finditer(text):
            self.setFormat(m.start(), 1, pf[m.group()])
        for rx, fmt in rules:
            for m in rx.finditer(text):
                self.setFormat(m.start(), m.end() - m.start(), fmt)
        num = _formats()["num"]
        for m in NUM_RE.finditer(text):
            self.setFormat(m.start(), m.end() - m.start(), num)
        for rx, fmt in post:
            for m in rx.finditer(text):
                self.setFormat(m.start(), m.end() - m.start(), fmt)
        comments = []
        if strcom:
            rx, gf = strcom
            for m in rx.finditer(text):
                for g, fmt in gf.items():
                    if m.group(g) is not None:
                        self.setFormat(m.start(g), m.end(g) - m.start(g), fmt)
                        if g == "c":
                            comments.append((m.start(g), m.end(g)))
        if comments:  # znaczniki TODO / UWAGA także w komentarzach kodu
            mk = _formats()["mark"]
            for a, b in comments:
                for m in MARK_RE.finditer(text, a, b):
                    self.setFormat(m.start(), m.end() - m.start(), mk)
        if not ml:
            return
        start, state = 0, self.previousBlockState()
        if state > 0:
            s_rx, e_rx, fmt = ml[state - 1]
            m = e_rx.search(text)
            if not m:
                self.setFormat(0, len(text), fmt)
                self.setCurrentBlockState(state)
                return
            self.setFormat(0, m.end(), fmt)
            start = m.end()
        while True:
            best = None
            for i, (s_rx, e_rx, fmt) in enumerate(ml):
                m = s_rx.search(text, start)
                if m and (best is None or m.start() < best[1].start()):
                    best = (i, m)
            if not best:
                break
            i, m = best
            if any(a <= m.start() < b for a, b in comments):
                start = m.end()
                continue
            s_rx, e_rx, fmt = ml[i]
            e = e_rx.search(text, m.end())
            if e:
                self.setFormat(m.start(), e.end() - m.start(), fmt)
                start = e.end()
            else:
                self.setFormat(m.start(), len(text) - m.start(), fmt)
                self.setCurrentBlockState(i + 1)
                break


# ---------- podgląd PDF (pypdfium2) ----------

class PdfViewer(QScrollArea):
    """Przewijany podgląd PDF z leniwym renderowaniem. Ctrl+kółko = zoom."""
    DPI = 96 / 72
    GAP = 8

    def __init__(self):
        super().__init__()
        self.doc = None
        self.sizes: list[tuple[float, float]] = []
        self.labels: list[QLabel] = []
        self.cache: dict[tuple[int, float], QPixmap] = {}
        self.zoom = 0.0  # 0 = dopasuj do szerokości
        self.setWidgetResizable(False)
        self.setFrameShape(QFrame.Shape.NoFrame)
        self.restyle()
        self.verticalScrollBar().valueChanged.connect(self.render_visible)

    def restyle(self):
        self.setStyleSheet(f"QScrollArea{{background:{UI['canvas']};}}")
        c = self.widget()
        if c is not None:
            c.setStyleSheet(f"background:{UI['canvas']};")

    def load(self, raw: bytes):
        import pypdfium2 as pdfium  # ładowane dopiero przy pierwszym PDF
        self.close_doc()
        self.doc = pdfium.PdfDocument(raw)
        self.sizes = [self.doc[i].get_size() for i in range(len(self.doc))]
        self.container = QWidget()
        self.container.setStyleSheet(f"background:{UI['canvas']};")
        self.labels = []
        for _ in self.sizes:
            lb = QLabel(self.container)
            lb.setStyleSheet("background:white;")
            self.labels.append(lb)
        self.setWidget(self.container)
        self.relayout()

    def close_doc(self):
        self.cache.clear()
        self.labels = []
        self.sizes = []
        old = self.takeWidget()
        if old is not None:
            old.deleteLater()
        if self.doc is not None:
            try:
                self.doc.close()
            except Exception:
                pass
            self.doc = None

    def page_count(self) -> int:
        return len(self.sizes)

    def _scale(self) -> float:
        if self.zoom > 0:
            return self.zoom * self.DPI
        w = max(self.viewport().width() - 2 * self.GAP - 2, 50)
        widest = max((s[0] for s in self.sizes), default=612)
        return w / widest

    def relayout(self):
        if not self.labels:
            return
        sc, y = self._scale(), self.GAP
        maxw = 0
        for lb, (pw, ph) in zip(self.labels, self.sizes):
            w, h = max(int(pw * sc), 1), max(int(ph * sc), 1)
            lb.setGeometry(self.GAP, y, w, h)
            lb.clear()
            y += h + self.GAP
            maxw = max(maxw, w)
        self.container.resize(max(maxw + 2 * self.GAP, self.viewport().width()), y)
        self.cache.clear()
        self.render_visible()

    def render_visible(self, *_):
        if not self.labels or self.doc is None:
            return
        sc = round(self._scale(), 4)
        top = self.verticalScrollBar().value()
        vh = self.viewport().height()
        for i, lb in enumerate(self.labels):
            near = lb.y() + lb.height() > top - vh and lb.y() < top + 2 * vh
            if not near:
                if lb.pixmap() is not None and not lb.pixmap().isNull():
                    lb.clear()
                continue
            if lb.pixmap() is not None and not lb.pixmap().isNull():
                continue
            key = (i, sc)
            if key not in self.cache:
                bm = self.doc[i].render(scale=sc)
                img = QImage(bm.buffer, bm.width, bm.height, bm.stride, QImage.Format.Format_BGR888).copy()
                self.cache[key] = QPixmap.fromImage(img)
                if len(self.cache) > 12:
                    self.cache.pop(next(iter(self.cache)))
            lb.setPixmap(self.cache[key])

    def current_page(self) -> int:
        top = self.verticalScrollBar().value() + 4
        for i, lb in enumerate(self.labels):
            if lb.y() + lb.height() >= top:
                return i
        return 0

    def jump(self, page: int):
        if self.labels:
            page = max(0, min(page, len(self.labels) - 1))
            self.verticalScrollBar().setValue(max(self.labels[page].y() - self.GAP, 0))

    def set_zoom(self, z: float):
        page = self.current_page()
        self.zoom = z
        self.relayout()
        self.jump(page)

    def resizeEvent(self, e):
        super().resizeEvent(e)
        if self.zoom == 0:
            self.relayout()
        else:
            self.render_visible()

    def wheelEvent(self, e):
        if e.modifiers() & Qt.KeyboardModifier.ControlModifier:
            cur = self.zoom if self.zoom > 0 else self._scale() / self.DPI
            self.set_zoom(max(0.2, min(cur * (1.1 if e.angleDelta().y() > 0 else 1 / 1.1), 5.0)))
            e.accept()
        else:
            super().wheelEvent(e)


# ---------- podgląd obrazu i pusty panel z plusem ----------

class ImageViewer(QScrollArea):
    """Podgląd obrazu. Domyślnie dopasowany do panelu (nie powiększa ponad 100%).
    Ctrl+kółko = zoom, dwuklik = dopasuj / 100%, przeciąganie myszą = przesuwanie."""
    MAX_PIXELS = 16_000_000  # limit pikseli skalowanej kopii (pamięć)

    def __init__(self):
        super().__init__()
        self.pix = QPixmap()
        self.zoom = 0.0  # 0 = dopasuj do panelu
        self._pan: QPoint | None = None
        self.setFrameShape(QFrame.Shape.NoFrame)
        self.setWidgetResizable(True)
        self.lbl = QLabel()
        self.lbl.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.setWidget(self.lbl)

    def load(self, img: QImage):
        self.pix = QPixmap.fromImage(img)
        self._render()

    def clear(self):
        self.pix = QPixmap()
        self.lbl.clear()

    def eff_scale(self) -> float:
        if self.pix.isNull():
            return 1.0
        w, h = self.pix.width(), self.pix.height()
        if self.zoom > 0:
            s = self.zoom
        else:
            vp = self.viewport().size()
            s = min(1.0, max(vp.width(), 1) / w, max(vp.height(), 1) / h)
        if w * h * s * s > self.MAX_PIXELS:
            s = math.sqrt(self.MAX_PIXELS / (w * h))
        return max(0.02, s)

    def _render(self):
        if self.pix.isNull():
            self.lbl.clear()
            return
        s = self.eff_scale()
        w, h = max(1, round(self.pix.width() * s)), max(1, round(self.pix.height() * s))
        same = (w, h) == (self.pix.width(), self.pix.height())
        self.lbl.setPixmap(self.pix if same else self.pix.scaled(
            w, h, Qt.AspectRatioMode.IgnoreAspectRatio, Qt.TransformationMode.SmoothTransformation))
        pol = (Qt.ScrollBarPolicy.ScrollBarAlwaysOff if self.zoom <= 0 else Qt.ScrollBarPolicy.ScrollBarAsNeeded)
        self.setHorizontalScrollBarPolicy(pol)
        self.setVerticalScrollBarPolicy(pol)

    def set_zoom(self, z: float):
        self.zoom = z
        self._render()

    def resizeEvent(self, e):
        super().resizeEvent(e)
        if self.zoom <= 0:
            self._render()

    def wheelEvent(self, e):
        if e.modifiers() & Qt.KeyboardModifier.ControlModifier:
            cur = self.eff_scale()
            self.set_zoom(max(0.05, min(cur * (1.15 if e.angleDelta().y() > 0 else 1 / 1.15), 16.0)))
            e.accept()
        else:
            super().wheelEvent(e)

    def mouseDoubleClickEvent(self, e):
        self.set_zoom(0.0 if self.zoom > 0 else 1.0)

    def mousePressEvent(self, e):
        if e.button() == Qt.MouseButton.LeftButton and self.zoom > 0:
            self._pan = e.globalPosition().toPoint()
            self.setCursor(Qt.CursorShape.ClosedHandCursor)
        super().mousePressEvent(e)

    def mouseMoveEvent(self, e):
        if self._pan is not None:
            gp = e.globalPosition().toPoint()
            d, self._pan = gp - self._pan, gp
            self.horizontalScrollBar().setValue(self.horizontalScrollBar().value() - d.x())
            self.verticalScrollBar().setValue(self.verticalScrollBar().value() - d.y())
        else:
            super().mouseMoveEvent(e)

    def mouseReleaseEvent(self, e):
        self._pan = None
        self.unsetCursor()
        super().mouseReleaseEvent(e)


class Placeholder(QWidget):
    """Pusty panel: duży plus (nowy plik tekstowy) + skróty do obrazu i otwierania plików.
    Dopasowuje się do wielkości panelu (w małym zostaje sam plus)."""
    DEFAULT_HINT = "albo przeciągnij tu plik lub folder · Ctrl+V wkleja tekst, obraz lub plik"

    def __init__(self):
        super().__init__()
        self.setObjectName("ph")
        self.setAttribute(Qt.WidgetAttribute.WA_StyledBackground, True)
        self._err = False
        self._cur: str | None = None
        self._sz = 0
        v = QVBoxLayout(self)
        v.setContentsMargins(8, 6, 8, 6)
        v.setSpacing(6)
        self.btn_plus = QToolButton(text="+", toolTip="Nowy plik tekstowy (Ctrl+N)")
        self.btn_plus.setCursor(Qt.CursorShape.PointingHandCursor)
        self.lbl_plus = QLabel("Nowy plik tekstowy")
        self.lbl_hint = QLabel(self.DEFAULT_HINT)
        for lb in (self.lbl_plus, self.lbl_hint):
            lb.setAlignment(Qt.AlignmentFlag.AlignCenter)
            lb.setWordWrap(True)
        self.row = QWidget()
        self.row_l = QBoxLayout(QBoxLayout.Direction.LeftToRight, self.row)
        self.row_l.setContentsMargins(0, 0, 0, 0)
        self.row_l.setSpacing(6)
        self.btn_open = QPushButton("Otwórz plik…", toolTip="Otwórz plik tekstowy, PDF lub obraz (Ctrl+O)")
        self.btn_clip = QPushButton("Obraz ze schowka", toolTip="Wklej obraz ze schowka (Ctrl+Shift+V; Ctrl+V wkleja też tekst i pliki)")
        self.btn_img = QPushButton("Obraz z pliku…", toolTip="Otwórz plik graficzny (PNG, JPG, BMP, GIF, WEBP…)")
        self.btn_dir = QPushButton("Folder…", toolTip="Pokaż zawartość folderu w panelu (Ctrl+Shift+O)")
        self.btn_rem = QPushButton("Przypomnienia", toolTip="Lista przypomnień z datą i godziną (Ctrl+Shift+R)")
        for b in (self.btn_open, self.btn_dir, self.btn_clip, self.btn_img, self.btn_rem):
            b.setCursor(Qt.CursorShape.PointingHandCursor)
            self.row_l.addWidget(b)
        v.addStretch(1)
        v.addWidget(self.btn_plus, 0, Qt.AlignmentFlag.AlignHCenter)
        v.addWidget(self.lbl_plus)
        v.addWidget(self.lbl_hint)
        v.addWidget(self.row, 0, Qt.AlignmentFlag.AlignHCenter)
        v.addStretch(1)
        self.setContextMenuPolicy(Qt.ContextMenuPolicy.CustomContextMenu)
        self._layout_for(self.size())

    def set_hint(self, text: str | None):
        """Komunikat (np. błąd otwarcia) albo domyślna podpowiedź (None)."""
        if text == self._cur:
            return
        self._cur, self._err = text, bool(text)
        self.lbl_hint.setText(text or self.DEFAULT_HINT)
        self._layout_for(self.size())
        self.apply_colors()

    def _layout_for(self, size: QSize):
        w, h = size.width(), size.height()
        horiz = w >= 480
        self.lbl_plus.setVisible(h >= 105)
        self.lbl_hint.setVisible(h >= 215 or (self._err and h >= 130))
        self.row.setVisible((horiz and h >= 150) or (not horiz and h >= 250))
        self.row_l.setDirection(QBoxLayout.Direction.LeftToRight if horiz else QBoxLayout.Direction.TopToBottom)
        sz = 56 if h >= 190 else 44 if h >= 120 else 32
        if sz != self._sz:
            self._sz = sz
            self.btn_plus.setFixedSize(sz, sz)
            self.apply_colors()

    def resizeEvent(self, e):
        super().resizeEvent(e)
        self._layout_for(e.size())

    def apply_colors(self):
        sz, mute, acc = self._sz or 56, UI["mute"], UI["border_a"]
        self.setStyleSheet(
            f"#ph{{background:{COLORS['bg']};}}"
            f"QLabel{{color:{mute};}}"
            f"QToolButton{{border:2px dashed {mute};border-radius:{sz // 2}px;color:{mute};"
            f"background:transparent;font-size:{int(sz * 0.62)}px;}}"
            f"QToolButton:hover{{border:2px solid {acc};color:{acc};background:{grad(UI['hdr_bg'], UI['hdr_bg2'], True)};}}"
            f"QPushButton{{background:{UI['hdr_bg']};color:{UI['hdr_fg']};border:1px solid {UI['border']};"
            f"border-radius:4px;padding:3px 10px;}}"
            f"QPushButton:hover{{border-color:{acc};}}")
        self.lbl_hint.setStyleSheet(f"color:{UI['err'] if self._err else mute};")


# ---------- panel folderu (styl Total Commandera, lekki: jeden katalog naraz, bez skanowania w głąb) ----------

class _Xfer(QThread):
    """Kopiowanie / przenoszenie w tle, żeby okno nie zamarzało przy dużych plikach."""
    finished_n = Signal(int, str)

    def __init__(self, paths: list[str], dest: str, move: bool, overwrite: bool):
        super().__init__()
        self.paths, self.dest, self.move, self.overwrite = paths, dest, move, overwrite

    def run(self):
        n, err = 0, ""
        for src in self.paths:
            try:
                s_, d_ = Path(src), Path(self.dest) / Path(src).name
                if d_.resolve() == s_.resolve() or (s_.is_dir() and str(d_.resolve()).startswith(str(s_.resolve()) + os.sep)):
                    err = f"nie można skopiować „{s_.name}” w samo siebie"
                    continue
                if d_.exists():
                    if not self.overwrite:
                        continue
                    if self.move:
                        shutil.rmtree(d_) if d_.is_dir() else d_.unlink()
                if self.move:
                    shutil.move(str(s_), str(d_))
                elif s_.is_dir():
                    shutil.copytree(s_, d_, dirs_exist_ok=True)
                else:
                    shutil.copy2(s_, d_)
                n += 1
            except Exception as ex:
                err = f"{Path(src).name}: {ex}"
        self.finished_n.emit(n, err)


class _PlModel(QFileSystemModel):
    """QFileSystemModel z polskimi nagłówkami kolumn."""
    _H = {0: "Nazwa", 1: "Rozmiar", 3: "Zmieniono"}

    def headerData(self, section, orientation, role=Qt.ItemDataRole.DisplayRole):
        if orientation == Qt.Orientation.Horizontal and role == Qt.ItemDataRole.DisplayRole and section in self._H:
            return self._H[section]
        return super().headerData(section, orientation, role)


class FolderView(QWidget):
    """Lista plików folderu: Enter / dwuklik otwiera, Backspace w górę, F2 nazwa, F5 kopiuj, F6 przenieś,
    F7 nowy folder, Del do kosza. Kopiowanie/przenoszenie idzie do drugiego panelu folderu."""
    openFile = Signal(str)
    navigated = Signal(str)
    counted = Signal(str)
    transfer = Signal(list, bool)
    activated = Signal()

    def __init__(self):
        super().__init__()
        self.setObjectName("fv")
        self.setAttribute(Qt.WidgetAttribute.WA_StyledBackground, True)
        self.root = ""
        self.model = _PlModel(self)
        self.model.setFilter(QDir.Filter.AllEntries | QDir.Filter.NoDotAndDotDot)
        ip = QFileIconProvider()
        ip.setOptions(QFileIconProvider.Option.DontUseCustomDirectoryIcons)
        self.model.setIconProvider(ip)
        self.model.directoryLoaded.connect(self._loaded)
        self.drives = QComboBox()
        self.drives.setToolTip("Dysk")
        self.drives.setFixedWidth(64)
        for d in QDir.drives():
            self.drives.addItem(d.absoluteFilePath().rstrip("/\\") or d.absoluteFilePath(), d.absoluteFilePath())
        self.btn_up = QToolButton(text="↑", toolTip="Folder wyżej (Backspace)")
        self.path_edit = QLineEdit()
        self.path_edit.setToolTip("Ścieżka – wpisz i naciśnij Enter")
        top = QHBoxLayout()
        top.setContentsMargins(4, 3, 4, 3)
        top.setSpacing(4)
        top.addWidget(self.drives)
        top.addWidget(self.btn_up)
        top.addWidget(self.path_edit, 1)
        self.view = QTreeView()
        self.view.setModel(self.model)
        self.view.setFrameShape(QFrame.Shape.NoFrame)
        self.view.setRootIsDecorated(False)
        self.view.setItemsExpandable(False)
        self.view.setUniformRowHeights(True)
        self.view.setSelectionMode(QAbstractItemView.SelectionMode.ExtendedSelection)
        self.view.setEditTriggers(QAbstractItemView.EditTrigger.NoEditTriggers)
        self.view.setSortingEnabled(True)
        self.view.sortByColumn(0, Qt.SortOrder.AscendingOrder)
        self.view.setContextMenuPolicy(Qt.ContextMenuPolicy.CustomContextMenu)
        self.view.setColumnHidden(2, True)
        hv = self.view.header()
        hv.setSectionResizeMode(0, QHeaderView.ResizeMode.Stretch)
        hv.setSectionResizeMode(1, QHeaderView.ResizeMode.ResizeToContents)
        hv.setSectionResizeMode(3, QHeaderView.ResizeMode.ResizeToContents)
        hv.setStretchLastSection(False)
        v = QVBoxLayout(self)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(0)
        v.addLayout(top)
        v.addWidget(self.view, 1)
        self.view.installEventFilter(self)
        self.view.viewport().installEventFilter(self)
        self.path_edit.returnPressed.connect(lambda: self.navigate(self.path_edit.text().strip().strip('"')))
        self.btn_up.clicked.connect(self.go_up)
        self.drives.activated.connect(lambda i: self.navigate(self.drives.itemData(i)))
        self.view.doubleClicked.connect(lambda _i: self.open_current())
        self.view.customContextMenuRequested.connect(self._menu)
        self.apply_colors()

    # --- nawigacja ---
    def navigate(self, path: str) -> bool:
        p = Path(path)
        try:
            ok = p.is_dir()
        except OSError:
            ok = False
        if not ok:
            self.path_edit.setText(self.root)
            self.counted.emit("⚠ brak folderu")
            return False
        self.root = str(p.resolve()) if str(p) else str(p)
        self.model.setRootPath(self.root)
        self.view.setRootIndex(self.model.index(self.root))
        self.path_edit.setText(self.root)
        i = self.drives.findData(Path(self.root).anchor)
        if i >= 0:
            self.drives.setCurrentIndex(i)
        self.view.setCurrentIndex(self.model.index(0, 0, self.view.rootIndex()))
        self.counted.emit("folder")
        self.navigated.emit(self.root)
        return True

    def go_up(self):
        par = Path(self.root).parent
        if str(par) != self.root:
            old = Path(self.root)
            if self.navigate(str(par)):
                ix = self.model.index(str(old))
                if ix.isValid():
                    self.view.setCurrentIndex(ix)

    def _loaded(self, path: str):
        if Path(path) == Path(self.root):
            self.counted.emit(f"folder · {self.model.rowCount(self.view.rootIndex())} elem.")

    def selected(self) -> list[str]:
        rows = {i.row() for i in self.view.selectionModel().selectedIndexes()}
        return [self.model.filePath(self.model.index(r, 0, self.view.rootIndex())) for r in sorted(rows)]

    def open_current(self):
        ix = self.view.currentIndex()
        if not ix.isValid():
            return
        path = self.model.filePath(ix)
        if self.model.isDir(ix):
            self.navigate(path)
        else:
            self.openFile.emit(path)

    # --- operacje ---
    def new_folder(self):
        name, ok = QInputDialog.getText(self, "Nowy folder", "Nazwa folderu:")
        if ok and name.strip():
            try:
                (Path(self.root) / name.strip()).mkdir()
            except Exception as ex:
                QMessageBox.warning(self, "Nowy folder", str(ex))

    def rename(self):
        sel = self.selected()
        if len(sel) != 1:
            return
        old = Path(sel[0])
        name, ok = QInputDialog.getText(self, "Zmień nazwę", "Nowa nazwa:", text=old.name)
        if ok and name.strip() and name.strip() != old.name:
            try:
                old.rename(old.with_name(name.strip()))
            except Exception as ex:
                QMessageBox.warning(self, "Zmień nazwę", str(ex))

    def delete(self):
        sel = self.selected()
        if not sel:
            return
        what = f"„{Path(sel[0]).name}”" if len(sel) == 1 else f"{len(sel)} elementów"
        if QMessageBox.question(self, "Usuń", f"Przenieść {what} do kosza?") != QMessageBox.StandardButton.Yes:
            return
        bad = [Path(x).name for x in sel if not QFile.moveToTrash(x)]
        if bad:
            QMessageBox.warning(self, "Usuń", "Nie udało się przenieść do kosza:\n" + "\n".join(bad[:8]))

    def ask_transfer(self, move: bool):
        sel = self.selected()
        if sel:
            self.transfer.emit(sel, move)

    def _menu(self, pos):
        sel = self.selected()
        m = QMenu(self)
        m.addAction("Otwórz").triggered.connect(self.open_current)
        m.addSeparator()
        m.addAction("Kopiuj do drugiego panelu (F5)").triggered.connect(lambda: self.ask_transfer(False))
        m.addAction("Przenieś do drugiego panelu (F6)").triggered.connect(lambda: self.ask_transfer(True))
        m.addSeparator()
        m.addAction("Nowy folder (F7)").triggered.connect(self.new_folder)
        ar = m.addAction("Zmień nazwę (F2)")
        ar.triggered.connect(self.rename)
        ar.setEnabled(len(sel) == 1)
        m.addAction("Usuń do kosza (Del)").triggered.connect(self.delete)
        m.addSeparator()
        m.addAction("Kopiuj ścieżkę").triggered.connect(
            lambda: QApplication.clipboard().setText("\n".join(sel) if sel else self.root))
        m.addAction("Pokaż w Eksploratorze").triggered.connect(
            lambda: QDesktopServices.openUrl(QUrl.fromLocalFile(self.root)))
        m.exec(self.view.viewport().mapToGlobal(pos))

    def eventFilter(self, obj, ev):
        if ev.type() == QEvent.Type.FocusIn or (obj is self.view.viewport() and ev.type() == QEvent.Type.MouseButtonPress):
            self.activated.emit()
        if obj is self.view and ev.type() == QEvent.Type.KeyPress:
            k = ev.key()
            if k in (Qt.Key.Key_Return, Qt.Key.Key_Enter):
                self.open_current()
            elif k == Qt.Key.Key_Backspace:
                self.go_up()
            elif k == Qt.Key.Key_F2:
                self.rename()
            elif k == Qt.Key.Key_F5:
                self.ask_transfer(False)
            elif k == Qt.Key.Key_F6:
                self.ask_transfer(True)
            elif k == Qt.Key.Key_F7:
                self.new_folder()
            elif k == Qt.Key.Key_Delete:
                self.delete()
            else:
                return False
            return True
        return False

    def apply_colors(self):
        u, c = UI, COLORS
        self.setStyleSheet(
            f"#fv{{background:{c['bg']};}}"
            f"QTreeView{{background:{c['bg']};color:{c['text']};border:none;outline:0;"
            f"selection-background-color:{u['sel']};selection-color:{c['text']};}}"
            f"QTreeView::item{{padding:1px 2px;}}"
            f"QTreeView::item:hover{{background:{u['border']};}}"
            f"QHeaderView::section{{background:{u['hdr_bg']};color:{u['mute']};border:none;"
            f"border-bottom:1px solid {u['border']};padding:2px 6px;}}"
            f"QLineEdit,QComboBox{{background:{u['hdr_bg']};color:{u['hdr_fg']};border:1px solid {u['border']};"
            f"border-radius:3px;padding:1px 4px;}}"
            f"QToolButton{{background:{u['hdr_bg']};color:{u['hdr_fg']};border:1px solid {u['border']};"
            f"border-radius:3px;padding:1px 7px;}}"
            f"QToolButton:hover{{border-color:{u['border_a']};}}")



# ---------- panel przypomnień ----------

REM_COLORS = ["#e5484d", "#f5a524", "#c6e03b", "#2dbf6c", "#12a6b0", "#3e8ef7", "#9b6bff", "#ec5fa5"]
DAYS_PL = ["pn", "wt", "śr", "cz", "pt", "sb", "nd"]
_WD = {"poniedziałek": 0, "poniedzialek": 0, "wtorek": 1, "środę": 2, "srode": 2, "środa": 2, "sroda": 2,
       "czwartek": 3, "piątek": 4, "piatek": 4, "sobotę": 5, "sobote": 5, "sobota": 5, "niedzielę": 6,
       "niedziele": 6, "niedziela": 6}


def parse_when(text: str):
    """Z tekstu typu „skaling jutro 10:00” wyciąga (data, godzina); brakujące elementy = None."""
    low = text.lower()
    today = datetime.now().date()
    d, t = None, None
    m = re.search(r"\b(\d{1,2})[:.](\d{2})\b", low) or re.search(r"\bo\s+(\d{1,2})\b()", low)
    if m:
        h, mi = int(m.group(1)), int(m.group(2) or 0)
        if 0 <= h < 24 and 0 <= mi < 60:
            t = (h, mi)
    if re.search(r"\bpojutrze\b", low):
        d = today + timedelta(days=2)
    elif re.search(r"\bjutro\b", low):
        d = today + timedelta(days=1)
    elif re.search(r"\b(dziś|dzis|dzisiaj)\b", low):
        d = today
    else:
        for name, wd in _WD.items():
            if re.search(rf"\b{name}\b", low):
                d = today + timedelta(days=(wd - today.weekday()) % 7 or 7)
                break
        else:
            m = re.search(r"\b(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?\b(?![:.]\d)", low)
            if m:
                try:
                    y = int(m.group(3) or today.year)
                    d = datetime(y, int(m.group(2)), int(m.group(1))).date()
                    if not m.group(3) and d < today:
                        d = d.replace(year=y + 1)
                except ValueError:
                    d = None
    return d, t


def rem_when_text(dt: datetime) -> str:
    today = datetime.now().date()
    delta = (dt.date() - today).days
    day = {0: "dziś", 1: "jutro", 2: "pojutrze"}.get(delta) or f"{DAYS_PL[dt.weekday()]} {dt:%d.%m}"
    return f"{day} · {dt:%H:%M}"


def _swatch(color: str, size: int = 14) -> QPixmap:
    pm = QPixmap(size, size)
    pm.fill(Qt.GlobalColor.transparent)
    p = QPainter(pm)
    p.setRenderHint(QPainter.RenderHint.Antialiasing)
    p.setBrush(QColor(color))
    p.setPen(Qt.PenStyle.NoPen)
    p.drawRoundedRect(QRectF(0, 0, size, size), 4, 4)
    p.end()
    return pm


class ReminderDialog(ThemedDialog):
    """Wyskakujące okno: tekst, data, godzina i kolor przypomnienia."""

    def __init__(self, parent, item: dict | None = None, color: str = REM_COLORS[0]):
        super().__init__(parent)
        self.setWindowTitle("Nowe przypomnienie" if item is None else "Edytuj przypomnienie")
        self.setMinimumWidth(380)
        self.color = (item or {}).get("color", color)
        self._manual = item is not None
        dt = datetime.fromisoformat(item["dt"]) if item else (datetime.now() + timedelta(hours=1)).replace(minute=0, second=0, microsecond=0)
        self.ed_text = QLineEdit((item or {}).get("text", ""))
        self.ed_text.setPlaceholderText("np. umówić się na skaling jutro 10:00")
        self.ed_date = QDateEdit(QDate(dt.year, dt.month, dt.day))
        self.ed_date.setCalendarPopup(True)
        self.ed_date.setDisplayFormat("dd.MM.yyyy")
        self.ed_time = QTimeEdit(QTime(dt.hour, dt.minute))
        self.ed_time.setDisplayFormat("HH:mm")
        self.lbl_guess = QLabel("")
        self.lbl_guess.setStyleSheet(f"color:{UI['mute']};")
        row = QHBoxLayout()
        row.addWidget(QLabel("Data"))
        row.addWidget(self.ed_date, 1)
        row.addWidget(QLabel("Godzina"))
        row.addWidget(self.ed_time)
        self.sw: list[QToolButton] = []
        crow = QHBoxLayout()
        crow.addWidget(QLabel("Kolor"))
        for c in REM_COLORS:
            b = QToolButton()
            b.setFixedSize(22, 22)
            b.setCursor(Qt.CursorShape.PointingHandCursor)
            b.clicked.connect(lambda _c=False, col=c: self._set_color(col))
            b.setProperty("col", c)
            self.sw.append(b)
            crow.addWidget(b)
        more = QToolButton(text="…", toolTip="Inny kolor")
        more.clicked.connect(self._pick)
        crow.addWidget(more)
        crow.addStretch(1)
        bb = QHBoxLayout()
        ok, cancel = QPushButton("Zapisz"), QPushButton("Anuluj")
        ok.setDefault(True)
        ok.clicked.connect(self._accept)
        cancel.clicked.connect(self.reject)
        bb.addStretch(1)
        bb.addWidget(cancel)
        bb.addWidget(ok)
        v = QVBoxLayout(self)
        v.addWidget(QLabel("Treść"))
        v.addWidget(self.ed_text)
        v.addLayout(row)
        v.addWidget(self.lbl_guess)
        v.addLayout(crow)
        v.addSpacing(6)
        v.addLayout(bb)
        self.ed_text.textChanged.connect(self._guess)
        self.ed_date.dateChanged.connect(self._touched)
        self.ed_time.timeChanged.connect(self._touched)
        self._set_color(self.color)
        self.ed_text.setFocus()
        self._guess_on = True

    def _touched(self, *_):
        if not getattr(self, "_auto", False):
            self._manual = True

    def _guess(self, text: str):
        if self._manual:
            return
        d, t = parse_when(text)
        self._auto = True
        if d:
            self.ed_date.setDate(QDate(d.year, d.month, d.day))
        if t:
            self.ed_time.setTime(QTime(*t))
        self._auto = False
        self.lbl_guess.setText("Rozpoznano termin z treści – możesz go poprawić." if (d or t) else "")

    def _set_color(self, col: str):
        self.color = col
        for b in self.sw:
            c = b.property("col")
            on = c.lower() == col.lower()
            b.setStyleSheet(f"QToolButton{{background:{c};border:{'3px solid ' + COLORS['text'] if on else '1px solid ' + UI['border']};"
                            f"border-radius:11px;}}")

    def _pick(self):
        c = QColorDialog.getColor(QColor(self.color), self, "Kolor przypomnienia")
        if c.isValid():
            self._set_color(c.name())

    def _accept(self):
        if self.ed_text.text().strip():
            self.accept()
        else:
            self.ed_text.setFocus()

    def result_item(self, old: dict | None) -> dict:
        d, t = self.ed_date.date(), self.ed_time.time()
        dt = datetime(d.year(), d.month(), d.day(), t.hour(), t.minute())
        it = dict(old or {"id": uuid.uuid4().hex, "done": False})
        changed = old is None or old.get("dt") != dt.isoformat(timespec="minutes")
        it.update(text=self.ed_text.text().strip(), dt=dt.isoformat(timespec="minutes"), color=self.color)
        if changed:
            it["notified"] = dt <= datetime.now()  # termin już minął = bez wyskakującego okna
        return it


class RemindersView(QWidget):
    """Lista przypomnień (wspólna dla całej aplikacji). Lekki widok: tylko lista pozycji."""
    changed = Signal()

    def __init__(self, items: list):
        super().__init__()
        self.setObjectName("rv")
        self.setAttribute(Qt.WidgetAttribute.WA_StyledBackground, True)
        self.items = items
        self.btn_add = QPushButton("＋ Nowe przypomnienie")
        self.btn_add.setCursor(Qt.CursorShape.PointingHandCursor)
        self.chk_done = QCheckBox("Pokaż wykonane")
        top = QHBoxLayout()
        top.setContentsMargins(6, 4, 6, 4)
        top.addWidget(self.btn_add)
        top.addStretch(1)
        top.addWidget(self.chk_done)
        self.list = QListWidget()
        self.list.setFrameShape(QFrame.Shape.NoFrame)
        self.list.setIconSize(QSize(14, 14))
        self.list.setSpacing(1)
        self.list.setContextMenuPolicy(Qt.ContextMenuPolicy.CustomContextMenu)
        self.list.installEventFilter(self)
        v = QVBoxLayout(self)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(0)
        v.addLayout(top)
        v.addWidget(self.list, 1)
        self.btn_add.clicked.connect(self.add)
        self.chk_done.toggled.connect(lambda _b: self.refresh())
        self.list.itemDoubleClicked.connect(lambda _i: self.edit())
        self.list.itemChanged.connect(self._checked)
        self.list.customContextMenuRequested.connect(self._menu)
        self._busy = False
        self.apply_colors()
        self.refresh()

    def next_color(self) -> str:
        used = [i.get("color") for i in self.items if not i.get("done")]
        for c in REM_COLORS:
            if c not in used:
                return c
        return REM_COLORS[len(self.items) % len(REM_COLORS)]

    def active_count(self) -> int:
        return sum(1 for i in self.items if not i.get("done"))

    def refresh(self):
        self._busy = True
        keep = self._cur_id()
        self.list.clear()
        now = datetime.now()
        show_done = self.chk_done.isChecked()
        for it in sorted(self.items, key=lambda x: (x.get("done", False), x["dt"])):
            if it.get("done") and not show_done:
                continue
            dt = datetime.fromisoformat(it["dt"])
            late = not it.get("done") and dt < now
            li = QListWidgetItem(QIcon(_swatch(it["color"])), f"{it['text']}\n{rem_when_text(dt)}" + ("  ·  po terminie" if late else ""))
            li.setData(Qt.ItemDataRole.UserRole, it["id"])
            li.setFlags(li.flags() | Qt.ItemFlag.ItemIsUserCheckable)
            li.setCheckState(Qt.CheckState.Checked if it.get("done") else Qt.CheckState.Unchecked)
            if it.get("done"):
                li.setForeground(QColor(UI["mute"]))
                f = li.font()
                f.setStrikeOut(True)
                li.setFont(f)
            elif late:
                li.setForeground(QColor(UI["err"]))
            li.setBackground(QColor(it["color"] + "22"))  # delikatne tło w kolorze przypomnienia
            li.setSizeHint(QSize(10, 44))
            self.list.addItem(li)
            if it["id"] == keep:
                self.list.setCurrentItem(li)
        self._busy = False

    def _cur_id(self):
        li = self.list.currentItem()
        return li.data(Qt.ItemDataRole.UserRole) if li else None

    def _find(self, rid):
        return next((i for i in self.items if i["id"] == rid), None)

    def _commit(self):
        self.refresh()
        self.changed.emit()

    def add(self):
        d = ReminderDialog(self, None, self.next_color())
        if d.exec() == QDialog.DialogCode.Accepted:
            self.items.append(d.result_item(None))
            self._commit()

    def edit(self):
        it = self._find(self._cur_id())
        if it:
            d = ReminderDialog(self, it)
            if d.exec() == QDialog.DialogCode.Accepted:
                it.update(d.result_item(it))
                self._commit()

    def delete(self):
        it = self._find(self._cur_id())
        if it:
            self.items.remove(it)
            self._commit()

    def set_color(self, it: dict, col: str):
        it["color"] = col
        self._commit()

    def _checked(self, li):
        if self._busy:
            return
        it = self._find(li.data(Qt.ItemDataRole.UserRole))
        if it:
            it["done"] = li.checkState() == Qt.CheckState.Checked
            self._commit()

    def _menu(self, pos):
        li = self.list.itemAt(pos)
        m = QMenu(self)
        m.addAction("Nowe przypomnienie…").triggered.connect(self.add)
        if li:
            self.list.setCurrentItem(li)
            it = self._find(li.data(Qt.ItemDataRole.UserRole))
            m.addAction("Edytuj…").triggered.connect(self.edit)
            cm = m.addMenu("Kolor")
            for c in REM_COLORS:
                a = cm.addAction(QIcon(_swatch(c)), c.upper())
                a.triggered.connect(lambda _c=False, col=c: self.set_color(it, col))
            m.addAction("Oznacz jako wykonane" if not it.get("done") else "Przywróć").triggered.connect(
                lambda: (it.update(done=not it.get("done")), self._commit()))
            m.addAction("Usuń").triggered.connect(self.delete)
        m.exec(self.list.viewport().mapToGlobal(pos))

    def eventFilter(self, obj, ev):
        if obj is self.list and ev.type() == QEvent.Type.KeyPress:
            if ev.key() == Qt.Key.Key_Delete:
                self.delete()
                return True
            if ev.key() in (Qt.Key.Key_Return, Qt.Key.Key_Enter):
                self.edit()
                return True
            if ev.key() == Qt.Key.Key_Insert:
                self.add()
                return True
        return False

    def apply_colors(self):
        u, c = UI, COLORS
        self.setStyleSheet(
            f"#rv{{background:{c['bg']};}}"
            f"QListWidget{{background:{c['bg']};color:{c['text']};border:none;outline:0;}}"
            f"QListWidget::item{{padding:3px 6px;border-radius:5px;}}"
            f"QListWidget::item:selected{{background:{u['sel']};color:{c['text']};}}"
            f"QCheckBox{{color:{u['mute']};}}"
            f"QListWidget::indicator,QCheckBox::indicator{{width:13px;height:13px;border:1px solid {u['mute']};"
            f"border-radius:3px;background:transparent;}}"
            f"QListWidget::indicator:checked,QCheckBox::indicator:checked{{background:{u['border_a']};border-color:{u['border_a']};}}"
            f"QPushButton{{background:{u['hdr_bg']};color:{u['hdr_fg']};border:1px solid {u['border']};"
            f"border-radius:4px;padding:3px 10px;}}QPushButton:hover{{border-color:{u['border_a']};}}")
        self.refresh()



# ---------- edytor ----------

class Editor(QPlainTextEdit):
    fileDropped = Signal(str)
    focused = Signal()

    def focusInEvent(self, e):
        super().focusInEvent(e)
        self.focused.emit()

    def dragEnterEvent(self, e):
        e.acceptProposedAction() if e.mimeData().hasUrls() else super().dragEnterEvent(e)

    def dragMoveEvent(self, e):
        e.acceptProposedAction() if e.mimeData().hasUrls() else super().dragMoveEvent(e)

    def dropEvent(self, e):
        if e.mimeData().hasUrls():
            urls = [u.toLocalFile() for u in e.mimeData().urls() if u.isLocalFile()]
            if urls:
                self.fileDropped.emit(urls[0])
                e.acceptProposedAction()
                return
        super().dropEvent(e)


# ---------- panel ----------

class TextPane(QFrame):
    activated = Signal(object)
    transferRequested = Signal(object, list, bool)  # (panel, ścieżki, przenieś?)
    openFromFolder = Signal(object, str)
    remindersChanged = Signal()
    remindersRequested = Signal(object)
    removeRequested = Signal(object)  # × / Ctrl+W na pustym panelu = usuń panel
    menuRequested = Signal(QPoint)  # globalna pozycja, gdzie pokazać menu
    pathChanged = Signal(str)       # plik otwarty / zapisany przez użytkownika (lista ostatnich)
    img_dir = Path(tempfile.gettempdir()) / "startupboard_obrazy"  # obrazy wklejone ze schowka (ustawia okno)
    PH, ED, PDF, IMG, FOLD, REM = 0, 1, 2, 3, 4, 5   # strony QStackedWidget

    def __init__(self, index: int):
        super().__init__()
        self.index = index
        self.path: str | None = None
        self.kind = "text"  # text | pdf | image | folder
        self.fv: FolderView | None = None  # panel folderu tworzony na żądanie
        self.rv: RemindersView | None = None  # panel przypomnień tworzony na żądanie
        self._fcount = "folder"
        self.untitled = False  # nowy dokument jeszcze bez pliku
        self.clip = False      # obraz wklejony ze schowka (plik w folderze aplikacji)
        self.img_size = (0, 0)
        self.demo: tuple[str, str, str] | None = None  # (nazwa, stan, klucz koloru) – podgląd w Ustawieniach
        self.encoding, self.newline = "utf-8", "\n"
        self.mtime: float | None = None
        self.disk_size = 0
        self.missing = self.conflict = False
        self.save_err: str | None = None  # komunikat ostatniego nieudanego autozapisu
        self.lang = "auto"
        self.family = "Consolas"
        self.border = DEFAULT_BORDER
        self._active = False
        self._auto = QTimer(self, singleShot=True)  # autozapis: odlicza od OSTATNIEJ zmiany tekstu
        self._auto.timeout.connect(self.autosave)
        self.setAcceptDrops(True)

        self.header = QWidget()
        self.header.setObjectName("hdr")
        self.header.setFixedHeight(22)
        h = QHBoxLayout(self.header)
        h.setContentsMargins(8, 0, 2, 0)
        h.setSpacing(4)
        self.lbl_name = QLabel("—")
        self.lbl_name.setMinimumWidth(70)
        self.lbl_name.setSizePolicy(QSizePolicy.Policy.Ignored, QSizePolicy.Policy.Preferred)
        self.lbl_state = QLabel("")
        self.btn_menu = QToolButton(text="☰", toolTip="Menu (Ctrl+M pokazuje/chowa pasek menu)")
        self.btn_wrap = QToolButton(text="↵", checkable=True, checked=True, toolTip="Zawijanie wierszy")
        self.btn_open = QToolButton(text="…", toolTip="Otwórz plik (Ctrl+O)")
        self.btn_close = QToolButton(text="×", toolTip="Zamknij plik (Ctrl+W)")
        h.addWidget(self.lbl_name, 1)
        for w in (self.lbl_state, self.btn_wrap, self.btn_open, self.btn_close, self.btn_menu):
            h.addWidget(w)
        self.header.setContextMenuPolicy(Qt.ContextMenuPolicy.CustomContextMenu)
        self.header.customContextMenuRequested.connect(
            lambda pos: self.menuRequested.emit(self.header.mapToGlobal(pos)))
        self.btn_menu.clicked.connect(
            lambda: self.menuRequested.emit(self.btn_menu.mapToGlobal(QPoint(0, self.btn_menu.height()))))

        self.stack = QStackedWidget()
        self.ph = Placeholder()
        self.lbl_hint = self.ph.lbl_hint
        self.editor = Editor()
        self.editor.setFrameShape(QFrame.Shape.NoFrame)
        self.editor.setLineWrapMode(QPlainTextEdit.LineWrapMode.WidgetWidth)
        self.hl = Highlighter(self.editor.document(), "text")
        self.pdf = PdfViewer()
        self.imgv = ImageViewer()
        for w in (self.ph, self.editor, self.pdf, self.imgv, QWidget(), QWidget()):  # 4, 5 = miejsca na folder i przypomnienia
            self.stack.addWidget(w)

        # pasek wyszukiwania (Ctrl+F)
        self.find_bar = QWidget()
        self.find_bar.setObjectName("fnd")
        self.find_bar.setAttribute(Qt.WidgetAttribute.WA_StyledBackground, True)
        fl = QHBoxLayout(self.find_bar)
        fl.setContentsMargins(6, 2, 2, 2)
        fl.setSpacing(2)
        self.find_edit = QLineEdit()
        self.find_edit.setPlaceholderText("Znajdź…")
        self.find_edit.setClearButtonEnabled(True)
        self.find_edit.installEventFilter(self)
        self.btn_fprev = QToolButton(text="▲", toolTip="Poprzedni (Shift+F3 / Shift+Enter)")
        self.btn_fnext = QToolButton(text="▼", toolTip="Następny (F3 / Enter)")
        self.btn_fcase = QToolButton(text="Aa", checkable=True, toolTip="Uwzględniaj wielkość liter")
        self.lbl_fcount = QLabel("")
        self.btn_fclose = QToolButton(text="×", toolTip="Zamknij wyszukiwanie (Esc)")
        fl.addWidget(self.find_edit, 1)
        for w in (self.lbl_fcount, self.btn_fprev, self.btn_fnext, self.btn_fcase, self.btn_fclose):
            fl.addWidget(w)
        self.find_bar.hide()

        lay = QVBoxLayout(self)
        lay.setContentsMargins(0, 0, 0, 0)
        lay.setSpacing(0)
        lay.addWidget(self.header)
        lay.addWidget(self.stack, 1)
        lay.addWidget(self.find_bar)

        self.set_font(self.family, 10)
        self.btn_wrap.toggled.connect(self.set_wrap)
        self.btn_open.clicked.connect(self.ask_open)
        self.btn_close.clicked.connect(self.close_file)
        self.ph.btn_plus.clicked.connect(lambda: self.new_document())
        self.ph.btn_open.clicked.connect(self.ask_open)
        self.ph.btn_clip.clicked.connect(lambda: self.paste_image())
        self.ph.btn_img.clicked.connect(self.ask_open_image)
        self.ph.btn_dir.clicked.connect(self.ask_open_dir)
        self.ph.btn_rem.clicked.connect(lambda: self.remindersRequested.emit(self))
        self.ph.customContextMenuRequested.connect(lambda pos: self.menuRequested.emit(self.ph.mapToGlobal(pos)))
        self.find_edit.textChanged.connect(self._find_live)
        self.find_edit.returnPressed.connect(lambda: self.find_next())
        self.btn_fnext.clicked.connect(lambda: self.find_next())
        self.btn_fprev.clicked.connect(lambda: self.find_next(True))
        self.btn_fcase.toggled.connect(lambda _c: self._find_live())
        self.btn_fclose.clicked.connect(self.hide_find)
        self.editor.document().modificationChanged.connect(lambda _m: self.refresh_header())
        self.editor.document().contentsChanged.connect(self._on_edit)
        self.editor.fileDropped.connect(self.open_file)
        self.editor.focused.connect(self._on_focus)
        self.set_active(False)
        self.apply_colors()
        self.refresh_header()

    # --- wygląd ---
    def _restyle(self):
        col = grad(UI["border_a"], UI["border_a2"], True) if self._active else grad(UI["border"], UI["border2"], True)
        css = f"TextPane{{border:{self.border}px solid {col};}}" if self.border > 0 else "TextPane{border:none;}"
        self.setStyleSheet(css)
        self.header.setStyleSheet(hdr_css(self._active))

    def set_active(self, on: bool):
        self._active = on
        self._restyle()

    def apply_colors(self):
        self.editor.setStyleSheet(
            f"QPlainTextEdit{{background:{COLORS['bg']};color:{COLORS['text']};"
            f"selection-background-color:{UI['sel']};selection-color:{COLORS['text']};}}")
        self.ph.apply_colors()
        if self.fv:
            self.fv.apply_colors()
        if self.rv:
            self.rv.apply_colors()
        cv = UI["canvas"]
        self.imgv.setStyleSheet(f"QScrollArea{{background:{cv};}}QScrollArea>QWidget>QWidget{{background:{cv};}}")
        self.pdf.restyle()
        u = UI
        self.find_bar.setStyleSheet(
            f"#fnd{{background:{u['hdr_bg']};border-top:1px solid {u['border']};}}"
            f"#fnd QLabel{{color:{u['mute']};font-size:8pt;}}"
            f"#fnd QToolButton{{border:none;color:{u['mute']};padding:1px 6px;font-size:9pt;}}"
            f"#fnd QToolButton:hover,#fnd QToolButton:checked{{color:{u['hdr_fg']};background:{u['border']};}}")
        self._restyle()
        self.refresh_header()
        if self.hl.document() is not None:
            self.hl.rehighlight()

    def set_border(self, n: int):
        self.border = n
        self._restyle()

    def set_font(self, family: str, size: float | None = None):
        self.family = family
        f = QFont(family)
        f.setStyleHint(QFont.StyleHint.Monospace if family in MONO else QFont.StyleHint.AnyStyle)
        f.setPointSizeF(size if size else self.editor.font().pointSizeF())
        self.editor.setFont(f)

    def effective_lang(self) -> str:
        if self.lang != "auto":
            return self.lang
        return EXT_LANG.get(Path(self.path).suffix.lower(), "text") if self.path else "text"

    def apply_lang(self):
        if self.editor.document().characterCount() > HL_MAX_CHARS:
            self.hl.setDocument(None)
            return
        if self.hl.document() is None:
            self.hl.setDocument(self.editor.document())
        self.hl.set_language(self.effective_lang())

    def set_lang(self, lang: str):
        self.lang = lang
        self.apply_lang()

    def set_demo(self, name: str, state: str, ukey: str, text: str, lang: str, select: str = ""):
        """Panel poglądowy (okno Ustawienia): przykładowy tekst, nieinteraktywny."""
        self.demo = (name, state, ukey)
        self.lang = lang
        self.editor.setReadOnly(True)
        self.editor.setFocusPolicy(Qt.FocusPolicy.NoFocus)
        self.setAttribute(Qt.WidgetAttribute.WA_TransparentForMouseEvents, True)
        self.editor.setPlainText(text)
        self.apply_lang()
        self.stack.setCurrentIndex(self.ED)
        if select and select in text:
            cur = QTextCursor(self.editor.document())
            a = text.index(select)
            cur.setPosition(a)
            cur.setPosition(a + len(select), QTextCursor.MoveMode.KeepAnchor)
            self.editor.setTextCursor(cur)
        self.refresh_header()

    def dragEnterEvent(self, e):
        e.acceptProposedAction() if e.mimeData().hasUrls() else None

    def dropEvent(self, e):
        urls = [u.toLocalFile() for u in e.mimeData().urls() if u.isLocalFile()]
        if urls:
            self.open_file(urls[0])

    def _on_focus(self):
        self.activated.emit(self)
        self.check_external()

    def focus_editor(self):
        w = {self.ED: self.editor, self.PDF: self.pdf, self.IMG: self.imgv,
             self.FOLD: self.fv.view if self.fv else None, self.REM: self.rv.list if self.rv else None}.get(
            self.stack.currentIndex(), None) or self.ph.btn_plus
        w.setFocus()
        self.activated.emit(self)

    def is_modified(self) -> bool:
        return self.kind == "text" and self.editor.document().isModified()

    def is_empty(self) -> bool:
        return self.path is None and not self.untitled and self.demo is None and self.kind != "reminders"

    def flash(self, msg: str):
        """Krótki komunikat w pustym panelu (w zajętym: okienko)."""
        if self.stack.currentIndex() == self.PH:
            self.ph.set_hint(msg)
            QTimer.singleShot(2800, lambda: self.ph.set_hint(None) if self.stack.currentIndex() == self.PH else None)
        else:
            QMessageBox.information(self, APP_NAME, msg)

    # --- nagłówek ---
    def refresh_header(self):
        if self.demo:
            name, state, ukey = self.demo
            self.lbl_name.setText(name)
            self.lbl_name.setToolTip("")
            self.lbl_state.setText(state)
            self.lbl_state.setStyleSheet(f"color:{UI[ukey]};")
            return
        if self.kind == "reminders":
            self.lbl_name.setText("Przypomnienia")
            self.lbl_name.setToolTip("Wspólna lista przypomnień (Ins = nowe, Enter = edycja, Del = usuń)")
            n = self.rv.active_count() if self.rv else 0
            self.lbl_state.setText(f"{n} aktywnych")
            self.lbl_state.setStyleSheet(f"color:{UI['info']};")
            return
        if self.untitled:
            self.lbl_name.setText("Bez tytułu")
            self.lbl_name.setToolTip("Nowy dokument – Ctrl+S pozwoli wybrać nazwę i miejsce zapisu")
            txt, col = ("● niezapisany", UI["warn"]) if self.is_modified() else ("nowy", UI["info"])
            self.lbl_state.setText(txt)
            self.lbl_state.setStyleSheet(f"color:{col};")
            self.lbl_state.setToolTip("")
            return
        if self.path is None:
            self.lbl_name.setText("— pusty —")
            self.lbl_name.setToolTip("")
            self.lbl_state.setText("")
            return
        self.lbl_name.setText(Path(self.path).name or self.path)
        self.lbl_name.setToolTip(self.path)
        if self.kind == "folder" and not self.missing:
            self.lbl_state.setText(self._fcount)
            self.lbl_state.setStyleSheet(f"color:{UI['info']};")
            self.lbl_state.setToolTip("Enter otwiera · Backspace w górę · F2 nazwa · F5 kopiuj · F6 przenieś · F7 nowy folder · Del kosz")
            return
        if self.missing:
            txt, col = "⚠ nie otwarto", UI["err"]
        elif self.conflict:
            txt, col = "⚠ zmieniony na dysku", UI["err"]
        elif self.save_err and self.is_modified():
            txt, col = "⚠ błąd zapisu", UI["err"]
        elif self.kind == "pdf":
            txt, col = f"PDF · {self.pdf.page_count()} str.", UI["info"]
        elif self.kind == "image":
            txt, col = f"obraz · {self.img_size[0]}×{self.img_size[1]}", UI["info"]
        elif self.is_modified():
            txt, col = "● niezapisany", UI["warn"]
        else:
            txt, col = "zapisany", UI["ok"]
        if not self.missing:
            txt += f" · {human_size(self.disk_size)}"
        self.lbl_state.setText(txt)
        self.lbl_state.setStyleSheet(f"color:{col};")
        tip = f"Kodowanie: {self.encoding}" if self.kind == "text" else ""
        if self.conflict:
            tip = ("Plik zmieniono poza programem. Autozapis wstrzymany: Ctrl+S nadpisze plik Twoją wersją "
                   "(wersja z dysku trafi do Historii wersji).")
        elif self.save_err and self.is_modified():
            tip = f"Nie udało się zapisać: {self.save_err}\nPonowna próba za chwilę lub Ctrl+S."
        self.lbl_state.setToolTip(tip)

    # --- szukanie ---
    def eventFilter(self, obj, ev):
        if obj is self.find_edit and ev.type() == QEvent.Type.KeyPress:
            if ev.key() == Qt.Key.Key_Escape:
                self.hide_find()
                return True
            if ev.key() in (Qt.Key.Key_Return, Qt.Key.Key_Enter) and ev.modifiers() & Qt.KeyboardModifier.ShiftModifier:
                self.find_next(True)
                return True
        return super().eventFilter(obj, ev)

    def can_find(self) -> bool:
        return self.kind == "text" and self.stack.currentIndex() == self.ED and self.demo is None

    def show_find(self):
        if not self.can_find():
            return
        sel = self.editor.textCursor().selectedText()
        if sel and " " not in sel and len(sel) < 200:
            self.find_edit.setText(sel)
        self.find_bar.show()
        self.find_edit.setFocus()
        self.find_edit.selectAll()
        self._find_count()

    def hide_find(self):
        self.find_bar.hide()
        if self.stack.currentIndex() == self.ED:
            self.editor.setFocus()

    def find_next(self, backwards: bool = False) -> bool:
        q = self.find_edit.text()
        if not q or not self.can_find():
            return False
        flags = QTextDocument.FindFlag(0)
        if backwards:
            flags |= QTextDocument.FindFlag.FindBackward
        if self.btn_fcase.isChecked():
            flags |= QTextDocument.FindFlag.FindCaseSensitively
        ed = self.editor
        if ed.find(q, flags):
            return True
        keep = QTextCursor(ed.textCursor())
        wrap = QTextCursor(ed.document())  # zawinięcie: od początku / od końca dokumentu
        wrap.movePosition(QTextCursor.MoveOperation.End if backwards else QTextCursor.MoveOperation.Start)
        ed.setTextCursor(wrap)
        if ed.find(q, flags):
            return True
        ed.setTextCursor(keep)
        return False

    def _find_live(self, _t=None):
        q = self.find_edit.text()
        ok = True
        if q and self.can_find():
            cur = self.editor.textCursor()
            cur.setPosition(min(cur.anchor(), cur.position()))  # zostań na bieżącym trafieniu, gdy dopisujesz znaki
            self.editor.setTextCursor(cur)
            ok = self.find_next()
        self.find_edit.setStyleSheet("" if ok else f"color:{UI['err']};")
        self._find_count()

    def _find_count(self):
        q = self.find_edit.text()
        if not q or not self.can_find():
            self.lbl_fcount.setText("")
            return
        txt = self.editor.toPlainText()
        n = txt.count(q) if self.btn_fcase.isChecked() else txt.lower().count(q.lower())
        self.lbl_fcount.setText(f"{n}×" if n else "brak")

    # --- pliki ---
    def _start_dir(self) -> str:
        if self.path:
            return str(Path(self.path).parent)
        return LAST["dir"] or QStandardPaths.writableLocation(QStandardPaths.StandardLocation.DocumentsLocation)

    def _note_path(self):
        if self.path:
            LAST["dir"] = str(Path(self.path).parent)
            self.pathChanged.emit(self.path)

    def ask_open(self):
        if not self.confirm_close():
            return
        fn, _ = QFileDialog.getOpenFileName(
            self, "Otwórz plik", self._start_dir(),
            "Obsługiwane (*.txt *.py *.html *.htm *.sql *.md *.csv *.json *.log *.pdf *.png *.jpg *.jpeg *.bmp "
            "*.gif *.webp);;Wszystkie (*)")
        if fn:
            self.open_file(fn, ask=False)

    def ask_open_image(self):
        if not self.confirm_close():
            return
        fn, _ = QFileDialog.getOpenFileName(
            self, "Otwórz obraz", self._start_dir(),
            "Obrazy (*.png *.jpg *.jpeg *.bmp *.gif *.webp *.ico *.tif *.tiff);;Wszystkie (*)")
        if fn:
            self.open_file(fn, ask=False)

    def _release(self):
        """Zwolnij bieżącą zawartość (PDF, obraz, flagi) przed wczytaniem innej."""
        self.pdf.close_doc()
        self.imgv.clear()
        self.find_bar.hide()
        if self.rv is not None:
            self._mount(self.REM, QWidget())
            self.rv = None
        if self.fv is not None:  # zwolnij widok folderu (obserwator plików, model)
            self._mount(self.FOLD, QWidget())
            self.fv = None
        self.kind, self.untitled, self.clip = "text", False, False
        self.missing = self.conflict = False
        self.ph.set_hint(None)

    def open_file(self, path: str, st: dict | None = None, ask: bool = True) -> bool:
        if ask and not self.confirm_close():
            return False
        fresh = not st  # otwarcie zrobione przez użytkownika (nie odtwarzanie stanu) -> lista ostatnich
        st = st or {}
        p = Path(path)
        if p.is_dir():
            return self.open_folder(str(p), fresh, ask=False)
        ext = p.suffix.lower()
        kind = "pdf" if ext == ".pdf" else "image" if ext in IMG_EXTS else "text"
        try:
            stt = p.stat()
            limit = {"pdf": MAX_PDF_BYTES, "image": MAX_IMG_BYTES}.get(kind, MAX_BYTES)
            if stt.st_size > limit:
                raise ValueError(f"plik większy niż {human_size(limit)}")
            raw = b"" if kind == "image" else p.read_bytes()
        except Exception as ex:
            self._set_missing(str(p), str(ex))
            return False
        ok = (self._open_pdf(p, raw, stt, st) if kind == "pdf" else
              self._open_image(p, stt, st) if kind == "image" else self._open_text(p, raw, stt, st))
        if ok and fresh and not self.clip:
            self._note_path()
        return ok

    def _mount(self, idx: int, w: QWidget):
        """Podmień widget na stałym miejscu stosu (indeksy stron się nie przesuwają)."""
        old = self.stack.widget(idx)
        self.stack.removeWidget(old)
        old.deleteLater()
        self.stack.insertWidget(idx, w)

    def open_folder(self, path: str, fresh: bool = True, ask: bool = True) -> bool:
        if ask and not self.confirm_close():
            return False
        if not Path(path).is_dir():
            self._set_missing(path, "folder nie istnieje")
            return False
        self._release()
        self.editor.setPlainText("")
        self.editor.document().setModified(False)
        self.kind, self.path, self.mtime, self.disk_size = "folder", path, None, 0
        self._fcount = "folder"
        self.btn_wrap.setEnabled(False)
        fv = self.fv = FolderView()
        self._mount(self.FOLD, fv)
        fv.counted.connect(self._on_fcount)
        fv.navigated.connect(self._on_fnav)
        fv.openFile.connect(lambda f: self.openFromFolder.emit(self, f))
        fv.transfer.connect(lambda paths, mv: self.transferRequested.emit(self, paths, mv))
        fv.activated.connect(lambda: self.activated.emit(self))
        fv.navigate(path)
        self.stack.setCurrentIndex(self.FOLD)
        self.refresh_header()
        if fresh:
            LAST["dir"] = path
        return True

    def open_reminders(self, items: list) -> bool:
        if not self.confirm_close():
            return False
        self._release()
        self.editor.setPlainText("")
        self.editor.document().setModified(False)
        self.kind, self.path, self.mtime, self.disk_size = "reminders", None, None, 0
        self.btn_wrap.setEnabled(False)
        rv = self.rv = RemindersView(items)
        self._mount(self.REM, rv)
        rv.changed.connect(lambda: (self.refresh_header(), self.remindersChanged.emit()))
        self.stack.setCurrentIndex(self.REM)
        self.refresh_header()
        return True

    def _on_fcount(self, txt: str):
        self._fcount = txt
        self.refresh_header()

    def _on_fnav(self, path: str):
        self.path = path
        self.refresh_header()

    def note(self, msg: str, ms: int = 3500):
        """Chwilowy komunikat w nagłówku (np. wynik kopiowania)."""
        self.lbl_state.setText(msg)
        QTimer.singleShot(ms, self.refresh_header)

    def ask_open_dir(self):
        if not self.confirm_close():
            return
        d = QFileDialog.getExistingDirectory(self, "Otwórz folder w panelu", self._start_dir())
        if d:
            self.open_folder(d, ask=False)

    def _open_text(self, p: Path, raw: bytes, stt, st: dict) -> bool:
        if b"\x00" in raw[:8192] and not raw.startswith((codecs.BOM_UTF16_LE, codecs.BOM_UTF16_BE)):
            self._set_missing(str(p), "plik binarny; ten format nie jest jeszcze obsługiwany")
            return False
        text, enc = decode_bytes(raw)
        self._release()
        self.path, self.encoding = str(p), enc
        self.newline = "\r\n" if b"\r\n" in raw else "\n"
        self.mtime, self.disk_size = stt.st_mtime, stt.st_size
        self.btn_wrap.setEnabled(True)
        self.lang = st.get("lang", self.lang if st else "auto")
        if st.get("family") in FONTS:
            self.family = st["family"]
        self.set_font(self.family, st.get("font") or None)
        self.editor.setPlainText(text)
        self.editor.document().setModified(False)
        self.apply_lang()
        self.stack.setCurrentIndex(self.ED)
        self._apply_view_state(st)
        self.refresh_header()
        return True

    def _open_pdf(self, p: Path, raw: bytes, stt, st: dict) -> bool:
        try:
            self.pdf.load(raw)
        except Exception as ex:
            self._set_missing(str(p), f"nie można otworzyć PDF: {ex}")
            return False
        self.editor.setPlainText("")
        self.editor.document().setModified(False)
        self.imgv.clear()
        self.find_bar.hide()
        self.kind, self.path, self.untitled, self.clip = "pdf", str(p), False, False
        self.mtime, self.disk_size = stt.st_mtime, stt.st_size
        self.missing = self.conflict = False
        self.ph.set_hint(None)
        self.btn_wrap.setEnabled(False)
        self.stack.setCurrentIndex(self.PDF)
        z = float(st.get("pdf_zoom", 0) or 0)
        if z > 0:
            self.pdf.zoom = z
            self.pdf.relayout()
        page = int(st.get("page", 0))
        QTimer.singleShot(80, lambda: self.pdf.jump(page))
        self.refresh_header()
        return True

    def _open_image(self, p: Path, stt, st: dict) -> bool:
        rd = QImageReader(str(p))
        rd.setAutoTransform(True)
        sz = rd.size()
        if sz.isValid() and sz.width() * sz.height() > MAX_IMG_PIXELS:
            self._set_missing(str(p), f"obraz zbyt duży ({sz.width()}×{sz.height()} px)")
            return False
        img = rd.read()
        if img.isNull():
            self._set_missing(str(p), f"nie można odczytać obrazu: {rd.errorString()}")
            return False
        self._release()
        self.editor.setPlainText("")
        self.editor.document().setModified(False)
        self.kind, self.path, self.clip = "image", str(p), bool(st.get("clip"))
        self.mtime, self.disk_size = stt.st_mtime, stt.st_size
        self.img_size = (img.width(), img.height())
        self.btn_wrap.setEnabled(False)
        self.imgv.zoom = max(0.0, float(st.get("img_zoom", 0) or 0))
        self.imgv.load(img)
        self.stack.setCurrentIndex(self.IMG)
        self.refresh_header()
        return True

    def paste_image(self) -> bool:
        """Wstaw obraz ze schowka (lub plik graficzny skopiowany w Eksploratorze)."""
        src = clipboard_image_source()
        if src is None:
            self.flash("Schowek nie zawiera obrazu")
            return False
        if not self.confirm_close():
            return False
        md = QApplication.clipboard().mimeData()
        if src == "file":
            fn = next(u.toLocalFile() for u in md.urls() if u.isLocalFile() and Path(u.toLocalFile()).suffix.lower() in IMG_EXTS)
            return self.open_file(fn, ask=False)
        img = QApplication.clipboard().image()
        try:
            self.img_dir.mkdir(parents=True, exist_ok=True)
            base = time.strftime("schowek_%Y%m%d_%H%M%S")
            path, n = self.img_dir / f"{base}.png", 1
            while path.exists():
                n += 1
                path = self.img_dir / f"{base}_{n}.png"
            if not img.save(str(path), "PNG"):
                raise OSError("zapis PNG nie powiódł się")
        except Exception as ex:
            self.flash(f"Nie można zapisać obrazu: {ex}")
            return False
        return self.open_file(str(path), {"clip": True}, ask=False)

    def save_image_as(self) -> bool:
        if self.kind != "image" or self.imgv.pix.isNull():
            return False
        stem = Path(self.path).stem if self.path else "obraz"
        fn, flt = QFileDialog.getSaveFileName(
            self, "Zapisz obraz jako", str(Path(self._start_dir()) / f"{stem}.png"),
            "PNG (*.png);;JPEG (*.jpg *.jpeg);;BMP (*.bmp)")
        if not fn:
            return False
        if not Path(fn).suffix:
            fn += ".jpg" if "JPEG" in flt else ".bmp" if "BMP" in flt else ".png"
        if not self.imgv.pix.save(fn):
            QMessageBox.warning(self, "Błąd zapisu", f"Nie można zapisać obrazu:\n{fn}")
            return False
        LAST["dir"] = str(Path(fn).parent)
        return True

    def new_document(self, text: str = "", modified: bool = False, st: dict | None = None, ask: bool = True) -> bool:
        """Nowy, pusty dokument tekstowy gotowy do pisania; nazwę dostaje przy pierwszym zapisie."""
        if ask and not self.confirm_close():
            return False
        fresh = st is None
        st = st or {}
        self._release()
        self.path, self.untitled = None, True
        self.encoding, self.newline = "utf-8", "\r\n" if sys.platform == "win32" else "\n"
        self.mtime, self.disk_size = None, 0
        self.btn_wrap.setEnabled(True)
        if st.get("lang") in dict(LANGS):
            self.lang = st["lang"]
        if st.get("family") in FONTS:
            self.family = st["family"]
        self.set_font(self.family, st.get("font") or None)
        self.editor.setPlainText(text)
        self.editor.document().setModified(bool(modified))
        self.apply_lang()
        self.stack.setCurrentIndex(self.ED)
        self._apply_view_state(st)
        self.refresh_header()
        if fresh:
            self.focus_editor()
        return True

    def _set_missing(self, path: str, why: str):
        self._release()
        self.path, self.missing, self.mtime = path, True, None
        self.editor.setPlainText("")
        self.editor.document().setModified(False)
        self.ph.set_hint(f"Nie można otworzyć:\n{path}\n({why})")
        self.stack.setCurrentIndex(self.PH)
        self.refresh_header()

    def _apply_view_state(self, st: dict):
        self.btn_wrap.setChecked(bool(st.get("wrap", True)))
        cur = QTextCursor(self.editor.document())
        cur.setPosition(max(0, min(int(st.get("cursor", 0)), self.editor.document().characterCount() - 1)))
        self.editor.setTextCursor(cur)
        sc = int(st.get("scroll", 0))
        QTimer.singleShot(60, lambda: self.editor.verticalScrollBar().setValue(sc))

    def set_wrap(self, on: bool):
        self.editor.setLineWrapMode(QPlainTextEdit.LineWrapMode.WidgetWidth if on
                                    else QPlainTextEdit.LineWrapMode.NoWrap)

    def save(self) -> bool:
        if self.kind != "text" or self.stack.currentIndex() != self.ED or self.demo:
            return True
        if self.untitled:
            return self.save_as()
        if self.path is None:
            return True
        return self._write(self.path)

    def save_as(self) -> bool:
        if self.kind != "text" or self.stack.currentIndex() != self.ED or self.demo:
            return False
        name = Path(self.path).name if self.path else "Bez tytułu.txt"
        fn, flt = QFileDialog.getSaveFileName(
            self, "Zapisz jako", str(Path(self._start_dir()) / name),
            "Tekst (*.txt);;Python (*.py);;HTML (*.html *.htm);;SQL (*.sql);;Wszystkie (*)")
        if not fn:
            return False
        if not Path(fn).suffix:
            m = re.search(r"\*(\.\w+)", flt)
            fn += m.group(1) if m and "Wszystkie" not in flt else ".txt"
        return self._write(fn)

    def _data(self) -> bytes:
        """Zawartość edytora w kodowaniu i z końcami wierszy pliku."""
        text = self.editor.toPlainText().replace("\n", self.newline)
        try:
            return text.encode(self.encoding)
        except UnicodeEncodeError:
            self.encoding = "utf-8"
            return text.encode("utf-8")

    def _hist_before_write(self, path: str, data: bytes):
        """Kopia poprzedniej wersji z dysku: przy zmianie z zewnątrz / innym pliku od razu, w trakcie pracy co >= 2 min."""
        try:
            p = Path(path)
            if not p.is_file():
                return
            ext = path != self.path or self.mtime is None or abs(p.stat().st_mtime - self.mtime) > 1e-6
            now = time.time()
            if not ext and now - HIST["last"].get(path, 0.0) < HIST["gap"]:
                return
            if hist_push(path, p.read_bytes()):
                HIST["last"][path] = now
        except OSError:
            pass

    def _write(self, path: str, silent: bool = False) -> bool:
        data = self._data()
        try:
            self._hist_before_write(path, data)
            atomic_write(Path(path), data)
            s = Path(path).stat()
        except Exception as ex:
            if silent:
                self.save_err = str(ex)
                self.refresh_header()
                QTimer.singleShot(10_000, self.autosave)  # ponów, gdy plik był chwilowo zablokowany
            else:
                QMessageBox.warning(self, "Błąd zapisu", f"{path}\n\n{ex}")
            return False
        moved = path != self.path
        self.path, self.untitled, self.missing, self.save_err = path, False, False, None
        self.mtime, self.disk_size, self.conflict = s.st_mtime, s.st_size, False
        self.editor.document().setModified(False)
        self.apply_lang()
        self.refresh_header()
        if moved:
            self._note_path()
        return True

    def can_autosave(self) -> bool:
        return (AUTO["on"] and self.kind == "text" and self.demo is None and bool(self.path) and not self.untitled
                and not self.missing and not self.conflict and self.stack.currentIndex() == self.ED)

    def _on_edit(self):
        if AUTO["on"] and self.path and not self.untitled and self.kind == "text":
            self._auto.start(AUTO["ms"])  # każda zmiana odsuwa zapis: plik powstaje 2 s po ostatnim znaku

    def autosave(self) -> bool:
        """Cichy zapis zmian do pliku; nie nadpisuje, gdy plik zmieniono poza programem."""
        if not self.is_modified() or not self.can_autosave():
            return False
        try:
            m = Path(self.path).stat().st_mtime
        except OSError:
            m = None
        if m is None or (self.mtime is not None and m != self.mtime):
            self.conflict = True  # plik zmieniony / usunięty z zewnątrz: decyzja należy do użytkownika
            self.refresh_header()
            return False
        return self._write(self.path, silent=True)

    def confirm_close(self) -> bool:
        if not self.is_modified():
            return True
        if self.can_autosave():  # autozapis włączony: zamknięcie po prostu zapisuje
            return self.save()
        name = Path(self.path).name if self.path else "Bez tytułu"
        r = QMessageBox.question(
            self, "Niezapisane zmiany", f"Zapisać zmiany w „{name}”?",
            QMessageBox.StandardButton.Save | QMessageBox.StandardButton.Discard | QMessageBox.StandardButton.Cancel)
        if r == QMessageBox.StandardButton.Save:
            return self.save()
        return r == QMessageBox.StandardButton.Discard

    def clear_content(self):
        """Opróżnij panel bez pytania (po wcześniejszym confirm_close)."""
        self._release()
        self.path, self.mtime = None, None
        self.editor.setPlainText("")
        self.editor.document().setModified(False)
        self.btn_wrap.setEnabled(True)
        self.stack.setCurrentIndex(self.PH)
        self.refresh_header()

    def close_file(self):
        if self.is_empty() and self.demo is None:
            self.removeRequested.emit(self)
            return
        if self.confirm_close():
            self.clear_content()

    def check_external(self):
        if not self.path or self.missing or self.mtime is None:
            return
        try:
            m = Path(self.path).stat().st_mtime
        except OSError:
            self.missing = True
            self.refresh_header()
            return
        if m == self.mtime:
            return
        if self.is_modified():
            self.conflict = True
            self.refresh_header()
        else:
            if self.kind == "text" and not self.untitled:  # to, co było w panelu, zanim zmiana z zewnątrz to zastąpi
                now = time.time()
                if now - HIST["last"].get(self.path + "|ext", 0.0) > 10:
                    HIST["last"][self.path + "|ext"] = now
                    hist_push(self.path, self._data())
            self.open_file(self.path, self.state(), ask=False)

    def state(self) -> dict:
        d = {
            "path": self.path, "wrap": self.btn_wrap.isChecked(),
            "cursor": self.editor.textCursor().position(),
            "scroll": self.editor.verticalScrollBar().value(),
            "font": self.editor.font().pointSizeF(), "family": self.family, "lang": self.lang,
        }
        if self.kind == "pdf":
            d["page"], d["pdf_zoom"] = self.pdf.current_page(), self.pdf.zoom
        elif self.kind == "image":
            d["img_zoom"], d["clip"] = self.imgv.zoom, self.clip
        if self.kind == "reminders":
            d["reminders"] = True
        if self.untitled:
            d["untitled"] = True
            d["draft"] = self.editor.toPlainText()[:MAX_BYTES]
            d["draft_mod"] = self.editor.document().isModified()
        return d


# ---------- płótno z wolnym układem i przyciąganiem ----------

class Canvas(QWidget):
    layoutChanged = Signal()
    GRAB, MIN_W, MIN_H, SNAP = 6, 160, 90, 12
    CURSORS = {"L": Qt.CursorShape.SizeHorCursor, "R": Qt.CursorShape.SizeHorCursor,
               "T": Qt.CursorShape.SizeVerCursor, "B": Qt.CursorShape.SizeVerCursor,
               "LT": Qt.CursorShape.SizeFDiagCursor, "RB": Qt.CursorShape.SizeFDiagCursor,
               "RT": Qt.CursorShape.SizeBDiagCursor, "LB": Qt.CursorShape.SizeBDiagCursor}

    def __init__(self, panes: list[TextPane]):
        super().__init__()
        self.panes = panes  # lista współdzielona z oknem głównym
        self.order = list(panes)  # od spodu do góry
        self.rel: dict[TextPane, QRectF] = {}
        self.snap_on = True
        self.setObjectName("cv")
        self.setAttribute(Qt.WidgetAttribute.WA_StyledBackground, True)
        self._drag: dict | None = None
        self._cursor_on = False
        for p in panes:
            p.setParent(self)
            p.show()
        self.grid()
        QApplication.instance().installEventFilter(self)

    # --- geometria ---
    def grid(self):
        n = len(self.panes)
        rows = 2 if n >= 4 else 1
        cols = -(-n // rows)
        for i, p in enumerate(self.panes):
            c, r = i % cols, i // cols
            self.rel[p] = QRectF(c / cols, r / rows, 1 / cols, 1 / rows)
        self.apply_all()
        self.layoutChanged.emit()

    def add_pane(self, p: TextPane):
        off = 0.03 * (len(self.panes) % 6)
        p.setParent(self)
        self.rel[p] = QRectF(0.25 + off, 0.2 + off, 0.35, 0.45)
        self.panes.append(p)
        self.order.append(p)
        p.show()
        self.apply(p)
        p.raise_()
        self.layoutChanged.emit()

    def remove_pane(self, p: TextPane):
        self.panes.remove(p)
        self.order.remove(p)
        self.rel.pop(p, None)
        p.pdf.close_doc()
        p.imgv.clear()
        p.hide()
        p.setParent(None)
        p.deleteLater()
        for i, q in enumerate(self.panes):
            q.index = i
        self.layoutChanged.emit()

    def set_bg(self, c1: str, c2: str | None = None):
        self.setStyleSheet(f"#cv{{background:{grad(c1, c2 or c1, True)};}}")

    def apply_all(self):
        for p in self.panes:
            self.apply(p)

    def apply(self, p: TextPane):
        W, H = max(self.width(), 1), max(self.height(), 1)
        r = self.rel[p]
        x1, x2 = round(r.left() * W), round(r.right() * W)
        y1, y2 = round(r.top() * H), round(r.bottom() * H)
        p.setGeometry(x1, y1, max(x2 - x1, 1), max(y2 - y1, 1))

    def store(self, p: TextPane, g: QRect):
        W, H = max(self.width(), 1), max(self.height(), 1)
        self.rel[p] = QRectF(g.x() / W, g.y() / H, g.width() / W, g.height() / H)

    def resizeEvent(self, e):
        super().resizeEvent(e)
        self.apply_all()

    def raise_pane(self, p: TextPane):
        if self.order[-1] is not p:
            self.order.remove(p)
            self.order.append(p)
            p.raise_()

    def pane_at(self, cp: QPoint):
        for p in reversed(self.order):
            if p.geometry().contains(cp):
                return p
        return None

    def zone_at(self, pane: TextPane, cp: QPoint, obj) -> str | None:
        g, m = pane.geometry(), self.GRAB
        z = ("L" if cp.x() - g.left() < m else "R" if g.right() - cp.x() < m else "") + \
            ("T" if cp.y() - g.top() < m else "B" if g.bottom() - cp.y() < m else "")
        if z:
            return "".join(sorted(z, key="LRTB".index))
        hdr = QRect(pane.header.mapTo(self, QPoint(0, 0)), pane.header.size())
        if hdr.contains(cp) and not isinstance(obj, QAbstractButton):
            return "M"
        return None

    # --- przeciąganie ---
    def begin_drag(self, pane: TextPane, zone: str, gp: QPoint):
        self.raise_pane(pane)
        pane.activated.emit(pane)
        self._drag = {"pane": pane, "zone": zone, "start": QPoint(gp), "rect": QRect(pane.geometry())}
        self._hover(self.CURSORS.get(zone))
        self.grabMouse()

    def _targets(self, pane: TextPane):
        xs, ys = [0, self.width()], [0, self.height()]
        for o in self.panes:
            if o is not pane:
                g = o.geometry()
                xs += [g.left(), g.left() + g.width()]
                ys += [g.top(), g.top() + g.height()]
        return xs, ys

    def _snap(self, edges, targets) -> int:
        best = 0
        bd = self.SNAP + 1
        for e in edges:
            for t in targets:
                if abs(t - e) < bd:
                    bd, best = abs(t - e), t - e
        return best if bd <= self.SNAP else 0

    def update_drag(self, gp: QPoint, no_snap: bool = False):
        d = self._drag
        pane, zone, s = d["pane"], d["zone"], d["rect"]
        dx, dy = gp.x() - d["start"].x(), gp.y() - d["start"].y()
        W, H = self.width(), self.height()
        snap = self.snap_on and not no_snap
        xs, ys = self._targets(pane)
        if zone == "M":
            r = QRect(s)
            r.translate(dx, dy)
            if snap:
                r.translate(self._snap([r.left(), r.left() + r.width()], xs),
                            self._snap([r.top(), r.top() + r.height()], ys))
            r.moveLeft(max(0, min(r.left(), W - r.width())))
            r.moveTop(max(0, min(r.top(), H - r.height())))
        else:
            l, t = s.left(), s.top()
            rt, b = s.left() + s.width(), s.top() + s.height()
            if "L" in zone:
                l += dx
                l += self._snap([l], xs) if snap else 0
                l = max(0, min(l, rt - self.MIN_W))
            if "R" in zone:
                rt += dx
                rt += self._snap([rt], xs) if snap else 0
                rt = max(l + self.MIN_W, min(rt, W))
            if "T" in zone:
                t += dy
                t += self._snap([t], ys) if snap else 0
                t = max(0, min(t, b - self.MIN_H))
            if "B" in zone:
                b += dy
                b += self._snap([b], ys) if snap else 0
                b = max(t + self.MIN_H, min(b, H))
            r = QRect(l, t, rt - l, b - t)
        pane.setGeometry(r)
        self.store(pane, r)

    def end_drag(self):
        if self._drag:
            self._drag = None
            self.releaseMouse()
            self._hover(None)
            self.layoutChanged.emit()

    def _hover(self, shape):
        if shape is not None and not self._cursor_on:
            QApplication.setOverrideCursor(shape)
            self._cursor_on = True
        elif shape is not None:
            QApplication.changeOverrideCursor(shape)
        elif self._cursor_on:
            QApplication.restoreOverrideCursor()
            self._cursor_on = False

    def eventFilter(self, obj, ev):
        t = ev.type()
        if t not in (QEvent.Type.MouseButtonPress, QEvent.Type.MouseMove, QEvent.Type.MouseButtonRelease):
            return False
        if not isinstance(obj, QWidget):
            return False
        if not (obj is self or self.isAncestorOf(obj)):
            if t == QEvent.Type.MouseMove and not self._drag:
                self._hover(None)
            return False
        gp = ev.globalPosition().toPoint()
        if t == QEvent.Type.MouseMove and self._drag:
            self.update_drag(gp, bool(ev.modifiers() & Qt.KeyboardModifier.AltModifier))
            return True
        if t == QEvent.Type.MouseButtonRelease and self._drag:
            self.end_drag()
            return True
        cp = self.mapFromGlobal(gp)
        pane = self.pane_at(cp)
        if t == QEvent.Type.MouseButtonPress and ev.button() == Qt.MouseButton.LeftButton and pane:
            zone = self.zone_at(pane, cp, obj)
            if zone:
                self.begin_drag(pane, zone, gp)
                return True
            self.raise_pane(pane)
            pane.activated.emit(pane)
        elif t == QEvent.Type.MouseMove:
            zone = self.zone_at(pane, cp, obj) if pane else None
            self._hover(self.CURSORS.get(zone) if zone else None)
        return False


# ---------- okno Ustawienia z podglądem na żywo ----------

UI_LABELS = [("hdr_bg", "Pasek panelu"), ("hdr_bg_a", "Pasek aktywnego panelu"), ("hdr_fg", "Tekst paska"),
             ("mute", "Tekst pomocniczy"), ("canvas", "Tło za panelami"), ("sel", "Zaznaczenie tekstu"),
             ("ok", "Status: zapisany"), ("warn", "Status: niezapisany"), ("err", "Status: błąd"),
             ("info", "Status: informacja")]
GRAD_LABELS = [("hdr_bg2", "Pasek: koniec"), ("hdr_bg_a2", "Pasek aktywny: koniec"),
               ("border2", "Ramka: koniec"), ("border_a2", "Ramka aktywna: koniec"), ("canvas2", "Tło za panelami: koniec")]
SYNTAX_TIPS = {"kw": "if, for, return, SELECT, FROM…", "kw2": "def, class, import, INSERT, CREATE…",
               "const": "True, None, NULL", "func": "nazwy wywoływanych funkcji", "builtin": "print, len, open, self…",
               "cls": "nazwy klas i typów (INT, VARCHAR)", "deco": "@dekorator", "tag": "znaczniki HTML: div, p, a…",
               "attr": "class=, href=", "link": "https://…, mail@poczta.pl", "date": "2026-11-16, 17:30",
               "mark": "TODO, UWAGA, PILNE"}
SAMPLES = {
    "python": ("przyklad.py", '''# Przykład: wszystkie kolory składni
import os, re

@cache
class Raport(Base):
    """Opis klasy"""
    def policz(self, x, y=2.5):
        dane = {"klucz": [1, 2, 3], 'b': 0x1F}
        if x >= 10 and y != 0:  # TODO: warunek
            maska = (x & 7) | (y ^ ~3)
            print("suma:", x + y - 1, x * y / 2 % 3)
        for k in dane:
            pass
        return dane or None
''', "policz"),
    "sql": ("raport.sql", '''-- Raport klientów
SELECT k.id, COUNT(*) AS liczba, 'ok' AS status
FROM klienci k
JOIN zamowienia z ON z.klient_id = k.id
WHERE z.kwota >= 100.50 AND k.miasto <> "Łódź"
GROUP BY k.id
ORDER BY liczba DESC
LIMIT 10;
CREATE TABLE log (id INT PRIMARY KEY, opis VARCHAR(50) DEFAULT NULL);
''', "klienci"),
    "html": ("strona.html", '''<!DOCTYPE html>
<!-- Karta produktu -->
<div class="karta" id="a1">
  <h1 style="color:#1e88e5">Tytuł &amp; opis</h1>
  <a href="https://example.pl?id=7">Zobacz</a>
</div>
''', "karta"),
    "text": ("notatki.txt", '''Zakupy na jutro: chleb, mleko, jaja (6 szt.)
UWAGA! Czy to wszystko? Cena: 12,50 zł + 23% VAT
Termin: 2026-11-16 o 17:30, strona https://smialo.org
Plik: raport_2026.txt | a & b ^ c ~ d | x < y > z
Mapa {a: 1}, lista [1, 2], C:\\temp, mail@poczta.pl, $zmienna
'wartość w apostrofach' i "wartość w cudzysłowie"; 5*3/2-1=0
''', "UWAGA"),
}


class ColorButton(QPushButton):
    """Przycisk z próbką koloru; klik otwiera wybór koloru."""

    def __init__(self, label: str):
        super().__init__(label.replace("&", "&&"))  # && = dosłowny znak & (nie skrót klawiszowy)
        self.tip = ""
        self.setCursor(Qt.CursorShape.PointingHandCursor)

    def set_color(self, col: str):
        pm = QPixmap(26, 14)
        pm.fill(QColor(col))
        p = QPainter(pm)
        p.setPen(QColor("#808080"))
        p.drawRect(0, 0, 25, 13)
        p.end()
        self.setIcon(QIcon(pm))
        self.setIconSize(QSize(26, 14))
        self.setToolTip(col.upper() + (f"  ·  {self.tip}" if self.tip else ""))


class SettingsDialog(ThemedDialog):
    """Ustawienia wyglądu: zmiany widać od razu (w oknie i w podglądzie obok); Anuluj cofa wszystko."""
    PAGES = ["Motyw", "Składnia", "Ramki", "Czcionka", "Ogólne"]

    def __init__(self, win: "MainWindow"):
        super().__init__(win)
        self.win = win
        self.setWindowTitle("Ustawienia")
        self.resize(1100, 680)
        self.snap = win.snapshot_look()
        self._pending: tuple[str, bool, str] | None = None
        self._syncing = False
        self._timer = QTimer(self, singleShot=True, interval=45)
        self._timer.timeout.connect(self._flush)
        self.col_btns: dict[str, ColorButton] = {}
        self.ui_btns: dict[str, ColorButton] = {}

        root = QVBoxLayout(self)
        root.setContentsMargins(12, 12, 12, 10)
        root.setSpacing(10)
        body = QHBoxLayout()
        body.setSpacing(12)
        self.nav = QListWidget()
        self.nav.setFixedWidth(116)
        for name in self.PAGES:
            it = QListWidgetItem(name)
            it.setSizeHint(QSize(0, 30))
            self.nav.addItem(it)
        self.pages = QStackedWidget()
        self.pages.setFixedWidth(420)
        for build in (self._page_theme, self._page_syntax, self._page_borders, self._page_font, self._page_general):
            self.pages.addWidget(build())
        body.addWidget(self.nav)
        body.addWidget(self.pages)
        body.addWidget(self._build_preview(), 1)
        root.addLayout(body, 1)
        foot = QHBoxLayout()
        b_def, b_cancel, b_ok = QPushButton("Przywróć domyślne"), QPushButton("Anuluj"), QPushButton("OK")
        b_def.setToolTip("Motyw, kolory, ramki, czcionka i ikona wracają do ustawień fabrycznych (można jeszcze Anulować)")
        b_ok.setDefault(True)
        foot.addWidget(b_def)
        foot.addStretch(1)
        foot.addWidget(b_cancel)
        foot.addWidget(b_ok)
        root.addLayout(foot)
        self.nav.currentRowChanged.connect(self.pages.setCurrentIndex)
        b_def.clicked.connect(self._defaults)
        b_ok.clicked.connect(self.accept)
        b_cancel.clicked.connect(self.reject)
        win.lookChanged.connect(self._sync_colors)
        self.nav.setCurrentRow(0)
        self._sync_all()

    # --- budowa stron ---
    @staticmethod
    def _group(title: str) -> tuple[QGroupBox, QGridLayout]:
        g = QGroupBox(title)
        gl = QGridLayout(g)
        gl.setSpacing(6)
        return g, gl

    @staticmethod
    def _page(scroll: bool = False) -> tuple[QWidget, QVBoxLayout]:
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 6 if scroll else 0, 0)
        v.setSpacing(10)
        return w, v

    @staticmethod
    def _scrolled(w: QWidget) -> QScrollArea:
        sa = QScrollArea()
        sa.setFrameShape(QFrame.Shape.NoFrame)
        sa.setWidgetResizable(True)
        sa.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        sa.setWidget(w)
        return sa

    def _cbtn(self, key: str, label: str, ui: bool = False) -> ColorButton:
        b = ColorButton(label)
        b.clicked.connect(lambda _c=False: self.pick(key, ui, label))
        (self.ui_btns if ui else self.col_btns)[key] = b
        return b

    def _page_theme(self) -> QWidget:
        w, v = self._page()
        v.addWidget(QLabel("Gotowy schemat kolorów:"))
        self.scheme_list = QListWidget()
        self.scheme_list.setIconSize(QSize(22, 16))
        for k in SCHEME_ORDER:
            self.scheme_list.addItem(QListWidgetItem(self.win._scheme_icon(k), SCHEMES[k]["name"]))
        self.scheme_list.setFixedHeight(len(SCHEME_ORDER) * 26 + 8)
        self.scheme_list.currentRowChanged.connect(self._on_scheme)
        v.addWidget(self.scheme_list)
        g, gl = self._group("Kolory interfejsu (opcjonalnie)")
        for i, (k, lab) in enumerate(UI_LABELS):
            gl.addWidget(self._cbtn(k, lab, True), i // 2, i % 2)
        v.addWidget(g)
        g, gl = self._group("Gradient (pasek, ramka, tło)")
        self.chk_grad = QCheckBox("Subtelny gradient między kolorami")
        gl.addWidget(self.chk_grad, 0, 0, 1, 2)
        for i, (k, lab) in enumerate(GRAD_LABELS):
            gl.addWidget(self._cbtn(k, lab, True), 1 + i // 2, i % 2)
        v.addWidget(g)
        self.chk_grad.toggled.connect(self._on_grad)
        b = QPushButton("Przywróć kolory schematu")
        b.clicked.connect(self.win.reset_colors)
        v.addWidget(b)
        v.addStretch(1)
        return w

    def _page_syntax(self) -> QWidget:
        w, v = self._page(scroll=True)
        g, gl = self._group("Edytor")
        gl.addWidget(self._cbtn("text", "Tekst"), 0, 0)
        gl.addWidget(self._cbtn("bg", "Tło edytora"), 0, 1)
        v.addWidget(g)
        lab = dict(COLOR_LABELS)
        for title, keys in (("Kod i wartości", ("str", "num", "com", "kw", "kw2", "const", "func", "builtin", "cls", "deco")),
                            ("HTML i zwykły tekst", ("tag", "attr", "link", "date", "mark"))):
            g, gl = self._group(title)
            for i, k in enumerate(keys):
                b = self._cbtn(k, lab[k])
                if k in SYNTAX_TIPS:
                    b.tip = SYNTAX_TIPS[k]
                gl.addWidget(b, i // 2, i % 2)
            v.addWidget(g)
        g, gl = self._group("Znaki interpunkcyjne")
        for i, (k, lab) in enumerate(PUNCT_GROUPS):
            gl.addWidget(self._cbtn(k, lab), i // 3, i % 3)
        v.addWidget(g)
        b = QPushButton("Przywróć kolory schematu")
        b.clicked.connect(self.win.reset_colors)
        v.addWidget(b)
        v.addStretch(1)
        return self._scrolled(w)

    def _page_borders(self) -> QWidget:
        w, v = self._page()
        v.addWidget(QLabel("Grubość ramki paneli (px):"))
        row = QHBoxLayout()
        row.setSpacing(4)
        self.border_grp = QButtonGroup(self)
        self.border_btns: list[QPushButton] = []
        for n in sorted(BORDERS):
            b = QPushButton("brak" if n == 0 else str(n))
            b.setCheckable(True)
            b.setFixedWidth(46)
            b.setToolTip("bez ramki" if n == 0 else f"{n} px")
            self.border_grp.addButton(b, n)
            self.border_btns.append(b)
            row.addWidget(b)
        row.addStretch(1)
        v.addLayout(row)
        self.border_grp.idClicked.connect(self._on_border)
        g, gl = self._group("Kolory ramek")
        gl.addWidget(self._cbtn("border_a", "Aktywny panel", True), 0, 0)
        gl.addWidget(self._cbtn("border", "Pozostałe panele", True), 0, 1)
        v.addWidget(g)
        b = QPushButton("Przywróć kolory ramek ze schematu")
        b.clicked.connect(self.win.reset_border_colors)
        v.addWidget(b)
        v.addStretch(1)
        return w

    def _page_font(self) -> QWidget:
        w, v = self._page()
        g, gl = self._group("Edytor (wszystkie panele)")
        self.cmb_font = QComboBox()
        self.cmb_font.addItems(FONTS)
        self.spin_size = QSpinBox()
        self.spin_size.setRange(6, 40)
        self.spin_size.setSuffix(" pt")
        self.chk_wrap = QCheckBox("Zawijanie wierszy")
        gl.addWidget(QLabel("Czcionka:"), 0, 0)
        gl.addWidget(self.cmb_font, 0, 1)
        gl.addWidget(QLabel("Rozmiar:"), 1, 0)
        gl.addWidget(self.spin_size, 1, 1)
        gl.addWidget(self.chk_wrap, 2, 0, 1, 2)
        v.addWidget(g)
        note = QLabel("Dotyczy wszystkich paneli i nowych dokumentów. Pojedynczy panel możesz zmienić w menu "
                      "Widok → Czcionka lub Ctrl+kółko myszy.")
        note.setWordWrap(True)
        v.addWidget(note)
        v.addStretch(1)
        self.cmb_font.currentTextChanged.connect(self._on_font)
        self.spin_size.valueChanged.connect(self._on_font)
        self.chk_wrap.toggled.connect(self._on_wrap)
        return w

    def _page_general(self) -> QWidget:
        w, v = self._page()
        v.addWidget(QLabel("Kolor ikony programu (gwiazda):"))
        row = QHBoxLayout()
        row.setSpacing(4)
        self.icon_grp = QButtonGroup(self)
        for i, (k, name, c) in enumerate(ICON_COLORS):
            b = QToolButton()
            b.setCheckable(True)
            b.setIcon(QIcon(star_pixmap(c, 24)))
            b.setIconSize(QSize(24, 24))
            b.setAutoRaise(True)
            b.setToolTip(name)
            self.icon_grp.addButton(b, i)
            row.addWidget(b)
        row.addStretch(1)
        v.addLayout(row)
        self.icon_grp.idClicked.connect(self._on_icon)
        self.chk_menu = QCheckBox("Pokaż pasek menu (Ctrl+M)")
        self.chk_snap = QCheckBox("Przyciąganie magnetyczne paneli (Alt = chwilowo wyłącz)")
        v.addWidget(self.chk_menu)
        v.addWidget(self.chk_snap)
        b = QPushButton("Otwórz folder z ustawieniami")
        b.clicked.connect(lambda: QDesktopServices.openUrl(QUrl.fromLocalFile(str(self.win.state_dir))))
        v.addWidget(b, 0, Qt.AlignmentFlag.AlignLeft)
        v.addStretch(1)
        self.chk_menu.toggled.connect(self._on_menu)
        self.chk_snap.toggled.connect(self._on_snap)
        return w

    def _build_preview(self) -> QWidget:
        box = QWidget()
        v = QVBoxLayout(box)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(8)
        top = QHBoxLayout()
        top.addWidget(QLabel("<b>Podgląd na żywo</b>"))
        top.addStretch(1)
        top.addWidget(QLabel("Przykład:"))
        self.cmb_sample = QComboBox()
        self.cmb_sample.addItems(["Python", "SQL", "HTML"])
        top.addWidget(self.cmb_sample)
        v.addLayout(top)
        self.pv_canvas = QFrame()
        self.pv_canvas.setObjectName("pvc")
        lay = QVBoxLayout(self.pv_canvas)
        lay.setContentsMargins(12, 12, 12, 12)
        lay.setSpacing(12)
        self.pv_a, self.pv_b = TextPane(100), TextPane(101)
        for p in (self.pv_a, self.pv_b):
            p.setMinimumHeight(110)
            p.set_border(self.win.border)
            p.set_font(self.win.font_family, self.win.font_size)
        self.pv_a.set_active(True)
        lay.addWidget(self.pv_a, 3)
        lay.addWidget(self.pv_b, 2)
        self.win.preview_panes += [self.pv_a, self.pv_b]
        n, t, sel = SAMPLES["text"]
        self.pv_b.set_demo(n, "● niezapisany · 0.4 KB", "warn", t, "text", sel)
        self._set_sample(0)
        self.cmb_sample.currentIndexChanged.connect(self._set_sample)
        v.addWidget(self.pv_canvas, 1)
        chips = QHBoxLayout()
        self.chips: list[tuple[QLabel, str]] = []
        for txt, k in (("● zapisany", "ok"), ("● niezapisany", "warn"), ("● błąd", "err"), ("● informacja", "info")):
            lb = QLabel(txt)
            chips.addWidget(lb)
            self.chips.append((lb, k))
        chips.addStretch(1)
        v.addLayout(chips)
        return box

    def _set_sample(self, idx: int):
        key = ("python", "sql", "html")[idx]
        name, text, sel = SAMPLES[key]
        self.pv_a.set_demo(name, "zapisany · 1.2 KB", "ok", text, key, sel)

    # --- synchronizacja kontrolek ---
    def _sync_colors(self):
        for k, b in self.col_btns.items():
            b.set_color(COLORS[k])
        for k, b in self.ui_btns.items():
            b.set_color(UI[k])
        self.pv_canvas.setStyleSheet(f"#pvc{{background:{grad(UI['canvas'], UI['canvas2'], True)};}}")
        sel = f"QPushButton:checked{{background:{UI['sel']};border:1px solid {UI['border_a']};font-weight:bold;}}"
        for b in self.border_btns:
            b.setStyleSheet(sel)
        for lb, k in self.chips:
            lb.setStyleSheet(f"color:{UI[k]};")

    def _sync_all(self):
        w = self.win
        self._syncing = True
        try:
            self.scheme_list.setCurrentRow(SCHEME_ORDER.index(w.scheme_key))
            self._sync_colors()
            btn = self.border_grp.button(w.border)
            if btn:
                btn.setChecked(True)
            self.cmb_font.setCurrentText(w.font_family)
            self.spin_size.setValue(int(round(w.font_size)))
            self.chk_wrap.setChecked(w.current.btn_wrap.isChecked())
            keys = [k for k, _n, _c in ICON_COLORS]
            if w.icon_key in keys:
                self.icon_grp.button(keys.index(w.icon_key)).setChecked(True)
            self.chk_menu.setChecked(w.menuBar().isVisible())
            self.chk_snap.setChecked(w.canvas.snap_on)
            self.chk_grad.setChecked(THEME["grad"])
        finally:
            self._syncing = False

    # --- reakcje (zmiany stosowane od razu) ---
    def _on_scheme(self, row: int):
        if not self._syncing and row >= 0:
            self.win.apply_scheme(SCHEME_ORDER[row])

    def _on_border(self, n: int):
        if not self._syncing:
            self.win.set_border(n)

    def _on_font(self, *_):
        if not self._syncing:
            self.win.set_default_font(self.cmb_font.currentText(), float(self.spin_size.value()))

    def _on_wrap(self, on: bool):
        if not self._syncing:
            self.win.set_wrap_all(on)

    def _on_icon(self, i: int):
        if not self._syncing:
            self.win.set_icon_color(ICON_COLORS[i][0])

    def _on_menu(self, on: bool):
        if not self._syncing:
            self.win.set_menu_visible(on)

    def _on_snap(self, on: bool):
        if not self._syncing:
            self.win.set_snap(on)

    def _on_grad(self, on: bool):
        if not self._syncing:
            self.win.set_gradient(on)

    def _defaults(self):
        self.win.reset_look_defaults()
        self._sync_all()

    def pick(self, key: str, ui: bool, label: str):
        """Wybór koloru z podglądem na żywo; Anuluj w oknie koloru przywraca poprzedni."""
        store = UI if ui else COLORS
        old = store[key]
        dlg = QColorDialog(QColor(old), self)
        dlg.setWindowTitle(f"Kolor: {label}")
        dlg.setOption(QColorDialog.ColorDialogOption.DontUseNativeDialog, True)
        dlg.currentColorChanged.connect(lambda c: self._live(key, ui, c.name()))
        ok = dlg.exec() == QDialog.DialogCode.Accepted
        final = dlg.currentColor().name() if ok else old
        dlg.deleteLater()
        self._timer.stop()
        self._pending = None
        if store[key] != final:
            self.win.set_color(key, final, ui)

    def _live(self, key: str, ui: bool, name: str):
        self._pending = (key, ui, name)
        self._timer.start()

    def _flush(self):
        if self._pending:
            (k, u, n), self._pending = self._pending, None
            self.win.set_color(k, n, u)

    def done(self, r: int):
        self._timer.stop()
        try:
            self.win.lookChanged.disconnect(self._sync_colors)
        except (RuntimeError, TypeError):
            pass
        for p in (self.pv_a, self.pv_b):
            if p in self.win.preview_panes:
                self.win.preview_panes.remove(p)
        if r == QDialog.DialogCode.Accepted:
            self.win.schedule_save()
        else:
            self.win.restore_look(self.snap)
        super().done(r)


# ---------- okno główne ----------

class MainWindow(QMainWindow):
    lookChanged = Signal()  # po zmianie kolorów / motywu (odświeża podgląd w Ustawieniach)

    def __init__(self, state_path: Path | None = None):
        super().__init__()
        self.setWindowTitle(APP_NAME)
        self.state_path = state_path or self._default_state_path()
        self.state_dir = self.state_path.parent
        TextPane.img_dir = self.state_dir / "obrazy"
        HIST["dir"] = self.state_dir / "historia"
        self._ready = False
        self._app_css = ""
        self._xfers: list = []
        self.reminders: list[dict] = []
        self._rem_timer = QTimer(self, interval=20_000)
        self._rem_timer.timeout.connect(self.check_reminders)
        self._last_json = ""
        self._pending: list[tuple[TextPane, dict]] = []
        self._args: list[str] = []
        self.border = DEFAULT_BORDER
        self.scheme_key = DEFAULT_SCHEME
        self.ui_over: dict[str, str] = {}
        self.icon_key = "sealime"
        self.font_family, self.font_size = "Consolas", 10.0
        self.recent: list[str] = []
        self.preview_panes: list[TextPane] = []  # panele podglądu w oknie Ustawienia
        self.canvas = Canvas([TextPane(i) for i in range(DEFAULT_PANES)])
        self.panes = self.canvas.panes
        self.current: TextPane = self.panes[0]
        self.setCentralWidget(self.canvas)
        for p in self.panes:
            self._wire(p)
        self._save_timer = QTimer(self, singleShot=True, interval=500)
        self._save_timer.timeout.connect(self.save_state)
        self.canvas.layoutChanged.connect(self.schedule_save)
        self._build_menu()
        for i in range(MAX_PANES):
            QShortcut(QKeySequence(f"Alt+{i + 1}"), self,
                      activated=lambda i=i: self.panes[i].focus_editor() if i < len(self.panes) else None)
        self.resize(1500, 900)
        self.apply_scheme(DEFAULT_SCHEME, save=False)
        self.load_state()
        self.set_icon_color(self.icon_key)
        self.set_current(self.current)
        QApplication.instance().aboutToQuit.connect(self.save_state)  # stan zapisuje się po każdej zmianie (schedule_save)
        self._alt_clean = False
        QApplication.instance().installEventFilter(self)

    @staticmethod
    def _default_state_path() -> Path:
        base = QStandardPaths.writableLocation(QStandardPaths.StandardLocation.AppConfigLocation)
        return Path(base) / "state.json"

    def _log(self, msg: str):
        try:
            lp = self.state_path.with_name("startupboard.log")
            if lp.exists() and lp.stat().st_size > 200_000:
                lp.unlink()
            with open(lp, "a", encoding="utf-8") as f:
                f.write(time.strftime("%Y-%m-%d %H:%M:%S ") + msg + "\n")
        except OSError:
            pass

    def _wire(self, p: TextPane):
        p.activated.connect(self.set_current)
        p.removeRequested.connect(self.remove_pane)
        p.openFromFolder.connect(self.open_from_folder)
        p.remindersRequested.connect(self.show_reminders)
        p.remindersChanged.connect(self.on_reminders_changed)
        p.transferRequested.connect(self.transfer_files)
        p.menuRequested.connect(self.show_popup)
        p.pathChanged.connect(self.note_recent)

    # --- menu ---
    def _act(self, text, slot, shortcut=None, checkable=False) -> QAction:
        a = QAction(text, self)
        a.setCheckable(checkable)
        if shortcut:
            a.setShortcut(QKeySequence(shortcut))
        a.triggered.connect(lambda *_: slot())
        self.addAction(a)  # skróty działają także po ukryciu paska menu
        return a

    def _radio(self, menu, items, slot, icons=None) -> dict:
        grp, acts = QActionGroup(self), {}
        for key, label in items:
            a = QAction(label, self, checkable=True)
            if icons:
                a.setIcon(icons[key])
            a.triggered.connect(lambda _c=False, k=key: slot(k))
            grp.addAction(a)
            menu.addAction(a)
            acts[key] = a
        self._groups = getattr(self, "_groups", []) + [grp]
        return acts

    def _build_menu(self):
        mb = self.menuBar()
        m = mb.addMenu("&Plik")
        m.addAction(self._act("Nowy plik tekstowy", self.new_document, "Ctrl+N"))
        m.addAction(self._act("Otwórz w aktywnym panelu…", lambda: self.current.ask_open(), "Ctrl+O"))
        m.addAction(self._act("Otwórz folder w panelu…", self.open_folder_dialog, "Ctrl+Shift+O"))
        m.addAction(self._act("Panel przypomnień", lambda: self.show_reminders(), "Ctrl+Shift+R"))
        m.addAction(self._act("Nowe przypomnienie…", self.quick_reminder, "Ctrl+Alt+N"))
        self.m_recent = m.addMenu("Ostatnie pliki")
        self.m_recent.aboutToShow.connect(self._fill_recent)
        m.addSeparator()
        self.act_save = self._act("Zapisz", lambda: self.current.save(), "Ctrl+S")
        self.act_saveas = self._act("Zapisz jako…", lambda: self.current.save_as(), "Ctrl+Shift+S")
        m.addAction(self.act_save)
        m.addAction(self.act_saveas)
        self.act_auto = self._act("Autozapis (2 s po ostatniej zmianie)",
                                  lambda: self.set_autosave(self.act_auto.isChecked()), checkable=True)
        self.act_auto.setChecked(True)
        m.addAction(self.act_auto)
        self.act_hist = self._act("Historia wersji pliku…", self.show_history, "Ctrl+Alt+H")
        m.addAction(self.act_hist)
        m.addSeparator()
        m.addAction(self._act("Wklej do pustego panelu (tekst, obraz lub plik)", self.paste_smart, "Ctrl+V"))
        m.addAction(self._act("Wklej obraz ze schowka", self.paste_image, "Ctrl+Shift+V"))
        m.addAction(self._act("Otwórz obraz z pliku…", self.open_image_file))
        self.act_saveimg = self._act("Zapisz obraz jako…", lambda: self.current.save_image_as())
        m.addAction(self.act_saveimg)
        m.addSeparator()
        m.addAction(self._act("Zamknij plik w panelu", lambda: self.current.close_file(), "Ctrl+W"))
        m.addSeparator()
        m.addAction(self._act("Zakończ", self.close, "Ctrl+Q"))

        ed = mb.addMenu("&Edycja")
        self.act_find = self._act("Znajdź…", lambda: self.current.show_find(), "Ctrl+F")
        ed.addAction(self.act_find)
        ed.addAction(self._act("Znajdź następny", lambda: self.find_again(False), "F3"))
        ed.addAction(self._act("Znajdź poprzedni", lambda: self.find_again(True), "Shift+F3"))

        v = mb.addMenu("&Widok")
        v.addAction(self._act("Ustawienia…", self.show_settings, "Ctrl+,"))
        v.addSeparator()
        self.scheme_acts = self._radio(
            v.addMenu("Schemat kolorów"), [(k, SCHEMES[k]["name"]) for k in SCHEME_ORDER], self.apply_scheme,
            icons={k: self._scheme_icon(k) for k in SCHEME_ORDER})
        self.font_acts = self._radio(v.addMenu("Czcionka (aktywny panel)"), [(f, f) for f in FONTS],
                                     lambda k: self.current.set_font(k))
        self.lang_acts = self._radio(v.addMenu("Składnia (aktywny panel)"), LANGS,
                                     lambda k: self.current.set_lang(k))
        self.act_wrap = self._act("Zawijanie wierszy (aktywny panel)", lambda: self.current.btn_wrap.toggle(),
                                  "Ctrl+Shift+W", checkable=True)
        v.addAction(self.act_wrap)
        v.addSeparator()
        self.act_menu = self._act("Pokaż pasek menu", lambda: self.set_menu_visible(not self.menuBar().isVisible()),
                                  "Ctrl+M", checkable=True)
        v.addAction(self.act_menu)

        self.m_layout = mb.addMenu("&Układ")
        self.act_add = self._act(f"Dodaj panel (maks. {MAX_PANES})", self.add_pane, "Ctrl+Shift+N")
        self.act_del = self._act("Usuń aktywny panel (zwalnia pamięć)", self.remove_pane, "Ctrl+Shift+D")
        self.m_layout.addAction(self.act_add)
        self.m_layout.addAction(self.act_del)
        self.m_layout.addSeparator()
        self.m_layout.addAction(self._act("Siatka (reset układu)", self.canvas.grid, "Ctrl+Shift+E"))
        self.act_snap = self._act("Przyciąganie magnetyczne (Alt = chwilowo wyłącz)",
                                  lambda: self.set_snap(self.act_snap.isChecked()), checkable=True)
        self.act_snap.setChecked(True)
        self.m_layout.addAction(self.act_snap)

        self.m_sets = mb.addMenu("&Zestawy")
        self.m_sets.aboutToShow.connect(self._fill_sets)

        hp = mb.addMenu("Po&moc")
        hp.addAction(self._act("Folder z ustawieniami", lambda: QDesktopServices.openUrl(
            QUrl.fromLocalFile(str(self.state_dir)))))
        hp.addAction(self._act("Sugestie…", self.show_suggestions))
        hp.addAction(self._act("O autorze", self.show_about))
        # to samo menu jako wyskakujące (przycisk ☰ / prawy klik na pasku panelu), działa przy ukrytym pasku
        self.popup = QMenu(self)
        for menu in (m, ed, v, self.m_layout, self.m_sets, hp):
            menu.aboutToShow.connect(self._sync_menu)
            self.popup.addMenu(menu)

    @staticmethod
    def _scheme_icon(key: str) -> QIcon:
        c, u = SCHEMES[key]["colors"], SCHEMES[key]["ui"]
        pm = QPixmap(22, 16)
        pm.fill(QColor(c["bg"]))
        p = QPainter(pm)
        for i, k in enumerate(("kw", "str", "num", "func")):
            p.fillRect(2 + i * 5, 4, 4, 8, QColor(c[k]))
        g = QLinearGradient(0, 0, 22, 0)
        g.setColorAt(0, QColor(u["border_a"]))
        g.setColorAt(1, QColor(u["border_a2"]))
        p.setPen(QPen(QBrush(g), 1))
        p.drawRect(0, 0, 21, 15)
        p.end()
        return QIcon(pm)

    # --- kolory, motyw, wygląd ---
    def set_color(self, key: str, value: str, ui: bool = False):
        if ui:
            UI[key] = value
            if value == SCHEMES[self.scheme_key]["ui"].get(key):
                self.ui_over.pop(key, None)
            else:
                self.ui_over[key] = value
        else:
            COLORS[key] = value
        self.apply_look()

    def reset_border_colors(self):
        for k in ("border", "border_a", "border2", "border_a2"):
            UI[k] = SCHEMES[self.scheme_key]["ui"][k]
            self.ui_over.pop(k, None)
        self.apply_look()

    def reset_colors(self):
        self.apply_scheme(self.scheme_key)

    def apply_scheme(self, key: str, save: bool = True):
        if key not in SCHEMES:
            key = DEFAULT_SCHEME
        self.scheme_key, self.ui_over = key, {}
        COLORS.clear()
        COLORS.update(SCHEMES[key]["colors"])
        UI.clear()
        UI.update(SCHEMES[key]["ui"])
        self.apply_look(save)

    def apply_look(self, save: bool = True):
        """Zastosuj COLORS/UI: paleta Qt, tło, panele (także podglądu), ramki, pasek tytułu."""
        refresh_colors()
        THEME["dark"] = SCHEMES[self.scheme_key]["dark"]
        app = QApplication.instance()
        if app.style().objectName().lower() != "fusion":
            app.setStyle("Fusion")
        app.setPalette(make_palette(THEME["dark"]))
        self.canvas.set_bg(UI["canvas"], UI["canvas2"])
        css = app_css()
        if css != self._app_css:  # globalny arkusz zmieniamy tylko gdy naprawdę się zmienił
            self._app_css = css
            app.setStyleSheet(css)
        for p in self.panes + self.preview_panes:
            p.apply_colors()
        self._dark_titlebar()
        self.lookChanged.emit()
        if save:
            self.schedule_save()

    def snapshot_look(self) -> dict:
        """Migawka wyglądu (do cofnięcia przez Anuluj w Ustawieniach)."""
        return {"scheme": self.scheme_key, "colors": dict(COLORS), "ui": dict(UI), "ui_over": dict(self.ui_over),
                "border": self.border, "icon": self.icon_key, "menu": self.menuBar().isVisible(),
                "grad": THEME["grad"], "snap": self.canvas.snap_on, "font": (self.font_family, self.font_size),
                "panes": [(p.family, p.editor.font().pointSizeF(), p.btn_wrap.isChecked()) for p in self.panes]}

    def restore_look(self, s: dict):
        self.scheme_key = s["scheme"]
        COLORS.clear()
        COLORS.update(s["colors"])
        UI.clear()
        UI.update(s["ui"])
        self.ui_over = dict(s["ui_over"])
        THEME["grad"] = s["grad"]
        self.set_border(s["border"])
        self.set_icon_color(s["icon"])
        self.set_menu_visible(s["menu"])
        self.set_snap(s["snap"])
        self.font_family, self.font_size = s["font"]
        if len(s["panes"]) == len(self.panes):
            for p, (fam, sz, wrap) in zip(self.panes, s["panes"]):
                p.set_font(fam, sz)
                p.btn_wrap.setChecked(wrap)
        self.apply_look()

    def reset_look_defaults(self):
        self.apply_scheme(DEFAULT_SCHEME, save=False)
        self.set_border(DEFAULT_BORDER)
        self.set_icon_color("sealime")
        self.set_gradient(True)
        self.set_menu_visible(True)
        self.set_snap(True)
        self.set_default_font("Consolas", 10.0)
        self.set_wrap_all(True)
        self.schedule_save()

    def _dark_titlebar(self):
        """Windows 10/11: ciemny lub jasny pasek tytułu okna zgodnie ze schematem."""
        set_titlebar_dark(self, THEME["dark"])

    def showEvent(self, e):
        super().showEvent(e)
        self._dark_titlebar()

    def _sync_menu(self):
        c = self.current
        if c.family in self.font_acts:
            self.font_acts[c.family].setChecked(True)
        self.lang_acts[c.lang].setChecked(True)
        self.scheme_acts[self.scheme_key].setChecked(True)
        self.act_wrap.setChecked(c.btn_wrap.isChecked())
        self.act_menu.setChecked(self.menuBar().isVisible())
        self.act_snap.setChecked(self.canvas.snap_on)
        self.act_add.setEnabled(len(self.panes) < MAX_PANES)
        self.act_del.setEnabled(len(self.panes) > 1)
        text_ok = c.can_find()
        self.act_find.setEnabled(text_ok)
        self.act_save.setEnabled(c.kind == "text" and c.stack.currentIndex() == c.ED)
        self.act_saveas.setEnabled(text_ok)
        self.act_hist.setEnabled(text_ok and bool(c.path) and not c.untitled)
        self.act_auto.setChecked(AUTO["on"])
        self.act_saveimg.setEnabled(c.kind == "image")

    def show_popup(self, pos: QPoint):
        self._sync_menu()
        self.popup.exec(pos)

    def eventFilter(self, obj, ev):
        """Stuknięcie samego Alt pokazuje ukryty pasek menu."""
        t = ev.type()
        if t in (QEvent.Type.KeyRelease, QEvent.Type.MouseButtonRelease, QEvent.Type.Wheel):
            self.schedule_save()
        if t == QEvent.Type.ShortcutOverride:  # Alt+cyfra (skrót) nie liczy się jako stuknięcie Alt
            if ev.key() != Qt.Key.Key_Alt:
                self._alt_clean = False
        elif t == QEvent.Type.KeyPress:
            self._alt_clean = ev.key() == Qt.Key.Key_Alt and not ev.isAutoRepeat()
        elif t == QEvent.Type.KeyRelease and ev.key() == Qt.Key.Key_Alt:
            if self._alt_clean and self.isActiveWindow() and not self.menuBar().isVisible():
                self.set_menu_visible(True)
            self._alt_clean = False
        return False

    # --- okna dialogowe ---
    def show_settings(self):
        d = SettingsDialog(self)
        d.exec()
        d.deleteLater()

    def show_about(self):
        col = dict((k, c) for k, _n, c in ICON_COLORS)[self.icon_key]
        d = ThemedDialog(self)
        d.setWindowTitle("O autorze")
        d.setFixedWidth(320)
        lay = QVBoxLayout(d)
        lay.setContentsMargins(24, 20, 24, 16)
        lay.setSpacing(6)
        center = Qt.AlignmentFlag.AlignCenter
        ic = QLabel()
        ic.setPixmap(star_pixmap(col, 64))
        ic.setAlignment(center)
        title = QLabel(f"<span style='font-size:16pt;font-weight:600'>{APP_NAME}</span>")
        ver = QLabel(f"Wersja {APP_VERSION}")
        author = QLabel(f"Autor: {APP_AUTHOR}")
        contact = QLabel(f"Kontakt: <a href='mailto:{APP_CONTACT}'>{APP_CONTACT}</a>")
        contact.setOpenExternalLinks(True)
        for w in (title, ver, author, contact):
            w.setAlignment(center)
        ok = QPushButton("OK")
        ok.setDefault(True)
        ok.clicked.connect(d.accept)
        sug = QPushButton("Sugestie…")
        want: list[int] = []
        sug.clicked.connect(lambda: want.append(1))
        sug.clicked.connect(d.accept)
        for w in (ic, title, ver, author, contact):
            lay.addWidget(w)
        lay.addSpacing(8)
        row = QHBoxLayout()
        row.addStretch(1)
        row.addWidget(sug)
        row.addWidget(ok)
        row.addStretch(1)
        lay.addLayout(row)
        d.exec()
        d.deleteLater()
        if want:
            self.show_suggestions()

    def show_suggestions(self):
        d = ThemedDialog(self)
        d.setWindowTitle("Sugestie")
        d.resize(480, 320)
        lay = QVBoxLayout(d)
        lay.addWidget(QLabel("Co sprawiłoby, że ta aplikacja byłaby jeszcze lepsza?"))
        box = QPlainTextEdit()
        lay.addWidget(box, 1)
        info = QLabel("")
        info.setWordWrap(True)
        lay.addWidget(info)
        row = QHBoxLayout()
        send, copy, close = QPushButton(f"Wyślij e-mailem ({APP_CONTACT})"), QPushButton("Kopiuj"), QPushButton("Zamknij")
        for b in (send, copy):
            row.addWidget(b)
        row.addStretch(1)
        row.addWidget(close)
        lay.addLayout(row)

        def mailto(text: str) -> QUrl:
            enc = lambda t: bytes(QUrl.toPercentEncoding(t)).decode()
            return QUrl(f"mailto:{APP_CONTACT}?subject={enc(f'{APP_NAME} {APP_VERSION} - sugestia')}&body={enc(text)}")

        def do_send():
            txt = box.toPlainText().strip()
            if not txt:
                info.setText("Wpisz najpierw sugestię.")
                return
            QApplication.clipboard().setText(txt)
            QDesktopServices.openUrl(mailto(txt))
            info.setText("Otwieram program pocztowy. Treść jest też w schowku (Ctrl+V), gdyby się nie wkleiła.")

        def do_copy():
            QApplication.clipboard().setText(box.toPlainText())
            info.setText("Skopiowano do schowka.")

        send.clicked.connect(do_send)
        copy.clicked.connect(do_copy)
        close.clicked.connect(d.accept)
        d.exec()
        d.deleteLater()

    # --- ustawienia widoku ---
    def set_menu_visible(self, on: bool):
        self.menuBar().setVisible(on)
        self.act_menu.setChecked(on)
        self.schedule_save()

    def set_border(self, n: int):
        self.border = n
        for p in self.panes + self.preview_panes:
            p.set_border(n)
        self.schedule_save()

    def set_gradient(self, on: bool):
        THEME["grad"] = bool(on)
        self.apply_look()

    def set_autosave(self, on: bool):
        AUTO["on"] = bool(on)
        self.act_auto.setChecked(bool(on))
        if on:
            for p in self.panes:  # zmiany, które czekały na ręczny zapis, zapisz od razu
                p.autosave()
        self.schedule_save()

    def show_history(self):
        """Kopie aktywnego pliku (ostatnie HIST['keep']) z podglądem i przywracaniem."""
        c = self.current
        if c.kind != "text" or not c.path or c.untitled:
            return
        path = c.path
        d = ThemedDialog(self)
        d.setWindowTitle(f"Historia wersji – {Path(path).name}")
        d.resize(760, 460)
        lay = QVBoxLayout(d)
        info = QLabel(f"Ostatnie {HIST['keep']} wersji pliku. Kopia powstaje przed nadpisaniem (co ≥ 2 min pracy "
                      f"oraz zawsze po zmianie pliku poza programem). Przywrócenie można cofnąć (Ctrl+Z).")
        info.setWordWrap(True)
        lay.addWidget(info)
        row = QHBoxLayout()
        lst = QListWidget()
        lst.setFixedWidth(230)
        prev = QPlainTextEdit()
        prev.setReadOnly(True)
        prev.setLineWrapMode(QPlainTextEdit.LineWrapMode.WidgetWidth)
        prev.setFont(c.editor.font())
        row.addWidget(lst)
        row.addWidget(prev, 1)
        lay.addLayout(row, 1)
        btns = QHBoxLayout()
        b_res = QPushButton("Przywróć tę wersję")
        b_dir = QPushButton("Otwórz folder kopii")
        b_close = QPushButton("Zamknij")
        for b in (b_res, b_dir):
            btns.addWidget(b)
        btns.addStretch(1)
        btns.addWidget(b_close)
        lay.addLayout(btns)
        files = hist_list(path)
        for f in files:
            lst.addItem(f"{time.strftime('%d.%m.%Y %H:%M:%S', time.localtime(f.stat().st_mtime))} · {human_size(f.stat().st_size)}")
        if not files:
            lst.addItem("(brak kopii – powstaną przy kolejnym zapisie)")
        b_res.setEnabled(False)

        def show(i: int):
            ok = 0 <= i < len(files)
            b_res.setEnabled(ok)
            prev.setPlainText(decode_bytes(files[i].read_bytes())[0] if ok else "")
        lst.currentRowChanged.connect(show)

        def restore():
            i = lst.currentRow()
            if not 0 <= i < len(files) or c.path != path or c.kind != "text":
                return
            hist_push(path, c._data())  # obecny stan też zostaje w historii
            text = decode_bytes(files[i].read_bytes())[0].replace("\r\n", "\n").replace("\r", "\n")
            cur = c.editor.textCursor()
            cur.beginEditBlock()
            cur.select(QTextCursor.SelectionType.Document)
            cur.insertText(text)
            cur.endEditBlock()
            c.editor.document().setModified(True)  # zapis: autozapis za 2 s albo Ctrl+S
            c._on_edit()
            d.accept()
        b_res.clicked.connect(restore)
        b_dir.clicked.connect(lambda: (hist_dir(path).mkdir(parents=True, exist_ok=True),
                                       QDesktopServices.openUrl(QUrl.fromLocalFile(str(hist_dir(path))))))
        b_close.clicked.connect(d.reject)
        if files:
            lst.setCurrentRow(0)
        d.exec()
        d.deleteLater()

    def set_snap(self, on: bool):
        self.canvas.snap_on = bool(on)
        self.act_snap.setChecked(bool(on))
        self.schedule_save()

    def set_icon_color(self, key: str):
        cols = {k: c for k, _n, c in ICON_COLORS}
        if key not in cols:
            key = "sealime"
        self.icon_key = key
        ic = star_icon(cols[key])
        self.setWindowIcon(ic)
        QApplication.instance().setWindowIcon(ic)
        self.schedule_save()

    def set_default_font(self, family: str, size: float):
        self.font_family, self.font_size = family, size
        for p in self.panes + self.preview_panes:
            p.set_font(family, size)
        self.schedule_save()

    def set_wrap_all(self, on: bool):
        for p in self.panes + self.preview_panes:
            p.btn_wrap.setChecked(on)
        self.schedule_save()

    def set_current(self, pane: TextPane):
        self.current = pane
        for p in self.panes:
            p.set_active(p is pane)

    # --- dodawanie / usuwanie paneli ---
    def _new_pane(self) -> TextPane:
        p = TextPane(len(self.panes))
        self._wire(p)
        p.set_border(self.border)
        p.set_font(self.font_family, self.font_size)
        self.canvas.add_pane(p)
        return p

    def add_pane(self):
        if len(self.panes) >= MAX_PANES:
            QMessageBox.information(self, APP_NAME, f"Maksymalnie {MAX_PANES} paneli.")
            return
        p = self._new_pane()
        self.set_current(p)
        p.focus_editor()

    def remove_pane(self, p=None):
        if len(self.panes) <= 1:
            return
        p = p if isinstance(p, TextPane) else self.current
        if not p.confirm_close():
            return
        idx = self.panes.index(p)
        was_current = p is self.current
        self.canvas.remove_pane(p)
        if was_current:
            self.set_current(self.panes[min(idx, len(self.panes) - 1)])

    def _set_pane_count(self, n: int):
        while len(self.panes) < n:
            self._new_pane()
        while len(self.panes) > n:
            self.canvas.remove_pane(self.panes[-1])

    # --- nowy plik, obrazy, szukanie, ostatnie pliki ---
    def target_pane(self) -> TextPane:
        """Panel na nową zawartość: aktywny, jeśli pusty; inaczej pierwszy pusty; inaczej nowy; inaczej aktywny."""
        if self.current.is_empty():
            return self.current
        for p in self.panes:
            if p.is_empty():
                return p
        if len(self.panes) < MAX_PANES:
            return self._new_pane()
        return self.current

    def _focus(self, p: TextPane):
        self.set_current(p)
        p.focus_editor()

    def new_document(self):
        p = self.target_pane()
        if p.new_document():
            self._focus(p)

    def paste_smart(self):
        """Ctrl+V poza edytorem: do pustego panelu wkleja skopiowany plik, tekst albo obraz (w tej kolejności)."""
        fw = QApplication.focusWidget()
        if isinstance(fw, QPlainTextEdit) and not fw.isReadOnly():  # wywołane z menu przy aktywnym edytorze
            fw.paste()
            return
        md = QApplication.clipboard().mimeData()
        if md is None:
            self.current.flash("Schowek jest pusty")
            return
        files = [f for f in (u.toLocalFile() for u in md.urls() if u.isLocalFile())] if md.hasUrls() else []
        files = [f for f in files if Path(f).exists()][:MAX_PANES]
        if files:
            last = None
            for f in files:
                p = self.target_pane()
                if p.open_file(f, ask=not p.is_empty()):
                    last = p
            if last is not None:
                self._focus(last)
            return
        if md.hasText() and md.text().strip():
            p = self.target_pane()
            if p.new_document(md.text(), modified=True, ask=not p.is_empty()):
                self._focus(p)
            return
        if clipboard_image_source() is not None:
            self.paste_image()
            return
        self.current.flash("Schowek jest pusty")

    def paste_image(self):
        if clipboard_image_source() is None:
            self.current.flash("Schowek nie zawiera obrazu")
            return
        p = self.target_pane()
        if p.paste_image():
            self._focus(p)

    # --- przypomnienia ---
    def show_reminders(self, pane: TextPane | None = None):
        """Otwiera panel przypomnień (jeden na okno): w pustym panelu albo przechodzi do już otwartego."""
        for q in self.panes:
            if q.kind == "reminders":
                self._focus(q)
                return
        p = pane if (pane is not None and pane.is_empty()) else self.target_pane()
        if p.open_reminders(self.reminders):
            self._focus(p)

    def quick_reminder(self):
        """Okno dodawania przypomnienia z dowolnego miejsca (bez otwierania panelu)."""
        d = ReminderDialog(self, None, REM_COLORS[len(self.reminders) % len(REM_COLORS)])
        if d.exec() == QDialog.DialogCode.Accepted:
            self.reminders.append(d.result_item(None))
            self.on_reminders_changed()
            for q in self.panes:
                if q.rv:
                    q.rv.refresh()
                    q.refresh_header()

    def on_reminders_changed(self):
        self.schedule_save()

    def check_reminders(self):
        now = datetime.now()
        for it in list(self.reminders):
            if it.get("done") or it.get("notified"):
                continue
            if datetime.fromisoformat(it["dt"]) <= now:
                it["notified"] = True
                self._remind_popup(it)
        for q in self.panes:
            if q.rv:
                q.rv.refresh()
        self.schedule_save()

    def _remind_popup(self, it: dict):
        box = QMessageBox(QMessageBox.Icon.Information, "⏰ Przypomnienie",
                          f"{it['text']}\n{rem_when_text(datetime.fromisoformat(it['dt']))}", parent=self)
        done = box.addButton("Gotowe", QMessageBox.ButtonRole.AcceptRole)
        later = box.addButton("Za 10 minut", QMessageBox.ButtonRole.ActionRole)
        box.addButton("Zamknij", QMessageBox.ButtonRole.RejectRole)
        box.setWindowModality(Qt.WindowModality.NonModal)
        box.setStyleSheet(f"QMessageBox{{border-left:6px solid {it['color']};}}")

        def clicked(b):
            if b is done:
                it["done"] = True
            elif b is later:
                it["dt"] = (datetime.now() + timedelta(minutes=10)).isoformat(timespec="minutes")
                it["notified"] = False
            for q in self.panes:
                if q.rv:
                    q.rv.refresh()
                    q.refresh_header()
            self.schedule_save()
        box.buttonClicked.connect(clicked)
        self._popups = [x for x in getattr(self, "_popups", []) if x.isVisible()] + [box]
        box.show()
        QApplication.alert(self, 0)

    def open_folder_dialog(self):
        p = self.target_pane()
        p.ask_open_dir()
        if not p.is_empty():
            self._focus(p)

    def open_from_folder(self, src: TextPane, path: str):
        """Plik wybrany w panelu folderu otwiera się w wolnym panelu (folder zostaje na miejscu)."""
        p = self.target_pane()
        if p is src:
            src.note("Brak wolnego panelu")
            return
        if p.open_file(path, ask=not p.is_empty()):
            self._focus(p)

    def transfer_files(self, src: TextPane, paths: list, move: bool):
        """F5 / F6: kopiuj / przenieś do drugiego panelu folderu (najświeższego innego), inaczej wybierz folder."""
        others = [q for q in reversed(self.canvas.order) if q is not src and q.kind == "folder" and q.fv]
        dest = others[0].fv.root if others else QFileDialog.getExistingDirectory(self, "Folder docelowy", src.fv.root)
        if not dest:
            return
        verb = "Przenieść" if move else "Kopiować"
        what = f"„{Path(paths[0]).name}”" if len(paths) == 1 else f"{len(paths)} elementów"
        clash = [x for x in paths if (Path(dest) / Path(x).name).exists()]
        box = QMessageBox(QMessageBox.Icon.Question, verb, f"{verb} {what} do:\n{dest}", parent=self)
        yes = box.addButton("Tak", QMessageBox.ButtonRole.YesRole)
        box.addButton("Anuluj", QMessageBox.ButtonRole.RejectRole)
        if clash:
            box.setInformativeText(f"{len(clash)} z nich już istnieje w folderze docelowym.")
            skip = box.addButton("Pomiń istniejące", QMessageBox.ButtonRole.NoRole)
            yes.setText("Nadpisz istniejące")
        box.exec()
        b = box.clickedButton()
        if b is not yes and not (clash and b is skip):
            return
        th = _Xfer(paths, dest, move, overwrite=b is yes)
        self._xfers.append(th)

        def done(n, err):
            self._xfers.remove(th)
            th.deleteLater()
            src.note((f"{'przeniesiono' if move else 'skopiowano'}: {n}") + (f" · ⚠ {err}" if err else ""), 6000)
        th.finished_n.connect(done)
        th.start()

    def open_image_file(self):
        p = self.target_pane()
        p.ask_open_image()
        if not p.is_empty():
            self._focus(p)

    def find_again(self, backwards: bool):
        c = self.current
        if c.find_edit.text():
            c.find_next(backwards)
        else:
            c.show_find()

    def note_recent(self, path: str):
        norm = os.path.normpath(path)
        self.recent = [norm] + [r for r in self.recent if os.path.normcase(r) != os.path.normcase(norm)]
        del self.recent[10:]
        self.schedule_save()

    def _fill_recent(self):
        m = self.m_recent
        m.clear()
        if not self.recent:
            m.addAction("(brak)").setEnabled(False)
            return
        for i, r in enumerate(self.recent):
            a = m.addAction(f"{i + 1}.  {Path(r).name}".replace("&", "&&"))
            a.setToolTip(r)
            a.triggered.connect(lambda _c=False, path=r: self.open_recent(path))
        m.addSeparator()
        m.addAction("Wyczyść listę").triggered.connect(lambda _c=False: self._clear_recent())

    def _clear_recent(self):
        self.recent = []
        self.schedule_save()

    def open_recent(self, path: str):
        p = self.target_pane()
        if p.open_file(path):
            self._focus(p)

    # --- zestawy (nazwane układy z otwartymi plikami) ---
    @property
    def sets_dir(self) -> Path:
        return self.state_dir / "zestawy"

    def list_sets(self) -> list[tuple[str, Path]]:
        out = []
        for f in sorted(self.sets_dir.glob("*.json"), key=lambda x: x.stem.lower()) if self.sets_dir.is_dir() else []:
            try:
                out.append((str(json.loads(f.read_text(encoding="utf-8")).get("name") or f.stem), f))
            except Exception:
                out.append((f.stem, f))
        return out

    def _fill_sets(self):
        m = self.m_sets
        m.clear()
        m.addAction("Zapisz bieżący układ jako zestaw…").triggered.connect(lambda _c=False: self.save_set())
        m.addSeparator()
        sets = self.list_sets()
        if not sets:
            m.addAction("(brak zapisanych zestawów)").setEnabled(False)
        for name, path in sets:
            m.addAction(name.replace("&", "&&")).triggered.connect(lambda _c=False, f=path: self.load_set(f))
        m.addSeparator()
        dm = m.addMenu("Usuń zestaw")
        dm.setEnabled(bool(sets))
        for name, path in sets:
            dm.addAction(name.replace("&", "&&")).triggered.connect(lambda _c=False, f=path, n=name: self.delete_set(f, n))

    def save_set(self):
        name, ok = QInputDialog.getText(self, "Zapisz zestaw", "Nazwa zestawu (układ paneli + otwarte pliki):")
        name = name.strip()
        if not ok or not name:
            return
        fn = re.sub(r'[\\/:*?"<>|]', "_", name)[:60].strip(" .") or "zestaw"
        path = self.sets_dir / f"{fn}.json"
        if path.exists() and QMessageBox.question(
                self, APP_NAME, f"Zestaw „{name}” już istnieje. Nadpisać?") != QMessageBox.StandardButton.Yes:
            return
        try:
            self.sets_dir.mkdir(parents=True, exist_ok=True)
            data = self.snapshot()
            data.update({"name": name, "version": STATE_VERSION})
            atomic_write(path, json.dumps(data, ensure_ascii=False, indent=1).encode())
        except Exception as ex:
            self._log(f"save_set: {ex!r}")
            QMessageBox.warning(self, APP_NAME, f"Nie można zapisać zestawu:\n{ex}")

    def load_set(self, path: Path):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            sts = [s for s in data["panes"] if isinstance(s, dict)]
            if not sts:
                raise ValueError("pusty zestaw")
        except Exception as ex:
            QMessageBox.warning(self, APP_NAME, f"Nie można wczytać zestawu:\n{ex}")
            return
        for p in self.panes:
            if not p.confirm_close():
                return
        for p in self.panes:
            p.clear_content()
        self._set_pane_count(max(1, min(len(sts), MAX_PANES)))
        self._apply_layout(data)
        for p, st in zip(self.panes, sts):
            self._open_state(p, st)
        idx = data.get("current", 0)
        self.set_current(self.panes[idx] if isinstance(idx, int) and 0 <= idx < len(self.panes) else self.panes[0])
        self.schedule_save()

    def delete_set(self, path: Path, name: str):
        if QMessageBox.question(self, APP_NAME, f"Usunąć zestaw „{name}”?") == QMessageBox.StandardButton.Yes:
            try:
                path.unlink()
            except OSError as ex:
                QMessageBox.warning(self, APP_NAME, f"Nie można usunąć:\n{ex}")

    # --- stan ---
    def schedule_save(self):
        if self._ready:
            self._save_timer.start()

    def moveEvent(self, e):
        super().moveEvent(e)
        self.schedule_save()

    def resizeEvent(self, e):
        super().resizeEvent(e)
        self.schedule_save()

    def snapshot(self) -> dict:
        """Układ + zawartość paneli (do stanu programu i do zestawów)."""
        return {
            "rects": [[r.x(), r.y(), r.width(), r.height()] for r in (self.canvas.rel[p] for p in self.panes)],
            "z": [p.index for p in self.canvas.order],
            "current": self.current.index,
            "panes": [p.state() for p in self.panes],
        }

    def save_state(self):
        if not self._ready:
            return
        try:
            data = {
                "version": STATE_VERSION,
                "geometry": base64.b64encode(bytes(self.saveGeometry())).decode(),
                "border": self.border, "snap": self.canvas.snap_on, "icon": self.icon_key,
                "scheme": self.scheme_key, "look_v": LOOK_VERSION, "grad": THEME["grad"],
                "colors": {k: v for k, v in COLORS.items() if v != SCHEMES[self.scheme_key]["colors"].get(k)},
                "ui_over": dict(self.ui_over),
                "menu": self.menuBar().isVisible(),
                "font_default": [self.font_family, self.font_size],
                "recent": self.recent, "last_dir": LAST["dir"], "reminders": self.reminders,
                "autosave": AUTO["on"],
            }
            data.update(self.snapshot())
            js = json.dumps(data, ensure_ascii=False, indent=1)
            if js == self._last_json:  # nic się nie zmieniło - nie ruszaj dysku
                return
            self.state_path.parent.mkdir(parents=True, exist_ok=True)
            atomic_write(self.state_path, js.encode())
            self._last_json = js
        except Exception as ex:  # zapis stanu nigdy nie może zawiesić programu
            self._log(f"save_state: {ex!r} ({self.state_path})")

    def _apply_layout(self, data: dict):
        n = len(self.panes)
        rects = data.get("rects", [])
        if len(rects) == n and all(isinstance(r, list) and len(r) == 4 for r in rects):
            for p, r in zip(self.panes, rects):
                self.canvas.rel[p] = QRectF(*r)
            self.canvas.apply_all()
        else:
            self.canvas.grid()
        for i in data.get("z", []):
            if isinstance(i, int) and 0 <= i < n:
                self.canvas.raise_pane(self.panes[i])

    def load_state(self):
        """Wczytuje wygląd i układ od razu; pliki paneli dopiero po pokazaniu okna (start_loading)."""
        try:
            data = json.loads(self.state_path.read_text(encoding="utf-8"))
        except FileNotFoundError:
            return
        except Exception as ex:
            self._log(f"load_state (odczyt): {ex!r}")
            return
        try:
            old_look = int(data.get("look_v", 1) or 1) < LOOK_VERSION
            sch = data.get("scheme") or "light"  # stary stan bez schematu = jasny
            if old_look:  # jednorazowo: nowy wygląd (Morze i limonka); jasny schemat -> jasny wariant
                sch = "morze_j" if sch in ("light", "paper") else DEFAULT_SCHEME
            THEME["grad"] = bool(data.get("grad", True))
            self.apply_scheme(sch, save=False)
            if not old_look:  # własne korekty kolorów (przy starym wyglądzie klucze są inne - pomijamy)
                for k, v in (data.get("colors") or {}).items():
                    if k in COLORS and QColor(v).isValid():
                        COLORS[k] = v
                for k, v in (data.get("ui_over") or {}).items():
                    if k in UI and QColor(v).isValid():
                        UI[k] = self.ui_over[k] = v
            ff = data.get("font_default")
            if isinstance(ff, list) and len(ff) == 2 and ff[0] in FONTS:
                self.font_family, self.font_size = ff[0], max(6.0, min(float(ff[1]), 40.0))
            self.recent = [r for r in data.get("recent", []) if isinstance(r, str)][:10]
            for r in data.get("reminders", []):
                try:
                    if isinstance(r, dict) and r.get("text") and QColor(r.get("color", "")).isValid():
                        datetime.fromisoformat(r["dt"])
                        self.reminders.append({"id": str(r.get("id") or uuid.uuid4().hex), "text": str(r["text"]), "dt": r["dt"],
                                               "color": r["color"], "done": bool(r.get("done")), "notified": bool(r.get("notified"))})
                except (ValueError, TypeError):
                    continue
            LAST["dir"] = data.get("last_dir") if isinstance(data.get("last_dir"), str) else ""
            self.apply_look(save=False)
            sts = [s if isinstance(s, dict) else {} for s in data.get("panes", [])]
            self._set_pane_count(max(1, min(len(sts) or DEFAULT_PANES, MAX_PANES)))
            if data.get("geometry"):
                self.restoreGeometry(QByteArray(base64.b64decode(data["geometry"])))
            self._apply_layout(data)
            if data.get("border") in BORDERS:
                self.set_border(data["border"])
            self.set_snap(bool(data.get("snap", True)))
            self.set_autosave(bool(data.get("autosave", True)))
            self.icon_key = "sealime" if old_look and data.get("icon", "yellow") == "yellow" else data.get("icon", "sealime")
            self.set_menu_visible(bool(data.get("menu", True)))
            for p in self.panes:
                p.set_font(self.font_family, self.font_size)
            self._pending = list(zip(self.panes, sts))
            idx = data.get("current", 0)
            if isinstance(idx, int) and 0 <= idx < len(self.panes):
                self.current = self.panes[idx]
        except Exception as ex:
            self._log(f"load_state: {ex!r}")
            self._pending = []
        # ready ustawia dopiero koniec wczytywania plików: do tego czasu nic nie nadpisuje stanu na dysku

    def _open_state(self, p: TextPane, st: dict):
        if st.get("lang") in dict(LANGS):
            p.lang = st["lang"]
        if st.get("family") in FONTS:
            p.set_font(st["family"], st.get("font") or None)
        try:
            if st.get("reminders"):
                p.open_reminders(self.reminders)
            elif st.get("path"):
                p.open_file(st["path"], st, ask=False)
            elif st.get("untitled"):
                p.new_document(str(st.get("draft", "")), bool(st.get("draft_mod")), st, ask=False)
        except Exception as ex:
            self._log(f"open_state: {ex!r} ({st.get('path')})")
            if st.get("path"):
                p._set_missing(str(st["path"]), repr(ex))  # ścieżka zostaje w stanie, nic nie ginie

    def start_loading(self, args: list[str] | None = None, sync: bool = False):
        """Otwiera pliki z zapisanego stanu po pokazaniu okna (szybszy start), po jednym panelu na obrót pętli."""
        self._args = list(args or [])
        if sync:
            while self._load_step():
                pass
        else:
            QTimer.singleShot(0, self._load_next)

    def _load_step(self) -> bool:
        if not self._pending:
            self._finish_loading()
            return False
        p, st = self._pending.pop(0)
        if p in self.panes:
            self._open_state(p, st)
        return True

    def _load_next(self):
        if self._load_step():
            QTimer.singleShot(0, self._load_next)

    def _finish_loading(self):
        if self._ready:
            return
        for a in self._args:
            self.open_in_free_pane(a)
        self._args = []
        self.set_current(self.current)
        self.prune_images()
        self._ready = True
        self._rem_timer.start()
        QTimer.singleShot(1500, self.check_reminders)
        self.schedule_save()

    def prune_images(self):
        """Usuń obrazy ze schowka, których nie używa żaden panel ani zestaw (zwalnia miejsce na dysku)."""
        d = TextPane.img_dir
        if not d.is_dir():
            return
        norm = lambda s: os.path.normcase(os.path.abspath(s))
        keep = {norm(p.path) for p in self.panes if p.path}
        try:
            for f in self.sets_dir.glob("*.json") if self.sets_dir.is_dir() else []:
                for st in json.loads(f.read_text(encoding="utf-8")).get("panes", []):
                    if isinstance(st, dict) and st.get("path"):
                        keep.add(norm(st["path"]))
            for f in d.iterdir():
                if f.is_file() and f.suffix.lower() == ".png" and norm(str(f)) not in keep:
                    f.unlink()
        except Exception as ex:
            self._log(f"prune_images: {ex!r}")

    def open_in_free_pane(self, path: str):
        for p in self.panes:
            if p.is_empty():
                p.open_file(path, ask=False)
                return
        if len(self.panes) < MAX_PANES:
            self._new_pane().open_file(path, ask=False)

    def closeEvent(self, e):
        for p in self.panes:
            if not p.confirm_close():
                e.ignore()
                return
        self.save_state()
        e.accept()


def install_excepthook(log_path: Path):
    """Nieprzechwycone wyjątki trafiają do startupboard.log (program okienkowy nie ma konsoli)."""
    import traceback
    old = sys.excepthook

    def hook(t, v, tb):
        try:
            with open(log_path, "a", encoding="utf-8") as f:
                f.write(time.strftime("%Y-%m-%d %H:%M:%S ") + "".join(traceback.format_exception(t, v, tb)) + "\n")
        except OSError:
            pass
        try:
            old(t, v, tb)
        except Exception:
            pass

    sys.excepthook = hook


def main():
    if sys.platform == "win32":  # własna ikona/grupa na pasku zadań
        try:
            import ctypes
            ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID("smialo.StartupBoard")
        except Exception:
            pass
    app = QApplication(sys.argv)
    app.setApplicationName("Startup Board")
    app.setOrganizationName("smialo")
    sp = MainWindow._default_state_path()
    sp.parent.mkdir(parents=True, exist_ok=True)
    install_excepthook(sp.with_name("startupboard.log"))
    lock = QLockFile(str(sp.parent / "app.lock"))  # jedna kopia naraz, by nie nadpisywały sobie stanu
    if not lock.tryLock(300):
        QMessageBox.information(None, APP_NAME, "Program już działa (sprawdź pasek zadań).")
        sys.exit(0)
    win = MainWindow()
    win.show()
    win.start_loading(sys.argv[1:])  # pliki z poprzedniej sesji wczytują się już po pokazaniu okna
    code = app.exec()
    lock.unlock()
    sys.exit(code)


if __name__ == "__main__":
    main()
