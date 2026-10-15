@echo off
rem =============================================================================
rem GrizzDog-jrCyberQuest: K-12 AI Red Team Lab (Windows Launcher)
rem Butler Community College Cyber Faculty Research Project (Andover Campus)
rem =============================================================================
setlocal
cd /d "%~dp0"

rem 1. Check local virtual environment
if exist ".venv\Scripts\python.exe" goto use_local_venv

rem 2. Check sibling GrizzDog-AI virtual environment (instant reuse at booth)
if exist "..\GrizzDog-AI\.venv\Scripts\python.exe" goto use_sibling_venv

rem 3. Check system Python
where python >nul 2>nul
if %errorlevel%==0 goto bootstrap_python

where py >nul 2>nul
if %errorlevel%==0 goto bootstrap_py

echo [ERROR] Python 3 was not found. Please install Python 3.10+ from https://www.python.org/
pause
exit /b 1

:bootstrap_python
echo [bootstrap] Creating local Python virtual environment (.venv)...
python -m venv .venv
if exist ".venv\Scripts\pip.exe" (
    echo [bootstrap] Installing requirements...
    ".venv\Scripts\pip.exe" install -r requirements.txt --quiet
    goto use_local_venv
)
python start.py %*
exit /b %errorlevel%

:bootstrap_py
echo [bootstrap] Creating local Python virtual environment (.venv)...
py -3 -m venv .venv
if exist ".venv\Scripts\pip.exe" (
    echo [bootstrap] Installing requirements...
    ".venv\Scripts\pip.exe" install -r requirements.txt --quiet
    goto use_local_venv
)
py -3 start.py %*
exit /b %errorlevel%

:use_sibling_venv
echo [info] Using existing GrizzDog virtual environment (..\GrizzDog-AI\.venv)
"..\GrizzDog-AI\.venv\Scripts\python.exe" start.py %*
exit /b %errorlevel%

:use_local_venv
".venv\Scripts\python.exe" start.py %*
exit /b %errorlevel%

