#!/usr/bin/env bash
# ==============================================================================
# GrizzDog-jrCyberQuest — 1-Line Turnkey Installer for macOS (M4/M1-M3 & Intel)
# Butler Community College Cyber Faculty Research Project (Andover Campus)
# ==============================================================================
# Usage (Run this single command in macOS Terminal):
#   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/daTechGuy/GrizzDog-jrCyberQuest/main/setup_mac.sh)"
#
# Or run locally from cloned repo:
#   chmod +x setup_mac.sh && ./setup_mac.sh
# ==============================================================================

set -e

# ANSI Color formatting (Butler Purple & Gold)
CLR_RESET="\033[0m"
CLR_PURPLE="\033[1;35m"
CLR_GOLD="\033[1;33m"
CLR_CYAN="\033[1;36m"
CLR_GREEN="\033[1;32m"
CLR_RED="\033[1;31m"

echo -e "${CLR_PURPLE}"
cat << 'EOF'
   ____       _              ____                    _        ____ _                 
  / ___|_ __ (_)___________ |  _ \  ___   __ _      (_)_ __  / ___| |__   ___  _ __  
 | |  _| '__|| |_  /_  / _ \| | | |/ _ \ / _` |     | | '__|| |   | '_ \ / _ \| '_ \ 
 | |_| | |   | |/ / / / (_) | |_| | (_) | (_| |     | | |   | |___| | | | (_) | |_) |
  \____|_|   |_/___/___\___/|____/ \___/ \__, |    _/ |_|    \____|_| |_|\___/| .__/ 
                                         |___/    |__/                        |_|    
  Butler Community College — K-12 AI Cyber Red Team Lab (NSA/DHS CAE-CD Aligned)
EOF
echo -e "${CLR_GOLD}Turnkey Installer for macOS (Apple Silicon M4/M1-M3 & Intel)${CLR_RESET}"
echo "------------------------------------------------------------------"

# Step 1: Verify Operating System & Apple Silicon Architecture
OS_NAME="$(uname -s)"
if [ "$OS_NAME" != "Darwin" ]; then
    echo -e "${CLR_RED}[error] This script is optimized for macOS. Detected: ${OS_NAME}.${CLR_RESET}"
    echo "For Windows, double-click 'start.bat'. For Linux, run './start.sh'."
    exit 1
fi

ARCH="$(uname -m)"
echo -e "${CLR_CYAN}[1/6] Detected macOS on ${ARCH} architecture (Optimized for Apple Silicon M-series).${CLR_RESET}"

# Step 2: Ensure Homebrew is configured on PATH
BREW_BIN=""
if command -v brew >/dev/null 2>&1; then
    BREW_BIN="$(command -v brew)"
elif [ -x "/opt/homebrew/bin/brew" ]; then
    BREW_BIN="/opt/homebrew/bin/brew"
elif [ -x "/usr/local/bin/brew" ]; then
    BREW_BIN="/usr/local/bin/brew"
fi

if [ -z "$BREW_BIN" ]; then
    echo -e "${CLR_GOLD}[2/6] Homebrew not found. Installing Homebrew & Apple Command Line Tools...${CLR_RESET}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    if [ -x "/opt/homebrew/bin/brew" ]; then
        BREW_BIN="/opt/homebrew/bin/brew"
    elif [ -x "/usr/local/bin/brew" ]; then
        BREW_BIN="/usr/local/bin/brew"
    fi
    
    if [ -n "$BREW_BIN" ]; then
        SHELL_PROFILE="$HOME/.zprofile"
        if [ ! -f "$SHELL_PROFILE" ] || ! grep -q "brew shellenv" "$SHELL_PROFILE"; then
            echo "" >> "$SHELL_PROFILE"
            echo "eval \"\$($BREW_BIN shellenv)\"" >> "$SHELL_PROFILE"
        fi
        eval "$($BREW_BIN shellenv)"
    fi
else
    echo -e "${CLR_GREEN}[2/6] Homebrew found at ${BREW_BIN}.${CLR_RESET}"
    eval "$($BREW_BIN shellenv 2>/dev/null || true)"
fi

# Step 3: Verify Core Prerequisites (python3, git)
echo -e "${CLR_CYAN}[3/6] Verifying prerequisites (Python 3, Git)...${CLR_RESET}"
DEPS_TO_INSTALL=()
command -v python3 >/dev/null 2>&1 || DEPS_TO_INSTALL+=("python")
command -v git >/dev/null 2>&1 || DEPS_TO_INSTALL+=("git")

