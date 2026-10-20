@echo off
echo ========================================
echo  Dungeon Mapper - Modo Desenvolvimento
echo ========================================
echo.

REM Start Vite dev server in background
echo Iniciando servidor Vite...
start /b npm run dev

REM Wait for Vite to start
echo Aguardando servidor Vite iniciar...
timeout /t 5 /nobreak >nul

REM Start Electron
echo Iniciando Electron...
npx cross-env NODE_ENV=development electron electron/main.dev.js

echo.
echo Servidor encerrado.
pause
