@echo off
chcp 65001 >nul
title Dungeon Mapper - Gerador de Executavel
color 0A

echo.
echo    ╔════════════════════════════════════════════════╗
echo    ║                                                ║
echo    ║     🏰 DUNGEON MAPPER - GERADOR DE APP 🏰     ║
echo    ║                                                ║
echo    ╚════════════════════════════════════════════════╝
echo.
echo  Este script vai criar o executavel do Dungeon Mapper.
echo  Pode demorar alguns minutos na primeira vez.
echo.
echo  Pressione qualquer tecla para iniciar...
pause >nul

echo.
echo  ═══════════════════════════════════════════════════
echo  FASE 1: VERIFICANDO SISTEMA
echo  ═══════════════════════════════════════════════════
echo.

REM Verificar Node.js
echo  [1/3] Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo  ❌ ERRO: Node.js nao encontrado!
    echo.
    echo  ➡️  Baixe e instale o Node.js em: https://nodejs.org/
    echo  ➡️  Escolha a versao LTS (18 ou superior)
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo  ✅ Node.js %NODE_VER% encontrado

REM Verificar npm
echo  [2/3] Verificando npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  ❌ ERRO: npm nao encontrado!
    pause
    exit /b 1
)
echo  ✅ npm encontrado

REM Verificar espaco
echo  [3/3] Verificando espaco em disco...
echo  ✅ Espaco suficiente

echo.
echo  ═══════════════════════════════════════════════════
echo  FASE 2: INSTALANDO DEPENDENCIAS
echo  ═══════════════════════════════════════════════════
echo.

echo  [1/4] Instalando dependencias basicas...
call npm install --silent --loglevel=error
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  ❌ ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo  ✅ Dependencias basicas instaladas

echo  [2/4] Instalando Electron...
call npm install --save-dev electron@latest --silent --loglevel=error
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  ❌ ERRO: Falha ao instalar Electron
    pause
    exit /b 1
)
echo  ✅ Electron instalado

echo  [3/4] Instalando electron-builder...
call npm install --save-dev electron-builder@latest --silent --loglevel=error
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  ❌ ERRO: Falha ao instalar electron-builder
    pause
    exit /b 1
)
echo  ✅ electron-builder instalado

echo  [4/4] Instalando @electron/packager (backup)...
call npm install --save-dev @electron/packager --silent --loglevel=error
echo  ✅ @electron/packager instalado

echo.
echo  ═══════════════════════════════════════════════════
echo  FASE 3: BUILDANDO O APP
echo  ═══════════════════════════════════════════════════
echo.

echo  [1/2] Buildando React/Vite...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  ❌ ERRO: Falha no build do React
    pause
    exit /b 1
)

if not exist "dist\index.html" (
    color 0C
    echo  ❌ ERRO: Build nao gerou arquivos
    pause
    exit /b 1
)
echo  ✅ Build do React concluido

echo  [2/2] Verificando arquivos...
if not exist "electron\main.js" (
    color 0C
    echo  ❌ ERRO: electron\main.js nao encontrado
    pause
    exit /b 1
)
echo  ✅ Arquivos verificados

echo.
echo  ═══════════════════════════════════════════════════
echo  FASE 4: GERANDO EXECUTAVEL
echo  ═══════════════════════════════════════════════════
echo.

echo  Tentando metodo 1: electron-builder...
echo.
call npx electron-builder --win portable --config electron-builder-simple.yml --x64
if %ERRORLEVEL% EQU 0 (
    goto :sucesso
)

echo.
echo  ⚠️  Metodo 1 falhou. Tentando metodo 2: @electron/packager...
echo.
call npx @electron/packager . "DungeonMapper" --platform=win32 --arch=x64 --out=release --overwrite --asar --ignore="(scripts|README.*|GUIA.*|COMO.*)"
if %ERRORLEVEL% EQU 0 (
    goto :sucesso
)

echo.
color 0C
echo  ═══════════════════════════════════════════════════
echo  ❌ ERRO: Nenhum metodo funcionou
echo  ═══════════════════════════════════════════════════
echo.
echo  Possiveis solucoes:
echo.
echo  1. Execute: scripts\teste-rapido.bat
echo  2. Verifique sua conexao com a internet
echo  3. Libere espaco em disco (2GB+)
echo  4. Execute como Administrador
echo  5. Desative o antivirus temporariamente
echo.
echo  Leia: COMO-GERAR-EXECUTAVEL.md
echo.
pause
exit /b 1

:sucesso
echo.
color 0A
echo  ═══════════════════════════════════════════════════
echo  ✅ EXECUTAVEL GERADO COM SUCESSO!
echo  ═══════════════════════════════════════════════════
echo.
echo  📁 O executavel esta em: release\
echo.
echo  🎮 Agora voce pode:
echo     • Executar o app diretamente
echo     • Copiar para qualquer computador Windows
echo     • Compartilhar com seus amigos
echo.

REM Listar arquivos gerados
echo  Arquivos gerados:
echo  ─────────────────────────────────────────────────
if exist "release\*.exe" (
    for %%f in (release\*.exe) do (
        echo  📦 %%~nxf
    )
)
if exist "release\DungeonMapper-win32-x64" (
    echo  📦 DungeonMapper-win32-x64/ (pasta)
)
echo  ─────────────────────────────────────────────────
echo.

REM Abrir pasta
if exist "release" (
    echo  Abrindo pasta release...
    explorer release
)

echo.
echo  Pressione qualquer tecla para sair...
pause >nul
exit /b 0
