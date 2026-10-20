@echo off
echo ========================================
echo  Dungeon Mapper - Setup Electron
echo ========================================
echo.
echo Este script ira:
echo 1. Instalar todas as dependencias
echo 2. Configurar o Electron
echo 3. Gerar o executavel
echo.
pause

echo.
echo [1/4] Instalando dependencias do projeto...
call npm install

echo.
echo [2/4] Instalando Electron e ferramentas de build...
call npm install --save-dev electron@latest electron-builder@latest concurrently@latest wait-on@latest cross-env@latest

echo.
echo [3/4] Verificando instalacao...
npx electron --version
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Electron pode nao ter sido instalado corretamente.
    echo Tente rodar: npm install --save-dev electron
)

echo.
echo [4/4] Buildando o app...
call npm run build

echo.
echo ========================================
echo  SETUP CONCLUIDO!
echo ========================================
echo.
echo Proximos passos:
echo.
echo Para gerar o executavel:
echo   npx electron-builder --win --config electron-builder.yml
echo.
echo Para modo desenvolvimento:
echo   scripts\dev-electron.bat
echo.
echo Para mais informacoes, leia: README-ELECTRON.md
echo.
pause
