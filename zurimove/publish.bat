@echo off
echo ==========================================
echo      ZuriMove Git Setup
echo ==========================================

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    pause
    exit /b 1
)

echo [1/5] Initializing repository...
git init

echo [2/5] Adding files...
git add .

echo [3/5] Committing...
git commit -m "Initial commit: ZuriMove Elite Project"

echo [4/5] Adding remote origin...
git remote add origin https://github.com/MajorMeddi/zurimove.git

echo [5/5] Pushing to GitHub...
echo Note: You may be prompted for your GitHub credentials.
git branch -M main
git push -u origin main

echo ==========================================
echo      Done!
echo ==========================================
pause
