#!/bin/bash

echo "========================================"
echo " Dungeon Mapper - Build Electron App"
echo "========================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "[ERRO] Node.js não encontrado!"
    echo "Por favor, instale o Node.js em https://nodejs.org/"
    exit 1
fi

echo "[1/5] Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao instalar dependências"
    exit 1
fi

echo ""
echo "[2/5] Instalando dependências do Electron..."
npm install --save-dev electron electron-builder concurrently wait-on cross-env
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao instalar dependências do Electron"
    exit 1
fi

echo ""
echo "[3/5] Buildando o app React (Vite)..."
npm run build
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao buildar o app React"
    exit 1
fi

echo ""
echo "[4/5] Verificando arquivos..."
if [ ! -f "dist/index.html" ]; then
    echo "[ERRO] Arquivo dist/index.html não encontrado!"
    exit 1
fi

echo ""
echo "[5/5] Gerando executável com Electron Builder..."

# Detect platform
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Plataforma: macOS"
    npx electron-builder --mac --config electron-builder.yml
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Plataforma: Linux"
    npx electron-builder --linux --config electron-builder.yml
else
    echo "Plataforma desconhecida: $OSTYPE"
    echo "Tentando build genérico..."
    npx electron-builder --config electron-builder.yml
fi

if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao gerar executável"
    exit 1
fi

echo ""
echo "========================================"
echo " BUILD CONCLUÍDO COM SUCESSO!"
echo "========================================"
echo ""
echo "O executável está em: release/"
echo ""
