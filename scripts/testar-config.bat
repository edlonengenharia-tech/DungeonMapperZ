@echo off
chcp 65001 >nul
echo.
echo ========================================
echo  TESTE DE DIAGNOSTICO - Dungeon Mapper
echo ========================================
echo.

REM Verificar Node.js
echo [1/7] Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% encontrado

REM Verificar npm
echo.
echo [2/7] Verificando npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] npm nao encontrado!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% encontrado

REM Verificar pasta dist
echo.
echo [3/7] Verificando build do React...
if not exist "dist\index.html" (
    echo [ERRO] Pasta dist nao encontrada!
    echo Executando build...
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Falha no build do React
        pause
        exit /b 1
    )
)
if exist "dist\index.html" (
    echo [OK] Build do React encontrado
) else (
    echo [ERRO] Build do React nao foi gerado
    pause
    exit /b 1
)

REM Verificar electron
echo.
echo [4/7] Verificando Electron...
if not exist "node_modules\electron" (
    echo [AVISO] Electron nao instalado. Instalando...
    call npm install --save-dev electron@latest
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Falha ao instalar Electron
        pause
        exit /b 1
    )
)
for /f "tokens=*" %%i in ('npx electron --version 2^>nul') do set ELECTRON_VERSION=%%i
if defined ELECTRON_VERSION (
    echo [OK] Electron %ELECTRON_VERSION% encontrado
) else (
    echo [AVISO] Electron instalado mas versao nao detectada
)

REM Verificar electron-builder
echo.
echo [5/7] Verificando electron-builder...
if not exist "node_modules\electron-builder" (
    echo [AVISO] electron-builder nao instalado. Instalando...
    call npm install --save-dev electron-builder@latest
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Falha ao instalar electron-builder
        pause
        exit /b 1
    )
)
echo [OK] electron-builder encontrado

REM Verificar arquivos do Electron
echo.
echo [6/7] Verificando arquivos do Electron...
if not exist "electron\main.js" (
    echo [ERRO] electron\main.js nao encontrado!
    pause
    exit /b 1
)
if not exist "electron\preload.js" (
    echo [ERRO] electron\preload.js nao encontrado!
    pause
    exit /b 1
)
echo [OK] Arquivos do Electron encontrados

REM Verificar configuracao
echo.
echo [7/7] Verificando configuracao...
if not exist "electron-builder.yml" (
    echo [ERRO] electron-builder.yml nao encontrado!
    pause
    exit /b 1
)
echo [OK] electron-builder.yml encontrado

echo.
echo ========================================
echo  DIAGNOSTICO CONCLUIDO!
echo ========================================
echo.
echo Todos os componentes estao prontos.
echo.
echo Para gerar o executavel, execute:
echo   scripts\build-executavel.bat
echo.
pause
