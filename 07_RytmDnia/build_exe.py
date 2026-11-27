"""Buduje Rytm Dnia jako folder + ZIP (szybki start, bez rozpakowywania do TEMP).

Użycie:  python build_exe.py        (wymaga tylko: pip install pyinstaller - aplikacja nie ma innych zależności)
Wynik:   dist/RytmDnia_vX.YY.zip    (rozpakuj i uruchom RytmDnia/RytmDnia.exe)
"""
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parent
subprocess.run(
    [sys.executable, "-m", "PyInstaller", "--noconfirm", "--clean", "--onedir", "--windowed",
     "--name", "RytmDnia", "--icon", str(root / "icon.ico"),
     "--add-data", f"{root / 'icon.ico'}{os.pathsep}.",
     "--paths", str(root / "src"),
     str(root / "src" / "rytm_dnia.py")],
    check=True, cwd=root)
ver = re.search(r'APP_VERSION = "(v[^"]+)"', (root / "src" / "rytm_core.py").read_text("utf-8")).group(1)
zip_path = shutil.make_archive(str(root / "dist" / f"RytmDnia_{ver}"), "zip", root / "dist", "RytmDnia")
print("Gotowe:", zip_path)
