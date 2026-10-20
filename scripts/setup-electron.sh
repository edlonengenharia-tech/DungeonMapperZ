#!/bin/bash

echo "========================================"
echo " Dungeon Mapper - Setup Electron"
echo "========================================"
echo ""
echo "Este script irá:"
echo "1. Instalar todas as dependências"
echo "2. Configurar o Electron"
echo "3. Gerar o executável"
echo ""
read -p "Pressione ENTER para continuar..."

echo ""
echo "[1/4] Instalando dependências do projeto..."
npm install

echo ""
echo "[2/4] Instalando Electron e ferramentas de build..."
npm install --save-dev electron@latest electron-builder@latest concurrently@latest wait-on@latest cross-env@latest

echo ""
echo "[3/4] Verificando instalação..."
npx electron --version
if [ $? -ne 0 ]; then
    echo "[AVISO] Electron pode não ter sido instalado corretamente."
    echo "Tente rodar: npm install --save-dev electron"
fi

echo ""
echo "[4/4] Buildando o app..."
npm run build

echo ""
echo "========================================"
echo " SETUP CONCLUÍDO!"
echo "========================================"
echo ""
echo "Próximos passos:"
echo ""
echo "Para gerar o executável:"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "  npx electron-builder --mac --config electron-builder.yml"
else
    echo "  npx electron-builder --linux --config electron-builder.yml"
fi
echo ""
echo "Para modo desenvolvimento:"
echo "  Terminal 1: npm run dev"
echo "  Terminal 2: npx cross-env NODE_ENV=development electron electron/main.dev.js"
echo ""
echo "Para mais informações, leia: README-ELECTRON.md"
echo ""
