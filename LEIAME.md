# 🏰 Dungeon Mapper - Gerar Executável (GUIA SIMPLES)

## ⚡ PASSO A PASSO (3 CLIQUES)

### 1️⃣ Instalar Node.js (se ainda não tiver)
- Baixe em: https://nodejs.org/
- Instale a versão LTS (18 ou superior)
- Clique em "Next" até terminar

### 2️⃣ Executar o script automático
- Vá na pasta `scripts\`
- **Duplo clique em: `criar-executavel.bat`**
- Aguarde (pode demorar 5-10 minutos na primeira vez)

### 3️⃣ Pronto!
- O executável estará na pasta `release\`
- É só executar o arquivo `.exe`

---

## 🧪 TESTAR ANTES DE GERAR

Se quiser testar o app antes de gerar o executável:

**Duplo clique em:** `scripts\testar-app.bat`

Isso vai abrir o app em uma janela. Se funcionar, pode gerar o executável!

---

## ❌ SE NÃO FUNCIONAR

### Opção 1: Script de diagnóstico
**Duplo clique em:** `scripts\teste-rapido.bat`

Este script testa cada etapa e mostra onde está o problema.

### Opção 2: Limpar e reinstalar
```bash
# Apagar tudo
rmdir /s /q node_modules
rmdir /s /q dist
del package-lock.json

# Reinstalar
npm install
npm install --save-dev electron electron-builder

# Build
npm run build

# Gerar executável
scripts\criar-executavel.bat
```

### Opção 3: Método alternativo
**Duplo clique em:** `scripts\build-simples.bat`

Este usa um método diferente (@electron/packager) que pode funcionar se o primeiro falhar.

---

## 📋 PROBLEMAS COMUNS

### "Node.js não encontrado"
➡️ Instale o Node.js em https://nodejs.org/

### "Falha ao instalar dependências"
➡️ Verifique sua conexão com a internet
➡️ Tente executar como Administrador

### "Build falhou"
➡️ Execute: `npm run build`
➡️ Verifique se há espaço em disco (2GB+)

### "Erro ao gerar executável"
➡️ Execute: `scripts\teste-rapido.bat`
➡️ Tente: `scripts\build-simples.bat`
➡️ Desative o antivirus temporariamente

### "Tela branca ao abrir o app"
➡️ Execute: `npm run build`
➡️ Verifique se a pasta `dist\` foi criada

---

## 🎯 COMANDOS MANUAIS (se os scripts não funcionarem)

```bash
# 1. Instalar tudo
npm install
npm install --save-dev electron electron-builder

# 2. Build do React
npm run build

# 3. Gerar executável (método 1)
npx electron-builder --win portable --config electron-builder-simple.yml

# OU (método 2 - se o primeiro falhar)
npm install --save-dev @electron/packager
npx @electron/packager . "DungeonMapper" --platform=win32 --arch=x64 --out=release --overwrite
```

---

## ✅ RESULTADO ESPERADO

Após o build, você terá na pasta `release\`:

```
release/
  └── DungeonMapper-Portable-1.0.0.exe  (150-200MB)
```

Este é um arquivo `.exe` portátil que funciona sem instalação!

---

## 📞 PRECISA DE AJUDA?

1. Execute `scripts\teste-rapido.bat` e veja o resultado
2. Leia `COMO-GERAR-EXECUTAVEL.md` para mais detalhes
3. Verifique se o Node.js está na versão 18+

---

**DICA:** O primeiro build demora porque baixa o Electron (~150MB). Depois é mais rápido!
