#!/usr/bin/env python3
"""Startup Board - 6 swobodnych paneli roboczych z pamięcią stanu.

Skróty: Ctrl+O otwórz | Ctrl+S zapisz | Ctrl+W zamknij plik | Alt+1..6 panel
        Ctrl+M pokaż/ukryj pasek menu | Ctrl+Shift+E układ siatki 3x2
Panele: przeciągaj za pasek tytułowy, zmieniaj rozmiar łapiąc krawędź/róg.
        Przyciąganie magnetyczne do krawędzi innych paneli (Alt = wyłącz).
"""
from __future__ import annotations

import base64
import codecs
import json
import math
import os
import re
import sys
import tempfile
import time
from functools import lru_cache
from pathlib import Path

from PySide6.QtCore import (QByteArray, QEvent, QLockFile, QPoint, QPointF, QRect, QRectF, QStandardPaths, Qt,
                            QTimer, QUrl, Signal)
from PySide6.QtGui import (QAction, QActionGroup, QColor, QDesktopServices, QFont, QIcon, QImage, QKeySequence,
                           QPainter, QPen, QPixmap, QPolygonF, QShortcut, QSyntaxHighlighter, QTextCharFormat,
                           QTextCursor)
from PySide6.QtWidgets import (
    QAbstractButton, QApplication, QColorDialog, QDialog, QFileDialog, QFrame, QHBoxLayout, QLabel, QMainWindow,
    QMessageBox, QPlainTextEdit, QPushButton, QScrollArea, QSizePolicy, QStackedWidget,
    QToolButton, QVBoxLayout, QWidget,
)

try:
    import pypdfium2 as pdfium
except Exception:  # brak biblioteki -> PDF niedostępny, reszta działa
    pdfium = None

APP_NAME = "Startup Board"
APP_VERSION = "v1.1"  # zmieniać tylko na polecenie autora
APP_AUTHOR = "Michał Rzekiecki"

MAX_BYTES = 10 * 1024 * 1024        # limit pliku tekstowego
MAX_PDF_BYTES = 200 * 1024 * 1024   # limit PDF
HL_MAX_CHARS = 2_000_000            # powyżej: bez kolorowania
STATE_VERSION = 2
FONTS = ["Consolas", "Arial", "Courier New", "Segoe UI"]
MONO = {"Consolas", "Courier New"}
LANGS = [("auto", "Automatycznie (wg rozszerzenia)"), ("text", "Zwykły tekst"),
         ("python", "Python"), ("html", "HTML"), ("sql", "SQL")]
BORDERS = [0, 1, 2, 3, 4, 6]
DEFAULT_PANES, MAX_PANES = 6, 8
ICON_COLORS = [("red", "Czerwony", "#e53935"), ("orange", "Pomarańczowy", "#fb8c00"),
               ("yellow", "Żółty", "#fdd835"), ("green", "Zielony", "#43a047"),
               ("cyan", "Turkusowy", "#00acc1"), ("blue", "Niebieski", "#1e88e5"),
               ("purple", "Fioletowy", "#8e24aa"), ("pink", "Różowy", "#ec407a")]
EXT_LANG = {".py": "python", ".pyw": "python", ".html": "html", ".htm": "html",
            ".xhtml": "html", ".sql": "sql"}
HDR_CSS = (
    "#hdr{{background:{bg};border-bottom:1px solid #d6d6d6;}}"
    "#hdr QLabel{{color:#666;font-size:8pt;}}"
    "#hdr QToolButton{{border:none;color:#777;padding:0 5px;font-size:9pt;}}"
    "#hdr QToolButton:hover{{background:#dedede;}}"
    "#hdr QToolButton:checked{{color:#000;}}"
)


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


def star_pixmap(color: str, size: int) -> QPixmap:
    pm = QPixmap(size, size)
    pm.fill(Qt.GlobalColor.transparent)
    p = QPainter(pm)
    p.setRenderHint(QPainter.RenderHint.Antialiasing)
    cx, cy, R = size / 2, size / 2 + size * 0.03, size * 0.47
    pts = [QPointF(cx + (R if i % 2 == 0 else R * 0.42) * math.sin(i * math.pi / 5),
                   cy - (R if i % 2 == 0 else R * 0.42) * math.cos(i * math.pi / 5)) for i in range(10)]
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


