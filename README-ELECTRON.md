# 🏰 Dungeon Mapper - App Desktop com Electron

Este documento contém instruções para criar o executável desktop do Dungeon Mapper usando Electron.

## 📋 Pré-requisitos

- **Node.js** 18+ instalado ([download](https://nodejs.org/))
- **npm** (vem com o Node.js)

## 🚀 Instalação Rápida

### Windows

1. Abra o Prompt de Comando (cmd) na pasta do projeto
2. Execute:
```bat
scripts\build-electron.bat
```

### Linux / macOS

1. Abra o terminal na pasta do projeto
2. Dê permissão de execução:
```bash
chmod +x scripts/build-electron.sh
```
3. Execute:
```bash
./scripts/build-electron.sh
```

## 📦 O que o script faz

1. Instala todas as dependências do projeto
2. Instala Electron e electron-builder
3. Faz o build do React (Vite)
4. Gera o executável na pasta `release/`

## 🖥️ Executáveis Gerados

Após o build, os arquivos estarão na pasta `release/`:

### Windows
- `Dungeon Mapper-Setup-X.X.X.exe` - Instalador NSIS
- `Dungeon Mapper-X.X.X.exe` - Versão portátil

### macOS
- `Dungeon Mapper-X.X.X.dmg` - Instalador DMG

### Linux
- `Dungeon Mapper-X.X.X.AppImage` - AppImage (portátil)
- `Dungeon Mapper-X.X.X.deb` - Pacote Debian/Ubuntu

## 🔧 Modo Desenvolvimento

Para rodar o app em modo desenvolvimento com hot-reload:

### Windows
```bat
scripts\dev-electron.bat
```

### Linux / macOS
```bash
# Terminal 1: Iniciar Vite
npm run dev

# Terminal 2: Iniciar Electron
npx cross-env NODE_ENV=development electron electron/main.dev.js
```

## 📁 Estrutura de Arquivos

```
├── electron/
│   ├── main.js          # Processo principal (produção)
│   ├── main.dev.js      # Processo principal (desenvolvimento)
│   └── preload.js       # Script de preload (segurança)
├── scripts/
│   ├── build-electron.bat    # Build Windows
│   ├── build-electron.sh     # Build Linux/Mac
│   └── dev-electron.bat      # Dev Windows
├── electron-builder.yml      # Configuração do builder
├── dist/                     # Build do React (gerado)
└── release/                  # Executáveis (gerado)
```

## ⚙️ Configurações Personalizáveis

Edite `electron-builder.yml` para personalizar:

- **appId**: Identificador único do app
- **productName**: Nome exibido
- **win.icon**: Ícone do Windows (.ico)
- **mac.icon**: Ícone do macOS (.icns)
- **linux.icon**: Ícone do Linux (pasta com ícones)

## 🎨 Adicionando Ícones

Para um app profissional, adicione ícones na pasta `build/`:

- `build/icon.ico` - Windows (256x256 ou múltiplos tamanhos)
- `build/icon.icns` - macOS
- `build/icons/` - Linux (icon.png, 16x16, 32x32, 64x64, 128x128, 256x256, 512x512)

## 🐛 Solução de Problemas

### "electron-builder não encontrado"
```bash
npm install --save-dev electron electron-builder
```

### Erro de permissão no Linux/Mac
```bash
chmod +x scripts/build-electron.sh
```

### App não abre após build
Verifique se o `dist/index.html` foi gerado corretamente:
```bash
npm run build
```

### Tela branca no Electron
Verifique o caminho do arquivo em `electron/main.js`:
```javascript
mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
```

## 📝 Comandos Úteis

```bash
# Build do React
npm run build

# Instalar Electron
npm install --save-dev electron electron-builder

# Build do executável Windows
npx electron-builder --win

# Build do executável Mac
npx electron-builder --mac

# Build do executável Linux
npx electron-builder --linux

# Build para todas as plataformas
npx electron-builder --win --mac --linux
```

## 🔐 Assinatura Digital (Opcional)

Para distribuir o app profissionalmente, considere assinar digitalmente:

### Windows
- Obter certificado code-signing
- Configurar no electron-builder.yml

### macOS
- Apple Developer Account
- Configurar notarization

## 📦 Distribuição

### Opção 1: GitHub Releases
1. Crie um release no GitHub
2. Anexe os executáveis da pasta `release/`

### Opção 2: Site próprio
1. Hospede os arquivos em um servidor
2. Configure auto-update no electron-builder.yml

### Opção 3: Microsoft Store / Mac App Store
1. Siga as diretrizes de cada loja
2. Use o electron-builder para gerar os pacotes necessários

## 🆘 Suporte

Se encontrar problemas:
1. Verifique a versão do Node.js (18+)
2. Delete `node_modules` e execute `npm install` novamente
3. Verifique se o `dist/` foi gerado corretamente
4. Consulte a documentação do [Electron](https://www.electronjs.org/) e [electron-builder](https://www.electron.build/)

---

**Dica**: Para testar rapidamente sem gerar o executável completo, use o modo desenvolvimento!
