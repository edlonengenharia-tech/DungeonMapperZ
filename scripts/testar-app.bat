@echo off
chcp 65001 >nul
title Dungeon Mapper - Teste do App
color 0B

echo.
echo    ╔════════════════════════════════════════════════╗
echo    ║                                                ║
echo    ║     🏰 DUNGEON MAPPER - TESTE DO APP 🏰       ║
echo    ║                                                ║
echo    ╚════════════════════════════════════════════════╝
echo.
echo  Este script vai testar o app sem gerar executavel.
echo.

REM Verificar Node.js
echo  [1/5] Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  ❌ ERRO: Node.js nao encontrado!
    pause
    exit /b 1
)
echo  ✅ Node.js encontrado

REM Instalar dependencias
echo  [2/5] Instalando dependencias...
call npm install --silent --loglevel=error
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  ❌ ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo  ✅ Dependencias instaladas

REM Instalar Electron
echo  [3/5] Instalando Electron...
call npm install --save-dev electron@latest --silent --loglevel=error
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  ❌ ERRO: Falha ao instalar Electron
    pause
    exit /b 1
)
echo  ✅ Electron instalado

REM Build do React
echo  [4/5] Buildando o app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  ❌ ERRO: Falha no build
    pause
    exit /b 1
)
echo  ✅ Build concluido

REM Testar Electron
echo  [5/5] Iniciando o app...
echo.
echo  ═══════════════════════════════════════════════════
echo  O app vai abrir em uma nova janela.
echo  Feche a janela quando terminar o teste.
echo  ═══════════════════════════════════════════════════
echo.

npx electron electron/main.js

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo  ❌ ERRO: O app nao conseguiu iniciar
    echo.
    echo  Possiveis solucoes:
    echo  1. Verifique se o build foi feito corretamente
    echo  2. Execute: npm run build
    echo  3. Verifique se electron\main.js existe
    echo.
    pause
    exit /b 1
)

color 0A
echo.
echo  ═══════════════════════════════════════════════════
echo  ✅ TESTE CONCLUIDO COM SUCESSO!
echo  ═══════════════════════════════════════════════════
echo.
echo  O app funcionou corretamente!
echo.
echo  Para gerar o executavel, execute:
echo    scripts\criar-executavel.bat
echo.
pause