if [ ${#DEPS_TO_INSTALL[@]} -gt 0 ]; then
    echo "Installing missing packages via Homebrew: ${DEPS_TO_INSTALL[*]}"
    brew install "${DEPS_TO_INSTALL[@]}"
else
    echo -e "${CLR_GREEN}Python 3 and Git are installed.${CLR_RESET}"
fi

# Step 4: Clone or Verify GrizzDog-jrCyberQuest Repository
TARGET_DIR=""
if [ -f "app.py" ] && [ -f "static/index.html" ]; then
    TARGET_DIR="$(pwd)"
    echo -e "${CLR_GREEN}[4/6] Running inside repository: ${TARGET_DIR}${CLR_RESET}"
else
    TARGET_DIR="$HOME/GrizzDog-jrCyberQuest"
    echo -e "${CLR_CYAN}[4/6] Setting up repository at ${TARGET_DIR}...${CLR_RESET}"
    if [ -d "$TARGET_DIR/.git" ]; then
        echo "Existing repository detected. Fetching latest updates..."
        git -C "$TARGET_DIR" pull --ff-only || true
    else
        git clone https://github.com/daTechGuy/GrizzDog-jrCyberQuest.git "$TARGET_DIR"
    fi
    cd "$TARGET_DIR"
fi

# Step 5: Setup Python Virtual Environment (.venv) & Install Dependencies
echo -e "${CLR_CYAN}[5/6] Preparing Python virtual environment (.venv)...${CLR_RESET}"
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

.venv/bin/pip install --upgrade pip --quiet 2>/dev/null || true
.venv/bin/pip install -r requirements.txt --quiet
chmod +x start.sh 2>/dev/null || true
echo -e "${CLR_GREEN}Python dependencies installed successfully.${CLR_RESET}"

# Step 6: Create Desktop One-Click Launcher (Ideal for M4 Mac Mini Booth Kiosks)
if [ -d "$HOME/Desktop" ]; then
    DESKTOP_COMMAND="$HOME/Desktop/GrizzDog-jrCyberQuest.command"
    cat << LAUNCHER_EOF > "$DESKTOP_COMMAND"
#!/usr/bin/env bash
cd "$TARGET_DIR" || exit 1
./start.sh
LAUNCHER_EOF
    chmod +x "$DESKTOP_COMMAND"
    echo -e "${CLR_GREEN}[6/6] Created desktop shortcut: 'GrizzDog-jrCyberQuest.command' on Desktop.${CLR_RESET}"
else
    echo -e "${CLR_GREEN}[6/6] Environment configuration complete.${CLR_RESET}"
fi

# Port Information
PORT="5050"
if lsof -i :5050 >/dev/null 2>&1; then
    PORT="5051"
fi

echo ""
echo -e "${CLR_GREEN}==================================================================${CLR_RESET}"
echo -e "${CLR_PURPLE}🐾 GrizzDog-jrCyberQuest is installed and ready for action!${CLR_RESET}"
echo -e "${CLR_GREEN}==================================================================${CLR_RESET}"
echo ""
echo "To start the game anytime:"
echo -e "  1. Double-click ${CLR_GOLD}GrizzDog-jrCyberQuest.command${CLR_RESET} on your Desktop, OR"
echo -e "  2. Run in Terminal: ${CLR_CYAN}cd ${TARGET_DIR} && ./start.sh${CLR_RESET}"
echo ""
echo -e "Web App will launch at: ${CLR_GOLD}http://localhost:${PORT}${CLR_RESET}"
echo ""

# Interactive launch prompt if connected to terminal
LAUNCH_NOW=""
if [ -t 0 ] || [ -c /dev/tty ]; then
    read -r -p "Would you like to launch GrizzDog-jrCyberQuest right now? [Y/n] " LAUNCH_NOW </dev/tty || true
    if [[ "$LAUNCH_NOW" =~ ^[Nn] ]]; then
        echo "Exiting installer. Run './start.sh' or use the Desktop shortcut whenever you are ready!"
        exit 0
    else
        echo "Starting GrizzDog-jrCyberQuest..."
        exec ./start.sh
    fi
fi

