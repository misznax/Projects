#!/usr/bin/env python3
"""Startup Board - 6 paneli roboczych (3x2) z pamięcią stanu.

Uruchomienie:  pip install PySide6   ->   pythonw startup_board.py [plik ...]
Skróty: Ctrl+O otwórz | Ctrl+S zapisz | Ctrl+W zamknij plik w panelu
        Alt+1..6 przejdź do panelu | Ctrl+Shift+E wyrównaj rozmiary
"""
from __future__ import annotations

import base64
import codecs
import json
import os
import sys
import tempfile
from pathlib import Path

from PySide6.QtCore import QByteArray, QStandardPaths, Qt, QTimer, Signal
from PySide6.QtGui import QFont, QFontDatabase, QKeySequence, QShortcut, QTextCursor
from PySide6.QtWidgets import (
    QApplication, QFileDialog, QFrame, QHBoxLayout, QLabel, QMainWindow,
    QMessageBox, QPlainTextEdit, QPushButton, QSizePolicy, QSplitter, QStackedWidget,
    QToolButton, QVBoxLayout, QWidget,
)

MAX_BYTES = 10 * 1024 * 1024  # większe pliki nie są wczytywane do edytora
STATE_VERSION = 1
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
    """Zwraca (tekst, kodowanie). Kolejność: BOM UTF-8/16, UTF-8, CP1250, Latin-1."""
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
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix=".sb_", suffix=".tmp")
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(data)
        os.replace(tmp, path)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


# ---------- edytor ----------

class Editor(QPlainTextEdit):
    fileDropped = Signal(str)
    focused = Signal()

    def focusInEvent(self, e):
        super().focusInEvent(e)
        self.focused.emit()

    def _has_files(self, e) -> bool:
        return e.mimeData().hasUrls()

    def dragEnterEvent(self, e):
        e.acceptProposedAction() if self._has_files(e) else super().dragEnterEvent(e)

    def dragMoveEvent(self, e):
        e.acceptProposedAction() if self._has_files(e) else super().dragMoveEvent(e)

    def dropEvent(self, e):
        if self._has_files(e):
            urls = [u.toLocalFile() for u in e.mimeData().urls() if u.isLocalFile()]
            if urls:
                self.fileDropped.emit(urls[0])
                e.acceptProposedAction()
                return
        super().dropEvent(e)


# ---------- panel tekstowy ----------

