# 🚀 Guia Rápido - Dungeon Mapper Desktop

## Como criar o executável em 3 passos simples:

### Passo 1: Preparar o ambiente

Certifique-se de ter o **Node.js 18+** instalado:
```bash
node --version  # Deve mostrar v18.x.x ou superior
```

Se não tiver, baixe em: https://nodejs.org/

### Passo 2: Executar o setup

**Windows:**
```bat
scripts\setup-electron.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/setup-electron.sh
./scripts/setup-electron.sh
```

### Passo 3: Gerar o executável

**Windows (.exe):**
```bash
npx electron-builder --win --config electron-builder.yml
```

**macOS (.dmg):**
```bash
npx electron-builder --mac --config electron-builder.yml
```

**Linux (.AppImage):**
```bash
npx electron-builder --linux --config electron-builder.yml
```

O executável estará na pasta `release/`! 🎉

---

## 🎮 Modo Desenvolvimento

Para testar o app sem gerar o executável:

**Windows:**
```bat
scripts\dev-electron.bat
```

**Linux/Mac:**
```bash
# Terminal 1
npm run dev

# Terminal 2
npx cross-env NODE_ENV=development electron electron/main.dev.js
```

---

## 📦 O que você precisa saber

### Arquivos criados:
- ✅ `electron/main.js` - Processo principal do Electron
- ✅ `electron/preload.js` - Script de preload seguro
- ✅ `electron-builder.yml` - Configuração do build
- ✅ `scripts/` - Scripts de automação
- ✅ `README-ELECTRON.md` - Documentação completa

### Correções aplicadas:
- ✅ **Limpar mapa** - Agora usa modal de confirmação customizado
- ✅ **Estrutura Electron** - Completa e funcional
- ✅ **Scripts de build** - Para Windows, Mac e Linux

---

## 🐛 Problemas comuns

### "electron não encontrado"
```bash
npm install --save-dev electron electron-builder
```

### Tela branca no app
Verifique se o build do React foi feito:
```bash
npm run build
```

### Erro de permissão (Linux/Mac)
```bash
chmod +x scripts/*.sh
```

---

## 📚 Mais informações

Para documentação completa, veja: `README-ELECTRON.md`

---

**Dica:** O primeiro build pode demorar alguns minutos pois baixa o Electron.