# ---------- kolorowanie składni (Python / HTML / SQL + cyfry) ----------

def _fmt(color: str, bold=False, italic=False) -> QTextCharFormat:
    f = QTextCharFormat()
    f.setForeground(QColor(color))
    if bold:
        f.setFontWeight(QFont.Weight.Bold)
    if italic:
        f.setFontItalic(True)
    return f


DEFAULT_COLORS = {
    "bg": "#ffffff", "text": "#1f1f1f", "num": "#ff7a00", "str": "#2fb344", "com": "#9aa0a6",
    "kw": "#3b82f6", "other": "#b455e6",
    "p;": "#ff3b30", "p?": "#ff2d95", "p!": "#ff9500", "p-": "#00c2a8", "p_": "#b266ff", "p=": "#2f80ff",
    "p+": "#34c759", "p*/%": "#ff8a00", "p<>": "#8a63ff", "p&|^~": "#ff5e3a", "p,.:": "#18b8d9",
    "p()": "#d9a400", "p[]": "#4f6bff", "p{}": "#ff5252", "p\\@$": "#c9a300",
}
COLORS = dict(DEFAULT_COLORS)  # aktualna paleta (globalna dla wszystkich paneli)
COLOR_LABELS = [("text", "Tekst"), ("bg", "Tło edytora"), ("str", "Wartości w 'x' i \"x\""),
                ("num", "Cyfry"), ("com", "Komentarze"), ("kw", "Słowa kluczowe i znaczniki"),
                ("other", "Funkcje, atrybuty, wbudowane")]
PUNCT_GROUPS = [("p;", ";"), ("p?", "?"), ("p!", "!"), ("p-", "-"), ("p_", "_"), ("p=", "="), ("p+", "+"),
                ("p*/%", "* / %"), ("p<>", "< >"), ("p&|^~", "& | ^ ~"), ("p,.:", ", . :"),
                ("p()", "( )"), ("p[]", "[ ]"), ("p{}", "{ }"), ("p\\@$", "\\ @ $")]