class TextPane(QFrame):
    activated = Signal(object)

    def __init__(self, index: int):
        super().__init__()
        self.index = index
        self.path: str | None = None
        self.encoding = "utf-8"
        self.newline = "\n"
        self.mtime: float | None = None
        self.disk_size = 0
        self.missing = False
        self.conflict = False
        self._active = False
        self.setAcceptDrops(True)

        # --- pasek tytułowy (delikatny) ---
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
        self.btn_wrap = QToolButton(text="↵", checkable=True, checked=True,
                                    toolTip="Zawijanie wierszy")
        self.btn_open = QToolButton(text="…", toolTip="Otwórz plik (Ctrl+O)")
        self.btn_close = QToolButton(text="×", toolTip="Zamknij plik (Ctrl+W)")
        h.addWidget(self.lbl_name, 1)
        for w in (self.lbl_state, self.btn_wrap, self.btn_open, self.btn_close):
            h.addWidget(w)

        # --- treść: placeholder / edytor ---
        self.stack = QStackedWidget()
        ph = QWidget()
        pv = QVBoxLayout(ph)
        pv.addStretch(1)
        self.lbl_hint = QLabel("Pusty panel\nprzeciągnij tu plik lub kliknij")
        self.lbl_hint.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.lbl_hint.setWordWrap(True)
        self.lbl_hint.setStyleSheet("color:#999;")
        self.btn_ph = QPushButton("Otwórz plik…")
        self.btn_ph.setFixedWidth(130)
        pv.addWidget(self.lbl_hint)
        pv.addWidget(self.btn_ph, 0, Qt.AlignmentFlag.AlignHCenter)
        pv.addStretch(1)
        self.editor = Editor()
        font = QFontDatabase.systemFont(QFontDatabase.SystemFont.FixedFont)
        font.setPointSize(10)
        self.editor.setFont(font)
        self.editor.setFrameShape(QFrame.Shape.NoFrame)
        self.editor.setLineWrapMode(QPlainTextEdit.LineWrapMode.WidgetWidth)
        self.stack.addWidget(ph)
        self.stack.addWidget(self.editor)

        lay = QVBoxLayout(self)
        lay.setContentsMargins(0, 0, 0, 0)
        lay.setSpacing(0)
        lay.addWidget(self.header)
        lay.addWidget(self.stack, 1)
        self.setStyleSheet("TextPane{border:1px solid #d0d0d0;}")

        self.btn_wrap.toggled.connect(self.set_wrap)
        self.btn_open.clicked.connect(self.ask_open)
        self.btn_ph.clicked.connect(self.ask_open)
        self.btn_close.clicked.connect(self.close_file)
        self.editor.document().modificationChanged.connect(lambda _m: self.refresh_header())
        self.editor.fileDropped.connect(self.open_file)
        self.editor.focused.connect(self._on_focus)
        self.set_active(False)
        self.refresh_header()

    # --- zdarzenia ---
    def dragEnterEvent(self, e):
        e.acceptProposedAction() if e.mimeData().hasUrls() else None

    def dropEvent(self, e):
        urls = [u.toLocalFile() for u in e.mimeData().urls() if u.isLocalFile()]
        if urls:
            self.open_file(urls[0])

    def _on_focus(self):
        self.activated.emit(self)
        self.check_external()

    def set_active(self, on: bool):
        self._active = on
        self.header.setStyleSheet(HDR_CSS.format(bg="#e6eef7" if on else "#f3f3f3"))

    def focus_editor(self):
        (self.editor if self.stack.currentIndex() == 1 else self.btn_ph).setFocus()
        self.activated.emit(self)

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
            txt, col = "⚠ brak pliku", "#b00020"
        elif self.conflict:
            txt, col = "⚠ zmieniony na dysku", "#b00020"
        elif self.editor.document().isModified():
            txt, col = "● niezapisany", "#c0562a"
        else:
            txt, col = "zapisany", "#5a8a5a"
        if not self.missing:
            txt += f" · {human_size(self.disk_size)}"
        self.lbl_state.setText(txt)
        self.lbl_state.setStyleSheet(f"color:{col};")
        self.lbl_state.setToolTip(f"Kodowanie: {self.encoding}")

    # --- operacje na plikach ---
    def ask_open(self):
        if not self.confirm_close():
            return
        start = str(Path(self.path).parent) if self.path else ""
        fn, _ = QFileDialog.getOpenFileName(self, "Otwórz plik tekstowy", start)
        if fn:
            self.open_file(fn, ask=False)

    def open_file(self, path: str, st: dict | None = None, ask: bool = True) -> bool:
        if ask and not self.confirm_close():
            return False
        p = Path(path)
        try:
            size = p.stat().st_size
            if size > MAX_BYTES:
                raise ValueError(f"plik większy niż {human_size(MAX_BYTES)}")
            raw = p.read_bytes()
        except Exception as ex:  # brak pliku / dysku / uprawnień
            self._set_missing(str(p), str(ex))
            return False
        text, enc = decode_bytes(raw)
        self.path, self.encoding = str(p), enc
        self.newline = "\r\n" if b"\r\n" in raw else "\n"
        self.mtime, self.disk_size = p.stat().st_mtime, size
        self.missing = self.conflict = False
        self.editor.setPlainText(text)
        self.editor.document().setModified(False)
        self.stack.setCurrentIndex(1)
        self._apply_view_state(st or {})
        self.refresh_header()
        return True

    def _set_missing(self, path: str, why: str):
        self.path, self.missing, self.mtime = path, True, None
        self.editor.setPlainText("")
        self.editor.document().setModified(False)
        self.lbl_hint.setText(f"Nie można otwierać:\n{path}\n({why})")
        self.stack.setCurrentIndex(0)
        self.refresh_header()

    def _apply_view_state(self, st: dict):
        self.btn_wrap.setChecked(bool(st.get("wrap", True)))
        if st.get("font"):
            f = self.editor.font()
            f.setPointSizeF(float(st["font"]))
            self.editor.setFont(f)
        cur = QTextCursor(self.editor.document())
        cur.setPosition(max(0, min(int(st.get("cursor", 0)), self.editor.document().characterCount() - 1)))
        self.editor.setTextCursor(cur)
        sc = int(st.get("scroll", 0))
        QTimer.singleShot(60, lambda: self.editor.verticalScrollBar().setValue(sc))

    def set_wrap(self, on: bool):
        self.editor.setLineWrapMode(QPlainTextEdit.LineWrapMode.WidgetWidth if on
                                    else QPlainTextEdit.LineWrapMode.NoWrap)

    def save(self) -> bool:
        if self.path is None or self.stack.currentIndex() != 1:
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
        st = Path(self.path).stat()
        self.mtime, self.disk_size, self.conflict = st.st_mtime, st.st_size, False
        self.editor.document().setModified(False)
        self.refresh_header()
        return True

    def confirm_close(self) -> bool:
        if self.path is None or not self.editor.document().isModified():
            return True
        r = QMessageBox.question(
            self, "Niezapisane zmiany", f"Zapisać zmiany w „{Path(self.path).name}”?",
            QMessageBox.StandardButton.Save | QMessageBox.StandardButton.Discard
            | QMessageBox.StandardButton.Cancel)
        if r == QMessageBox.StandardButton.Save:
            return self.save()
        return r == QMessageBox.StandardButton.Discard

    def close_file(self):
        if not self.confirm_close():
            return
        self.path, self.mtime, self.missing, self.conflict = None, None, False, False
        self.editor.setPlainText("")
        self.editor.document().setModified(False)
        self.lbl_hint.setText("Pusty panel\nprzeciągnij tu plik lub kliknij")
        self.stack.setCurrentIndex(0)
        self.refresh_header()

    def check_external(self):
        """Plik zmieniony poza aplikacją: bez zmian lokalnych -> przeładuj, inaczej ostrzeż."""
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
        if self.editor.document().isModified():
            self.conflict = True
            self.refresh_header()
        else:
            st = self.state()
            self.open_file(self.path, st, ask=False)

    # --- stan ---
    def state(self) -> dict:
        return {
            "path": self.path,
            "wrap": self.btn_wrap.isChecked(),
            "cursor": self.editor.textCursor().position(),
            "scroll": self.editor.verticalScrollBar().value(),
            "font": self.editor.font().pointSizeF(),
        }


