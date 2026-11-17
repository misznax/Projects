"""Buduje StartupBoard jako folder + ZIP (szybki start, bez rozpakowywania do TEMP).

Użycie:  python build_exe.py        (wymaga: pip install PySide6-Essentials pypdfium2 pyinstaller)
Wynik:   dist/StartupBoard_vX.Y.zip  (rozpakuj i uruchom StartupBoard/StartupBoard.exe)
"""
import shutil
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parent
subprocess.run(
    [sys.executable, "-m", "PyInstaller", "--noconfirm", "--clean", "--onedir", "--windowed",
     "--name", "StartupBoard", "--icon", str(root / "icon.ico"),
     "--collect-all", "pypdfium2", "--collect-all", "pypdfium2_raw",
     str(root / "src" / "startup_board.py")],
    check=True, cwd=root)
import re
ver = re.search(r'APP_VERSION = "(v[^"]+)"', (root / "src" / "startup_board.py").read_text("utf-8")).group(1)
zip_path = shutil.make_archive(str(root / "dist" / f"StartupBoard_{ver}"), "zip", root / "dist", "StartupBoard")
print("Gotowe:", zip_path)
