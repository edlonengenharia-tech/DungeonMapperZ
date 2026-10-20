@echo off
chcp 65001 >nul
echo.
echo ========================================
echo  GERAR EXECUTAVEL - Dungeon Mapper
echo ========================================
echo.

REM Verificar Node.js
echo [1/4] Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js encontrado

REM Instalar dependencias
echo.
echo [2/4] Instalando dependencias...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)

call npm install --save-dev electron@latest electron-builder@latest
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar Electron
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas

REM Build do React
echo.
echo [3/4] Buildando o app React...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha no build do React
    pause
    exit /b 1
)

if not exist "dist\index.html" (
    echo [ERRO] Build do React nao foi gerado
    pause
    exit /b 1
)
echo [OK] Build do React concluido

REM Gerar executavel
echo.
echo [4/4] Gerando executavel Windows...
echo Isso pode demorar alguns minutos...
echo.

call npx electron-builder --win portable --config electron-builder-simple.yml
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Falha ao gerar executavel
    echo.
    echo Possiveis solucoes:
    echo 1. Execute: scripts\testar-config.bat
    echo 2. Verifique se ha espaco em disco
    echo 3. Tente executar como administrador
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  EXECUTAVEL GERADO COM SUCESSO!
echo ========================================
echo.
echo O arquivo esta em: release\
echo.

REM Abrir pasta release
if exist "release" (
    explorer release
)

pause
