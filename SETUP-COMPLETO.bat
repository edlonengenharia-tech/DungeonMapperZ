@echo off
chcp 65001 >nul
title Dungeon Mapper - SETUP COMPLETO
color 0E

echo.
echo    ╔════════════════════════════════════════════════╗
echo    ║                                                ║
echo    ║   🏰 DUNGEON MAPPER - SETUP COMPLETO 🏰       ║
echo    ║                                                ║
echo    ║   Este script faz TUDO automaticamente!        ║
echo    ║                                                ║
echo    ╚════════════════════════════════════════════════╝
echo.
echo  O que este script vai fazer:
echo.
echo  ✓ Verificar se o Node.js esta instalado
echo  ✓ Instalar todas as dependencias
echo  ✓ Instalar Electron e electron-builder
echo  ✓ Buildar o app React
echo  ✓ Gerar o executavel Windows
echo.
echo  Tempo estimado: 5-15 minutos (depende da internet)
echo.
echo  ═══════════════════════════════════════════════════
echo.

REM Verificar Node.js
echo  [1/6] Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo  ╔════════════════════════════════════════════════╗
    echo  ║  ❌ ERRO: Node.js nao encontrado!             ║
    echo  ╚════════════════════════════════════════════════╝
    echo.
    echo  ➡️  BAIXE O NODE.JS AGORA:
    echo.
    echo     https://nodejs.org/
    echo.
    echo  ➡️  Instale a versao LTS (18 ou superior)
    echo  ➡️  Depois execute este script novamente
    echo.
    echo  Pressione qualquer tecla para abrir o site...
    pause >nul
    start https://nodejs.org/
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo  ✅ Node.js %NODE_VER% encontrado
echo.

REM Limpar caches antigos
echo  [2/6] Limpando caches antigos...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache" 2>nul
echo  ✅ Caches limpos
echo.

REM Instalar dependencias
echo  [3/6] Instalando dependencias (pode demorar)...
call npm install --loglevel=error
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo  ❌ ERRO: Falha ao instalar dependencias
    echo.
    echo  Tente:
    echo  1. Verificar conexao com internet
    echo  2. Executar como Administrador
    echo  3. Desativar antivirus temporariamente
    echo.
    pause
    exit /b 1
)
echo  ✅ Dependencias instaladas
echo.

REM Instalar Electron
echo  [4/6] Instalando Electron (download ~150MB)...
call npm install --save-dev electron@latest --loglevel=error
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo  ❌ ERRO: Falha ao instalar Electron
    echo.
    echo  Tente novamente. Se persistir:
    echo  npm install --save-dev electron@latest
    echo.
    pause
    exit /b 1
)
echo  ✅ Electron instalado
echo.

REM Instalar electron-builder
echo  [5/6] Instalando electron-builder...
call npm install --save-dev electron-builder@latest --loglevel=error
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo  ❌ ERRO: Falha ao instalar electron-builder
    pause
    exit /b 1
)
echo  ✅ electron-builder instalado
echo.

REM Build do React
echo  [6/6] Buildando o app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo  ❌ ERRO: Falha no build do React
    pause
    exit /b 1
)

if not exist "dist\index.html" (
    color 0C
    echo.
    echo  ❌ ERRO: Build nao gerou arquivos
    pause
    exit /b 1
)
echo  ✅ Build concluido
echo.

echo  ═══════════════════════════════════════════════════
echo  AGORA VAMOS GERAR O EXECUTAVEL
echo  ═══════════════════════════════════════════════════
echo.

REM Gerar executavel
echo  Gerando executavel Windows...
echo  (Isso pode demorar alguns minutos)
echo.

call npx electron-builder --win portable --config electron-builder-simple.yml --x64
if %ERRORLEVEL% EQU 0 (
    goto :sucesso
)

echo.
echo  ⚠️  Metodo 1 falhou. Tentando metodo alternativo...
echo.

call npm install --save-dev @electron/packager --loglevel=error
call npx @electron/packager . "DungeonMapper" --platform=win32 --arch=x64 --out=release --overwrite --asar
if %ERRORLEVEL% EQU 0 (
    goto :sucesso
)

echo.
color 0C
echo  ╔════════════════════════════════════════════════╗
echo  ║  ❌ ERRO: Nao foi possivel gerar o executavel  ║
echo  ╚════════════════════════════════════════════════╝
echo.
echo  Possiveis solucoes:
echo.
echo  1. Execute: scripts\teste-rapido.bat
echo  2. Verifique espaco em disco (2GB+)
echo  3. Execute como Administrador
echo  4. Desative o antivirus
echo  5. Leia: COMO-GERAR-EXECUTAVEL.md
echo.
pause
exit /b 1

:sucesso
echo.
color 0A
echo  ╔════════════════════════════════════════════════╗
echo  ║                                                ║
echo  ║   ✅ EXECUTAVEL GERADO COM SUCESSO!           ║
echo  ║                                                ║
echo  ╚════════════════════════════════════════════════╝
echo.
echo  📁 O executavel esta em: release\
echo.
echo  🎮 Proximos passos:
echo.
echo  1. Abra a pasta release\
echo  2. Execute o arquivo .exe
echo  3. Divirta-se criando masmorras!
echo.

REM Listar arquivos
echo  Arquivos gerados:
echo  ─────────────────────────────────────────────────
if exist "release\*.exe" (
    for %%f in (release\*.exe) do (
        echo  📦 %%~nxf
    )
)
if exist "release\DungeonMapper-win32-x64" (
    echo  📦 DungeonMapper-win32-x64\ (pasta)
)
echo  ─────────────────────────────────────────────────
echo.

REM Abrir pasta
if exist "release" (
    echo  Abrindo pasta release...
    explorer release
)

echo.
echo  ═══════════════════════════════════════════════════
echo.
echo  Obrigado por usar o Dungeon Mapper! 🏰
echo.
echo  Pressione qualquer tecla para sair...
pause >nul
exit /b 0
