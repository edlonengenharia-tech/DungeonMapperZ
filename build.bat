@echo off
title Dungeon Mapper - Build Executable
echo.
echo ================================================
echo   DUNGEON MAPPER - BUILD EXECUTABLE
echo ================================================
echo.
echo This script will create the Windows executable.
echo It may take 5-15 minutes the first time.
echo.

REM Check Node.js
echo [1/5] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo OK: Node.js found
echo.

REM Install dependencies
echo [2/5] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo OK: Dependencies installed
echo.

REM Install Electron
echo [3/5] Installing Electron...
call npm install --save-dev electron@latest electron-builder@latest
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install Electron
    pause
    exit /b 1
)
echo OK: Electron installed
echo.

REM Build React app
echo [4/5] Building React app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
if not exist "dist\index.html" (
    echo ERROR: dist/index.html not found
    pause
    exit /b 1
)
echo OK: Build completed
echo.

REM Generate executable
echo [5/5] Generating executable...
echo This may take several minutes...
echo.
call npx electron-builder --win portable --config electron-builder.yml
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to generate executable
    echo.
    echo Try running: test.bat
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   SUCCESS!
echo ================================================
echo.
echo The executable is in: release\
echo.

if exist "release" (
    explorer release
)

pause
