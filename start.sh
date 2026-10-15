#!/usr/bin/env sh
# =============================================================================
# GrizzDog-jrCyberQuest: K-12 AI Red Team Lab (Mac & Linux Launcher)
# Butler Community College Cyber Faculty Research Project (Andover Campus)
# =============================================================================
cd "$(dirname "$0")" || exit 1

# Ensure Homebrew environment is available on macOS if installed
if [ -x "/opt/homebrew/bin/brew" ]; then
    eval "$(/opt/homebrew/bin/brew shellenv 2>/dev/null)"
elif [ -x "/usr/local/bin/brew" ]; then
    eval "$(/usr/local/bin/brew shellenv 2>/dev/null)"
fi

# Locate Python 3 binary
PYTHON_BIN=""
if [ -x ".venv/bin/python" ]; then
    PYTHON_BIN=".venv/bin/python"
elif [ -x "../GrizzDog-AI/.venv/bin/python" ]; then
    PYTHON_BIN="../GrizzDog-AI/.venv/bin/python"
elif command -v python3 >/dev/null 2>&1; then
    PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_BIN="python"
fi

if [ -z "$PYTHON_BIN" ]; then
    echo "[ERROR] Python 3 was not found. Install it from https://www.python.org/ or via 'brew install python'" >&2
    exit 1
fi

# Auto-bootstrap virtual environment if missing and not using sibling venv
if [ ! -x ".venv/bin/python" ] && [ ! -x "../GrizzDog-AI/.venv/bin/python" ]; then
    echo "[bootstrap] Setting up local Python virtual environment (.venv)..."
    "$PYTHON_BIN" -m venv .venv
    if [ -x ".venv/bin/pip" ]; then
        echo "[bootstrap] Installing dependencies from requirements.txt..."
        .venv/bin/pip install --upgrade pip --quiet 2>/dev/null || true
        .venv/bin/pip install -r requirements.txt --quiet
        PYTHON_BIN=".venv/bin/python"
    fi
fi

# Launch
exec "$PYTHON_BIN" start.py "$@"

