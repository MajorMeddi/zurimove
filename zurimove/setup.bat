@echo off
echo ==========================================
echo      ZuriMove Project Setup Tool
echo ==========================================

REM Check if Node is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)

echo [2/3] Importing assets...
call node scripts/import-assets.mjs
if %errorlevel% neq 0 (
    echo [ERROR] Asset generation failed.
    pause
    exit /b 1
)

echo [3/3] Starting development server...
echo The app will be available at http://localhost:3000
call npm run dev

pause
