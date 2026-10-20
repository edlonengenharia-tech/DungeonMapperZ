@echo off
title Dungeon Mapper - Test
echo.
echo ================================================
echo   DUNGEON MAPPER - TEST
echo ================================================
echo.

echo [1/4] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
echo OK: Node.js found
echo.

echo [2/4] Installing dependencies...
call npm install --silent
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo OK: Dependencies installed
echo.

echo [3/4] Installing Electron...
call npm install --save-dev electron@latest --silent
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install Electron
    pause
    exit /b 1
)
echo OK: Electron installed
echo.

echo [4/4] Building app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo OK: Build completed
echo.

echo ================================================
echo   Starting app...
echo ================================================
echo.
echo Close the window when done testing.
echo.

npx electron electron/main.cjs

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: App failed to start
    pause
    exit /b 1
)

echo.
echo ================================================
echo   TEST PASSED!
echo ================================================
echo.
echo The app works correctly.
echo Now run: build.bat
echo.
pause
