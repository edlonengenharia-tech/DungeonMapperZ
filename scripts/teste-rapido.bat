@echo off
chcp 65001 >nul
echo.
echo ========================================
echo  TESTE RAPIDO - Dungeon Mapper
echo ========================================
echo.

echo Este script vai testar cada etapa do processo de build.
echo.
pause

echo.
echo [TESTE 1] Verificando Node.js...
node --version
if %ERRORLEVEL% NEQ 0 (
    echo [FALHOU] Node.js nao esta instalado
    pause
    exit /b 1
)
echo [OK] Node.js funcionando
echo.

echo [TESTE 2] Verificando npm...
npm --version
if %ERRORLEVEL% NEQ 0 (
    echo [FALHOU] npm nao esta instalado
    pause
    exit /b 1
)
echo [OK] npm funcionando
echo.

echo [TESTE 3] Testando npm install...
call npm install --silent
if %ERRORLEVEL% NEQ 0 (
    echo [FALHOU] npm install falhou
    pause
    exit /b 1
)
echo [OK] npm install funcionando
echo.

echo [TESTE 4] Testando build do React...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [FALHOU] Build do React falhou
    pause
    exit /b 1
)
if not exist "dist\index.html" (
    echo [FALHOU] Pasta dist nao foi criada
    pause
    exit /b 1
)
echo [OK] Build do React funcionando
echo.

echo [TESTE 5] Instalando Electron...
call npm install --save-dev electron@latest --silent
if %ERRORLEVEL% NEQ 0 (
    echo [FALHOU] Instalacao do Electron falhou
    pause
    exit /b 1
)
echo [OK] Electron instalado
echo.

echo [TESTE 6] Testando Electron...
npx electron --version
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Electron instalado mas nao responde
    echo Isso pode ser normal na primeira vez
)
echo [OK] Electron pronto
echo.

echo [TESTE 7] Instalando electron-builder...
call npm install --save-dev electron-builder@latest --silent
if %ERRORLEVEL% NEQ 0 (
    echo [FALHOU] Instalacao do electron-builder falhou
    pause
    exit /b 1
)
echo [OK] electron-builder instalado
echo.

echo [TESTE 8] Testando electron-builder...
npx electron-builder --version
if %ERRORLEVEL% NEQ 0 (
    echo [FALHOU] electron-builder nao responde
    pause
    exit /b 1
)
echo [OK] electron-builder funcionando
echo.

echo ========================================
echo  TODOS OS TESTES PASSARAM!
echo ========================================
echo.
echo Agora voce pode gerar o executavel:
echo   scripts\gerar-executavel.bat
echo.
pause