# ---------- okno główne ----------

class MainWindow(QMainWindow):
    COLS, ROWS = 3, 2

    def __init__(self, state_path: Path | None = None):
        super().__init__()
        self.setWindowTitle("Startup Board")
        self.state_path = state_path or self._default_state_path()
        self.panes = [TextPane(i) for i in range(self.COLS * self.ROWS)]
        self.current: TextPane = self.panes[0]

        self.outer = QSplitter(Qt.Orientation.Vertical)
        self.rows: list[QSplitter] = []
        for r in range(self.ROWS):
            row = QSplitter(Qt.Orientation.Horizontal)
            for c in range(self.COLS):
                row.addWidget(self.panes[r * self.COLS + c])
            self.rows.append(row)
            self.outer.addWidget(row)
        self.setCentralWidget(self.outer)
        for p in self.panes:
            p.activated.connect(self.set_current)

        for key, fn in (("Ctrl+O", lambda: self.current.ask_open()),
                        ("Ctrl+S", lambda: self.current.save()),
                        ("Ctrl+W", lambda: self.current.close_file()),
                        ("Ctrl+Shift+E", self.equalize)):
            QShortcut(QKeySequence(key), self, activated=fn)
        for i in range(len(self.panes)):
            QShortcut(QKeySequence(f"Alt+{i + 1}"), self,
                      activated=lambda i=i: self.panes[i].focus_editor())

        self.resize(1500, 900)
        self.load_state()
        self.set_current(self.current)
        self.timer = QTimer(self, interval=10_000)
        self.timer.timeout.connect(self.save_state)
        self.timer.start()

    @staticmethod
    def _default_state_path() -> Path:
        base = QStandardPaths.writableLocation(QStandardPaths.StandardLocation.AppConfigLocation)
        return Path(base) / "state.json"

    def set_current(self, pane: TextPane):
        self.current = pane
        for p in self.panes:
            p.set_active(p is pane)

    def equalize(self):
        self.outer.setSizes([1000] * self.ROWS)
        for row in self.rows:
            row.setSizes([1000] * self.COLS)

    # --- stan okna/paneli ---
    def save_state(self):
        data = {
            "version": STATE_VERSION,
            "geometry": base64.b64encode(bytes(self.saveGeometry())).decode(),
            "outer": self.outer.sizes(),
            "rows": [r.sizes() for r in self.rows],
            "current": self.current.index,
            "panes": [p.state() for p in self.panes],
        }
        try:
            self.state_path.parent.mkdir(parents=True, exist_ok=True)
            atomic_write(self.state_path, json.dumps(data, ensure_ascii=False, indent=1).encode())
        except OSError:
            pass

    def load_state(self):
        try:
            data = json.loads(self.state_path.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            self.equalize()
            return
        if data.get("geometry"):
            self.restoreGeometry(QByteArray(base64.b64decode(data["geometry"])))
        for p, st in zip(self.panes, data.get("panes", [])):
            if st.get("path"):
                p.open_file(st["path"], st, ask=False)
        self.show()  # rozmiary splitterów mają sens dopiero po pokazaniu okna
        QTimer.singleShot(0, lambda: self._apply_sizes(data))
        idx = data.get("current", 0)
        if 0 <= idx < len(self.panes):
            self.current = self.panes[idx]

    def _apply_sizes(self, data: dict):
        if data.get("outer"):
            self.outer.setSizes(data["outer"])
        for row, sz in zip(self.rows, data.get("rows", [])):
            row.setSizes(sz)

    def open_in_free_pane(self, path: str):
        for p in self.panes:
            if p.path is None:
                p.open_file(path, ask=False)
                return

    def closeEvent(self, e):
        for p in self.panes:
            if not p.confirm_close():
                e.ignore()
                return
        self.save_state()
        e.accept()


def main():
    app = QApplication(sys.argv)
    app.setApplicationName("StartupBoard")
    app.setOrganizationName("smialo")
    win = MainWindow()
    for arg in sys.argv[1:]:
        win.open_in_free_pane(arg)
    win.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