@lru_cache(maxsize=1)
def _formats() -> dict:
    c = COLORS
    return {
        "num": _fmt(c["num"]), "kw": _fmt(c["kw"], bold=True), "builtin": _fmt(c["other"]),
        "str": _fmt(c["str"]), "com": _fmt(c["com"], italic=True), "tag": _fmt(c["kw"]),
        "attr": _fmt(c["other"]), "deco": _fmt(c["other"]), "func": _fmt(c["other"]),
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
PY_KW = ("False None True and as assert async await break class continue def del elif else except finally "
         "for from global if import in is lambda nonlocal not or pass raise return try while with yield "
         "match case").split()
PY_BI = ("print len range int str float list dict set tuple bool open type isinstance super self cls "
         "enumerate zip map filter sorted sum min max abs any all repr input id hash iter next").split()
SQL_KW = ("select from where insert into values update set delete create alter drop table index view database "
          "join inner left right outer full cross on as and or not null is in like between exists union all "
          "distinct group by order having limit offset case when then else end primary key foreign references "
          "default unique check constraint add column asc desc top with begin commit rollback transaction "
          "truncate if replace procedure function trigger grant revoke").split()
SQL_FN = "count sum avg min max coalesce ifnull upper lower length substr substring trim now cast convert round"


def _words(ws, flags=0):
    return re.compile(r"\b(?:" + "|".join(ws) + r")\b", flags)


@lru_cache(maxsize=None)
def _lang_def(lang: str):
    """-> (reguły [(re, fmt)], strcom (re, {grupa: fmt}) | None, ml [(start, end, fmt)])"""
    F = _formats()
    rules = []
    strcom, ml = None, []
    if lang == "python":
        rules += [(_words(PY_KW), F["kw"]), (_words(PY_BI), F["builtin"]),
                  (re.compile(r"@\w[\w.]*"), F["deco"]),
                  (re.compile(r"(?<=\bdef )\w+|(?<=\bclass )\w+"), F["func"])]
        strcom = (re.compile(r"(?P<c>#[^\n]*)|(?P<s>[rRbBfFuU]{0,2}(?:\"(?:\\.|[^\"\\])*\"|'(?:\\.|[^'\\])*'))"),
                  {"c": F["com"], "s": F["str"]})
        ml = [(re.compile(r'"""'), re.compile(r'"""'), F["str"]), (re.compile(r"'''"), re.compile(r"'''"), F["str"])]
    elif lang == "html":
        rules += [(re.compile(r"</?[A-Za-z][\w:-]*|/?>"), F["tag"]), (re.compile(r"\b[\w:-]+(?==)"), F["attr"]),
                  (re.compile(r"&#?\w+;"), F["builtin"])]
        strcom = (re.compile(r"=\s*(?P<s>\"[^\"]*\"|'[^']*')"), {"s": F["str"]})
        ml = [(re.compile(r"<!--"), re.compile(r"-->"), F["com"])]
    elif lang == "sql":
        rules += [(_words(SQL_KW, re.I), F["kw"]),
                  (re.compile(r"\b(?:" + SQL_FN.replace(" ", "|") + r")\b(?=\s*\()", re.I), F["func"])]
        strcom = (re.compile(r"(?P<c>--[^\n]*)|(?P<s>'(?:''|[^'])*')|(?P<i>\"[^\"]*\")"),
                  {"c": F["com"], "s": F["str"], "i": F["attr"]})
        ml = [(re.compile(r"/\*"), re.compile(r"\*/"), F["com"])]
    return rules, strcom, ml


class Highlighter(QSyntaxHighlighter):
    def __init__(self, doc, lang="text"):
        super().__init__(doc)
        self.lang = lang

    def set_language(self, lang: str):
        if lang != self.lang:
            self.lang = lang
            self.rehighlight()

    def highlightBlock(self, text: str):
        rules, strcom, ml = _lang_def(self.lang)
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
        comments = []
        if strcom:
            rx, gf = strcom
            for m in rx.finditer(text):
                for g, fmt in gf.items():
                    if m.group(g) is not None:
                        self.setFormat(m.start(g), m.end(g) - m.start(g), fmt)
                        if g == "c":
                            comments.append((m.start(g), m.end(g)))
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
        self.setStyleSheet("QScrollArea{background:#8a8a8a;}")
        self.verticalScrollBar().valueChanged.connect(self.render_visible)

    def load(self, raw: bytes):
        self.close_doc()
        self.doc = pdfium.PdfDocument(raw)
        self.sizes = [self.doc[i].get_size() for i in range(len(self.doc))]
        self.container = QWidget()
        self.container.setStyleSheet("background:#8a8a8a;")
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

    def __init__(self, index: int):
        super().__init__()
        self.index = index
        self.path: str | None = None
        self.kind = "text"  # text | pdf
        self.encoding, self.newline = "utf-8", "\n"
        self.mtime: float | None = None
        self.disk_size = 0
        self.missing = self.conflict = False
        self.lang = "auto"
        self.family = "Consolas"
        self.border = 1
        self._active = False
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
        self.btn_wrap = QToolButton(text="↵", checkable=True, checked=True, toolTip="Zawijanie wierszy")
        self.btn_open = QToolButton(text="…", toolTip="Otwórz plik (Ctrl+O)")
        self.btn_close = QToolButton(text="×", toolTip="Zamknij plik (Ctrl+W)")
        h.addWidget(self.lbl_name, 1)
        for w in (self.lbl_state, self.btn_wrap, self.btn_open, self.btn_close):
            h.addWidget(w)

        self.stack = QStackedWidget()
        ph = QWidget()
        pv = QVBoxLayout(ph)
        pv.addStretch(1)
        self.lbl_hint = QLabel()
        self.lbl_hint.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.lbl_hint.setWordWrap(True)
        self.lbl_hint.setStyleSheet("color:#999;")
        self.btn_ph = QPushButton("Otwórz plik…")
        self.btn_ph.setFixedWidth(130)
        pv.addWidget(self.lbl_hint)
        pv.addWidget(self.btn_ph, 0, Qt.AlignmentFlag.AlignHCenter)
        pv.addStretch(1)
        self.editor = Editor()
        self.editor.setFrameShape(QFrame.Shape.NoFrame)
        self.editor.setLineWrapMode(QPlainTextEdit.LineWrapMode.WidgetWidth)
        self.hl = Highlighter(self.editor.document(), "text")
        self.pdf = PdfViewer()
        self.stack.addWidget(ph)
        self.stack.addWidget(self.editor)
        self.stack.addWidget(self.pdf)

        lay = QVBoxLayout(self)
        lay.setContentsMargins(0, 0, 0, 0)
        lay.setSpacing(0)
        lay.addWidget(self.header)
        lay.addWidget(self.stack, 1)

        self.set_font(self.family, 10)
        self.btn_wrap.toggled.connect(self.set_wrap)
        self.btn_open.clicked.connect(self.ask_open)
        self.btn_ph.clicked.connect(self.ask_open)
        self.btn_close.clicked.connect(self.close_file)
        self.editor.document().modificationChanged.connect(lambda _m: self.refresh_header())
        self.editor.fileDropped.connect(self.open_file)
        self.editor.focused.connect(self._on_focus)
        self._reset_hint()
        self.set_active(False)
        self.apply_colors()
        self.refresh_header()

    # --- wygląd ---
    def _restyle(self):
        col = "#7aa7d9" if self._active else "#c9c9c9"
        css = f"TextPane{{border:{self.border}px solid {col};}}" if self.border > 0 else "TextPane{border:none;}"
        self.setStyleSheet(css)
        self.header.setStyleSheet(HDR_CSS.format(bg="#e6eef7" if self._active else "#f3f3f3"))

    def set_active(self, on: bool):
        self._active = on
        self._restyle()

    def apply_colors(self):
        self.editor.setStyleSheet(
            f"QPlainTextEdit{{background:{COLORS['bg']};color:{COLORS['text']};}}")
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

    def _reset_hint(self):
        self.lbl_hint.setText("Pusty panel\nprzeciągnij tu plik lub kliknij")

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
        w = {1: self.editor, 2: self.pdf}.get(self.stack.currentIndex(), self.btn_ph)
        w.setFocus()
        self.activated.emit(self)

    def is_modified(self) -> bool:
        return self.kind == "text" and self.editor.document().isModified()

    # --- nagłówek ---
    def refresh_header(self):
        if self.path is None:
            self.lbl_name.setText("— pusty —")
            self.lbl_name.setToolTip("")
            self.lbl_state.setText("")
            return
        self.lbl_name.setText(Path(self.path).name)
        self.lbl_name.setToolTip(self.path)
        if self.missing:
            txt, col = "⚠ nie otwarto", "#b00020"
        elif self.conflict:
            txt, col = "⚠ zmieniony na dysku", "#b00020"
        elif self.kind == "pdf":
            txt, col = f"PDF · {self.pdf.page_count()} str.", "#5a6a8a"
        elif self.is_modified():
            txt, col = "● niezapisany", "#c0562a"
        else:
            txt, col = "zapisany", "#5a8a5a"
        if not self.missing:
            txt += f" · {human_size(self.disk_size)}"
        self.lbl_state.setText(txt)
        self.lbl_state.setStyleSheet(f"color:{col};")
        self.lbl_state.setToolTip(f"Kodowanie: {self.encoding}" if self.kind == "text" else "")

    # --- pliki ---
    def ask_open(self):
        if not self.confirm_close():
            return
        start = str(Path(self.path).parent) if self.path else ""
        fn, _ = QFileDialog.getOpenFileName(
            self, "Otwórz plik", start, "Obsługiwane (*.txt *.py *.html *.htm *.sql *.md *.csv *.json *.log *.pdf);;Wszystkie (*)")
        if fn:
            self.open_file(fn, ask=False)

    def open_file(self, path: str, st: dict | None = None, ask: bool = True) -> bool:
        if ask and not self.confirm_close():
            return False
        st = st or {}
        p = Path(path)
        is_pdf = p.suffix.lower() == ".pdf"
        try:
            stt = p.stat()
            limit = MAX_PDF_BYTES if is_pdf else MAX_BYTES
            if stt.st_size > limit:
                raise ValueError(f"plik większy niż {human_size(limit)}")
            raw = p.read_bytes()
        except Exception as ex:
            self._set_missing(str(p), str(ex))
            return False
        if is_pdf:
            return self._open_pdf(p, raw, stt, st)
        if b"\x00" in raw[:8192] and not raw.startswith((codecs.BOM_UTF16_LE, codecs.BOM_UTF16_BE)):
            self._set_missing(str(p), "plik binarny; ten format nie jest jeszcze obsługiwany")
            return False
        text, enc = decode_bytes(raw)
        self.pdf.close_doc()
        self.kind = "text"
        self.path, self.encoding = str(p), enc
        self.newline = "\r\n" if b"\r\n" in raw else "\n"
        self.mtime, self.disk_size = stt.st_mtime, stt.st_size
        self.missing = self.conflict = False
        self.btn_wrap.setEnabled(True)
        self.lang = st.get("lang", self.lang if st else "auto")
        if st.get("family") in FONTS:
            self.family = st["family"]
        self.set_font(self.family, st.get("font") or None)
        self.editor.setPlainText(text)
        self.editor.document().setModified(False)
        self.apply_lang()
        self.stack.setCurrentIndex(1)
        self._apply_view_state(st)
        self.refresh_header()
        return True

    def _open_pdf(self, p: Path, raw: bytes, stt, st: dict) -> bool:
        if pdfium is None:
            self._set_missing(str(p), "brak biblioteki pypdfium2")
            return False
        try:
            self.pdf.load(raw)
        except Exception as ex:
            self._set_missing(str(p), f"nie można otworzyć PDF: {ex}")
            return False
        self.editor.setPlainText("")
        self.editor.document().setModified(False)
        self.kind, self.path = "pdf", str(p)
        self.mtime, self.disk_size = stt.st_mtime, stt.st_size
        self.missing = self.conflict = False
        self.btn_wrap.setEnabled(False)
        self.stack.setCurrentIndex(2)
        z = float(st.get("pdf_zoom", 0) or 0)
        if z > 0:
            self.pdf.zoom = z
            self.pdf.relayout()
        page = int(st.get("page", 0))
        QTimer.singleShot(80, lambda: self.pdf.jump(page))
        self.refresh_header()
        return True

    def _set_missing(self, path: str, why: str):
        self.pdf.close_doc()
        self.kind = "text"
        self.path, self.missing, self.mtime = path, True, None
        self.editor.setPlainText("")
        self.editor.document().setModified(False)
        self.lbl_hint.setText(f"Nie można otworzyć:\n{path}\n({why})")
        self.stack.setCurrentIndex(0)
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
        if self.path is None or self.kind != "text" or self.stack.currentIndex() != 1:
            return True
        text = self.editor.toPlainText().replace("\n", self.newline)
        try:
            data = text.encode(self.encoding)
        except UnicodeEncodeError:
            self.encoding = "utf-8"
            data = text.encode("utf-8")
        try:
            atomic_write(Path(self.path), data)
        except Exception as ex:
            QMessageBox.warning(self, "Błąd zapisu", f"{self.path}\n\n{ex}")
            return False
        s = Path(self.path).stat()
        self.mtime, self.disk_size, self.conflict = s.st_mtime, s.st_size, False
        self.editor.document().setModified(False)
        self.refresh_header()
        return True

    def confirm_close(self) -> bool:
        if self.path is None or not self.is_modified():
            return True
        r = QMessageBox.question(
            self, "Niezapisane zmiany", f"Zapisać zmiany w „{Path(self.path).name}”?",
            QMessageBox.StandardButton.Save | QMessageBox.StandardButton.Discard | QMessageBox.StandardButton.Cancel)
        if r == QMessageBox.StandardButton.Save:
            return self.save()
        return r == QMessageBox.StandardButton.Discard

    def close_file(self):
        if not self.confirm_close():
            return
        self.pdf.close_doc()
        self.kind = "text"
        self.path, self.mtime, self.missing, self.conflict = None, None, False, False
        self.editor.setPlainText("")
        self.editor.document().setModified(False)
        self.btn_wrap.setEnabled(True)
        self._reset_hint()
        self.stack.setCurrentIndex(0)
        self.refresh_header()

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
        p.hide()
        p.setParent(None)
        p.deleteLater()
        for i, q in enumerate(self.panes):
            q.index = i
        self.layoutChanged.emit()

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




# ---------- okno główne ----------

class MainWindow(QMainWindow):
    def __init__(self, state_path: Path | None = None):
        super().__init__()
        self.setWindowTitle(APP_NAME)
        self.state_path = state_path or self._default_state_path()
        self._ready = False
        self.border = 1
        self.icon_key = "yellow"
        self.canvas = Canvas([TextPane(i) for i in range(DEFAULT_PANES)])
        self.panes = self.canvas.panes
        self.current: TextPane = self.panes[0]
        self.setCentralWidget(self.canvas)
        for p in self.panes:
            p.activated.connect(self.set_current)
        self._save_timer = QTimer(self, singleShot=True, interval=500)
        self._save_timer.timeout.connect(self.save_state)
        self.canvas.layoutChanged.connect(self.schedule_save)
        self._build_menu()
        for i in range(MAX_PANES):
            QShortcut(QKeySequence(f"Alt+{i + 1}"), self,
                      activated=lambda i=i: self.panes[i].focus_editor() if i < len(self.panes) else None)
        self.resize(1500, 900)
        self.load_state()
        self.set_icon_color(self.icon_key)
        self.set_current(self.current)
        self.timer = QTimer(self, interval=5_000)
        self.timer.timeout.connect(self.save_state)
        self.timer.start()
        QApplication.instance().aboutToQuit.connect(self.save_state)
        self._ready = True

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
        m.addAction(self._act("Otwórz w aktywnym panelu…", lambda: self.current.ask_open(), "Ctrl+O"))
        m.addAction(self._act("Zapisz", lambda: self.current.save(), "Ctrl+S"))
        m.addAction(self._act("Zamknij plik w panelu", lambda: self.current.close_file(), "Ctrl+W"))
        m.addSeparator()
        m.addAction(self._act("Zakończ", self.close, "Ctrl+Q"))

        v = mb.addMenu("&Widok")
        self.font_acts = self._radio(v.addMenu("Czcionka (aktywny panel)"), [(f, f) for f in FONTS],
                                     lambda k: self.current.set_font(k))
        self.lang_acts = self._radio(v.addMenu("Składnia (aktywny panel)"), LANGS,
                                     lambda k: self.current.set_lang(k))
        self.act_wrap = self._act("Zawijanie wierszy (aktywny panel)", lambda: self.current.btn_wrap.toggle(),
                                  "Ctrl+Shift+W", checkable=True)
        v.addAction(self.act_wrap)
        self.border_acts = self._radio(
            v.addMenu("Grubość ramki paneli"),
            [(b, "0 px (brak)" if b == 0 else f"{b} px") for b in BORDERS], self.set_border)
        self.icon_acts = self._radio(
            v.addMenu("Kolor ikony (gwiazda)"), [(k, n) for k, n, _c in ICON_COLORS], self.set_icon_color,
            icons={k: QIcon(star_pixmap(c, 16)) for k, _n, c in ICON_COLORS})
        mc = v.addMenu("Kolory składni")
        self.color_acts: dict[str, QAction] = {}
        for key, label in COLOR_LABELS:
            mc.addAction(self._color_action(key, label))
        mz = mc.addMenu("Znaki interpunkcyjne")
        for key, label in PUNCT_GROUPS:
            mz.addAction(self._color_action(key, label))
        mc.addSeparator()
        mc.addAction(self._act("Przywróć domyślne kolory", self.reset_colors))
        v.addSeparator()
        self.act_menu = self._act("Pokaż pasek menu", lambda: self.set_menu_visible(not self.menuBar().isVisible()),
                                  "Ctrl+M", checkable=True)
        v.addAction(self.act_menu)
        v.aboutToShow.connect(self._sync_menu)

        self.m_layout = mb.addMenu("&Układ")
        self.act_add = self._act(f"Dodaj panel (maks. {MAX_PANES})", self.add_pane, "Ctrl+Shift+N")
        self.act_del = self._act("Usuń aktywny panel (zwalnia pamięć)", self.remove_pane, "Ctrl+Shift+D")
        self.m_layout.addAction(self.act_add)
        self.m_layout.addAction(self.act_del)
        self.m_layout.addSeparator()
        self.m_layout.addAction(self._act("Siatka (reset układu)", self.canvas.grid, "Ctrl+Shift+E"))
        self.act_snap = self._act("Przyciąganie magnetyczne (Alt = chwilowo wyłącz)",
                                  lambda: setattr(self.canvas, "snap_on", self.act_snap.isChecked()), checkable=True)
        self.act_snap.setChecked(True)
        self.m_layout.addAction(self.act_snap)
        self.m_layout.aboutToShow.connect(self._sync_menu)

        hp = mb.addMenu("Po&moc")
        hp.addAction(self._act("Folder z ustawieniami", lambda: QDesktopServices.openUrl(
            QUrl.fromLocalFile(str(self.state_path.parent)))))
        hp.addAction(self._act("O autorze", self.show_about))

    @staticmethod
    def _swatch(col: str) -> QIcon:
        pm = QPixmap(16, 16)
        pm.fill(QColor(col))
        p = QPainter(pm)
        p.setPen(QColor("#808080"))
        p.drawRect(0, 0, 15, 15)
        p.end()
        return QIcon(pm)

    def _color_action(self, key: str, label: str) -> QAction:
        a = QAction(label, self)
        a.setIcon(self._swatch(COLORS[key]))
        a.triggered.connect(lambda _c=False, k=key, l=label: self.pick_color(k, l))
        self.color_acts[key] = a
        return a

    def pick_color(self, key: str, label: str):
        c = QColorDialog.getColor(QColor(COLORS[key]), self, f"Kolor: {label}")
        if c.isValid():
            COLORS[key] = c.name()
            self.apply_colors()

    def reset_colors(self):
        COLORS.clear()
        COLORS.update(DEFAULT_COLORS)
        self.apply_colors()

    def apply_colors(self):
        refresh_colors()
        for p in self.panes:
            p.apply_colors()
        for key, a in self.color_acts.items():
            a.setIcon(self._swatch(COLORS[key]))
        self.schedule_save()

    def _sync_menu(self):
        c = self.current
        if c.family in self.font_acts:
            self.font_acts[c.family].setChecked(True)
        self.lang_acts[c.lang].setChecked(True)
        self.border_acts[self.border].setChecked(True)
        self.icon_acts[self.icon_key].setChecked(True)
        self.act_wrap.setChecked(c.btn_wrap.isChecked())
        self.act_menu.setChecked(self.menuBar().isVisible())
        self.act_add.setEnabled(len(self.panes) < MAX_PANES)
        self.act_del.setEnabled(len(self.panes) > 1)

    def show_about(self):
        col = dict((k, c) for k, _n, c in ICON_COLORS)[self.icon_key]
        d = QDialog(self)
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
        for w in (title, ver, author):
            w.setAlignment(center)
        ok = QPushButton("OK")
        ok.setDefault(True)
        ok.clicked.connect(d.accept)
        for w in (ic, title, ver, author):
            lay.addWidget(w)
        lay.addSpacing(8)
        lay.addWidget(ok, 0, Qt.AlignmentFlag.AlignHCenter)
        d.exec()

    # --- ustawienia widoku ---
    def set_menu_visible(self, on: bool):
        self.menuBar().setVisible(on)
        self.act_menu.setChecked(on)
        self.schedule_save()

    def set_border(self, n: int):
        self.border = n
        for p in self.panes:
            p.set_border(n)
        self.schedule_save()

    def set_icon_color(self, key: str):
        cols = {k: c for k, _n, c in ICON_COLORS}
        if key not in cols:
            key = "yellow"
        self.icon_key = key
        ic = star_icon(cols[key])
        self.setWindowIcon(ic)
        QApplication.instance().setWindowIcon(ic)
        self.schedule_save()

    def set_current(self, pane: TextPane):
        self.current = pane
        for p in self.panes:
            p.set_active(p is pane)

    # --- dodawanie / usuwanie paneli ---
    def _new_pane(self) -> TextPane:
        p = TextPane(len(self.panes))
        p.activated.connect(self.set_current)
        p.set_border(self.border)
        self.canvas.add_pane(p)
        return p

    def add_pane(self):
        if len(self.panes) >= MAX_PANES:
            QMessageBox.information(self, APP_NAME, f"Maksymalnie {MAX_PANES} paneli.")
            return
        p = self._new_pane()
        self.set_current(p)
        p.focus_editor()

    def remove_pane(self):
        if len(self.panes) <= 1:
            return
        p = self.current
        if not p.confirm_close():
            return
        idx = self.panes.index(p)
        self.canvas.remove_pane(p)
        self.set_current(self.panes[min(idx, len(self.panes) - 1)])

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

    def save_state(self):
        if not self._ready:
            return
        try:
            data = {
                "version": STATE_VERSION,
                "geometry": base64.b64encode(bytes(self.saveGeometry())).decode(),
                "rects": [[r.x(), r.y(), r.width(), r.height()] for r in (self.canvas.rel[p] for p in self.panes)],
                "z": [p.index for p in self.canvas.order],
                "border": self.border, "snap": self.canvas.snap_on, "icon": self.icon_key,
                "colors": {k: v for k, v in COLORS.items() if v != DEFAULT_COLORS.get(k)},
                "menu": self.menuBar().isVisible(),
                "current": self.current.index,
                "panes": [p.state() for p in self.panes],
            }
            self.state_path.parent.mkdir(parents=True, exist_ok=True)
            atomic_write(self.state_path, json.dumps(data, ensure_ascii=False, indent=1).encode())
        except Exception as ex:  # zapis stanu nigdy nie może zawiesić programu
            self._log(f"save_state: {ex!r} ({self.state_path})")

    def load_state(self):
        try:
            data = json.loads(self.state_path.read_text(encoding="utf-8"))
        except FileNotFoundError:
            return
        except Exception as ex:
            self._log(f"load_state (odczyt): {ex!r}")
            return
        try:
            for k, v in (data.get("colors") or {}).items():
                if k in DEFAULT_COLORS and QColor(v).isValid():
                    COLORS[k] = v
            self.apply_colors()
            n = max(1, min(len(data.get("panes", [])) or DEFAULT_PANES, MAX_PANES))
            while len(self.panes) < n:
                self._new_pane()
            while len(self.panes) > n:
                self.canvas.remove_pane(self.panes[-1])
            if data.get("geometry"):
                self.restoreGeometry(QByteArray(base64.b64decode(data["geometry"])))
            rects = data.get("rects", [])
            if len(rects) == n:
                for p, r in zip(self.panes, rects):
                    self.canvas.rel[p] = QRectF(*r)
                self.canvas.apply_all()
            else:
                self.canvas.grid()
            for i in data.get("z", []):
                if 0 <= i < n:
                    self.canvas.raise_pane(self.panes[i])
            if data.get("border") in BORDERS:
                self.set_border(data["border"])
            self.canvas.snap_on = bool(data.get("snap", True))
            self.act_snap.setChecked(self.canvas.snap_on)
            self.icon_key = data.get("icon", "yellow")
            self.set_menu_visible(bool(data.get("menu", True)))
            for p, st in zip(self.panes, data.get("panes", [])):
                if st.get("lang") in dict(LANGS):
                    p.lang = st["lang"]
                if st.get("family") in FONTS:
                    p.set_font(st["family"], st.get("font") or None)
                if st.get("path"):
                    p.open_file(st["path"], st, ask=False)
            idx = data.get("current", 0)
            if 0 <= idx < n:
                self.current = self.panes[idx]
        except Exception as ex:
            self._log(f"load_state: {ex!r}")

    def open_in_free_pane(self, path: str):
        for p in self.panes:
            if p.path is None:
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


def main():
    if sys.platform == "win32":  # własna ikona/grupa na pasku zadań
        try:
            import ctypes
            ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID("smialo.StartupBoard")
        except Exception:
            pass
    app = QApplication(sys.argv)
    app.setApplicationName("StartupBoard")
    app.setOrganizationName("smialo")
    sp = MainWindow._default_state_path()
    sp.parent.mkdir(parents=True, exist_ok=True)
    lock = QLockFile(str(sp.parent / "app.lock"))  # jedna kopia naraz, by nie nadpisywały sobie stanu
    if not lock.tryLock(300):
        QMessageBox.information(None, APP_NAME, "Program już działa (sprawdź pasek zadań).")
        sys.exit(0)
    win = MainWindow()
    for arg in sys.argv[1:]:
        win.open_in_free_pane(arg)
    win.show()
    code = app.exec()
    lock.unlock()
    sys.exit(code)


if __name__ == "__main__":
    main()
