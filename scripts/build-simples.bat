@echo off
chcp 65001 >nul
echo.
echo ========================================
echo  BUILD SIMPLES - Dungeon Mapper
echo ========================================
echo.
echo Este script cria o executavel de forma simples.
echo.

REM Verificar Node.js
echo [1/5] Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    pause
    exit /b 1
)
echo [OK] Node.js encontrado

REM Instalar dependencias
echo.
echo [2/5] Instalando dependencias...
call npm install --silent
call npm install --save-dev electron@latest electron-builder@latest --silent
echo [OK] Dependencias instaladas

REM Build do React
echo.
echo [3/5] Buildando o app...
call npm run build
if not exist "dist\index.html" (
    echo [ERRO] Build falhou
    pause
    exit /b 1
)
echo [OK] Build concluido

REM Criar pasta do app
echo.
echo [4/5] Preparando arquivos...
if exist "app-build" rmdir /s /q "app-build"
mkdir "app-build"
mkdir "app-build\dist"
mkdir "app-build\electron"

REM Copiar arquivos
xcopy /e /i /q "dist\*" "app-build\dist\" >nul
xcopy /e /i /q "electron\*" "app-build\electron\" >nul
copy "package.json" "app-build\" >nul

REM Criar package.json simplificado para o app
echo { > "app-build\package.json"
echo   "name": "dungeon-mapper", >> "app-build\package.json"
echo   "version": "1.0.0", >> "app-build\package.json"
echo   "main": "electron/main.js", >> "app-build\package.json"
echo   "scripts": { >> "app-build\package.json"
echo     "start": "electron ." >> "app-build\package.json"
echo   } >> "app-build\package.json"
echo } >> "app-build\package.json"

echo [OK] Arquivos preparados

REM Gerar executavel com electron-packager (mais simples)
echo.
echo [5/5] Gerando executavel...
echo Instalando electron-packager...
call npm install --save-dev @electron/packager --silent

echo.
echo Gerando executavel Windows...
npx @electron/packager . "DungeonMapper" --platform=win32 --arch=x64 --out=release --overwrite --asar --ignore="(node_modules|scripts|electron-builder.*|README.*|GUIA.*)"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Falha ao gerar executavel
    echo.
    echo Tentando com electron-builder...
    call npx electron-builder --win portable --config electron-builder-simple.yml
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Ambos os metodos falharam
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo  EXECUTAVEL GERADO COM SUCESSO!
echo ========================================
echo.
echo O arquivo esta em: release\
echo.

if exist "release" (
    explorer release
)

pause
