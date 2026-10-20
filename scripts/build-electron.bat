@echo off
echo ========================================
echo  Dungeon Mapper - Build Electron App
echo ========================================
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js em https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Instalando dependencias...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)

echo.
echo [2/5] Instalando dependencias do Electron...
call npm install --save-dev electron electron-builder concurrently wait-on cross-env
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependencias do Electron
    pause
    exit /b 1
)

echo.
echo [3/5] Buildando o app React (Vite)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao buildar o app React
    pause
    exit /b 1
)

echo.
echo [4/5] Verificando arquivos...
if not exist "dist\index.html" (
    echo [ERRO] Arquivo dist/index.html nao encontrado!
    pause
    exit /b 1
)

echo.
echo [5/5] Gerando executavel com Electron Builder...
call npx electron-builder --win --config electron-builder.yml
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao gerar executavel
    pause
    exit /b 1
)

echo.
echo ========================================
echo  BUILD CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo O executavel esta em: release\
echo.
pause
