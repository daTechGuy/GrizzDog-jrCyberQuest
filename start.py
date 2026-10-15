#!/usr/bin/env python3
"""
GrizzDog-jrCyberQuest — Universal Launcher
Butler Community College Cyber Faculty Research Project
=======================================================
Launches the K-12 AI Red Team game and opens the browser.
"""

import sys
import os
import subprocess
import importlib.util

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = os.path.abspath(os.path.dirname(__file__))

def check_and_install_dependencies():
    missing = []
    for pkg in ["flask"]:
        if importlib.util.find_spec(pkg) is None:
            missing.append(pkg)
    if missing:
        print(f"[bootstrap] Missing required packages: {', '.join(missing)}")
        req_file = os.path.join(ROOT_DIR, "requirements.txt")
        if os.path.exists(req_file):
            print("[bootstrap] Installing dependencies from requirements.txt...")
            cmd = [sys.executable, "-m", "pip", "install", "-r", req_file, "--quiet"]
            try:
                subprocess.check_call(cmd)
                print("[bootstrap] Dependencies installed successfully.")
            except Exception as e:
                print(f"[bootstrap] Warning: Failed to auto-install dependencies: {e}")

def main():
    check_and_install_dependencies()
    import app
    app.main()

if __name__ == "__main__":
    main()

