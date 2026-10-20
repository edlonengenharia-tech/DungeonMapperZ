# 🏰 Dungeon Mapper - Gerar Executável (Guia Definitivo)

## ⚡ Método Super Rápido (Recomendado)

### Passo 1: Executar o script automático

**Duplo clique em:**
```
scripts\gerar-executavel.bat
```

**OU** se preferir o método alternativo:
```
scripts\build-simples.bat
```

Pronto! O executável será gerado automaticamente na pasta `release\`

---

## 🔍 Se não funcionar, siga estes passos:

### 1. Teste a configuração

Execute:
```
scripts\teste-rapido.bat
```

Este script testa cada etapa e mostra exatamente onde está o problema.

### 2. Verifique os pré-requisitos

- ✅ **Node.js 18+** instalado? (https://nodejs.org/)
- ✅ **Espaço em disco** suficiente? (pelo menos 2GB)
- ✅ **Conexão com internet** ativa?

### 3. Limpe e reinstale

```bash
# Apagar caches
rmdir /s /q node_modules
rmdir /s /q dist
rmdir /s /q release
del package-lock.json

# Reinstalar tudo
npm install
npm install --save-dev electron@latest electron-builder@latest

# Build
npm run build

# Gerar executável
npx electron-builder --win portable --config electron-builder-simple.yml
```

---

## 🛠️ Métodos Alternativos

### Método 1: electron-builder (padrão)

```bash
npm install --save-dev electron electron-builder
npm run build
npx electron-builder --win portable --config electron-builder-simple.yml
```

### Método 2: @electron/packager (alternativo)

```bash
npm install --save-dev electron @electron/packager
npm run build
npx @electron/packager . "DungeonMapper" --platform=win32 --arch=x64 --out=release --overwrite --asar
```

### Método 3: Build manual (último recurso)

```bash
# 1. Instalar Electron globalmente
npm install -g electron

# 2. Build do React
npm run build

# 3. Copiar arquivos manualmente
mkdir app-final
xcopy /e dist app-final\dist
xcopy /e electron app-final\electron
copy package.json app-final\

# 4. Criar package.json simplificado
echo {"name":"dungeon-mapper","version":"1.0.0","main":"electron/main.js"} > app-final\package.json

# 5. Rodar o app
cd app-final
electron .
```

---

## 🐛 Solução de Problemas Comuns

### Problema: "electron não é reconhecido"

**Solução:**
```bash
npm install --save-dev electron@latest
```

### Problema: "electron-builder não é reconhecido"

**Solução:**
```bash
npm install --save-dev electron-builder@latest
```

### Problema: "Cannot find module 'electron'"

**Solução:**
```bash
# Limpar cache npm
npm cache clean --force

# Reinstalar
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Problema: "Build falhou" ou "dist não encontrado"

**Solução:**
```bash
# Verificar se o build funciona
npm run build

# Verificar se dist/index.html existe
dir dist\index.html
```

### Problema: "Erro ao gerar executável"

**Solução 1:** Usar configuração simples
```bash
npx electron-builder --win portable --config electron-builder-simple.yml
```

**Solução 2:** Usar @electron/packager
```bash
npm install --save-dev @electron/packager
npx @electron/packager . "DungeonMapper" --platform=win32 --arch=x64 --out=release --overwrite
```

### Problema: "Acesso negado" ou "Permissão negada"

**Solução:**
- Execute o CMD como Administrador
- Ou use: `scripts\gerar-executavel.bat` (clique direito → Executar como administrador)

### Problema: "Falta de espaço em disco"

**Solução:**
- Libere pelo menos 2GB de espaço
- Apague a pasta `node_modules` e reinstale
- Limpe o cache npm: `npm cache clean --force`

### Problema: "Timeout" ou "Download lento"

**Solução:**
```bash
# Usar mirror chinês (mais rápido no Brasil)
npm config set electron_mirror https://npmmirror.com/mirrors/electron/
npm config set electron_builder_binaries_mirror https://npmmirror.com/mirrors/electron-builder-binaries/

# Reinstalar
npm install --save-dev electron electron-builder
```

---

## 📋 Checklist Completo

Antes de gerar o executável, verifique:

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Electron instalado (`npm list electron`)
- [ ] electron-builder instalado (`npm list electron-builder`)
- [ ] Build do React feito (`npm run build`)
- [ ] Pasta `dist/index.html` existe
- [ ] Arquivos do Electron existem (`electron/main.js`, `electron/preload.js`)
- [ ] Espaço em disco suficiente (2GB+)
- [ ] Conexão com internet ativa

---

## 🎯 Comandos Úteis

```bash
# Ver versão do Node
node --version

# Ver versão do npm
npm --version

# Listar pacotes instalados
npm list --depth=0

# Verificar Electron
npx electron --version

# Verificar electron-builder
npx electron-builder --version

# Limpar cache
npm cache clean --force

# Reinstalar tudo
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

## 📞 Precisa de Ajuda?

Se nenhum dos métodos acima funcionar:

1. Execute `scripts\teste-rapido.bat` e envie o resultado
2. Verifique se o Node.js está na versão 18+
3. Tente em outro computador
4. Use o método manual (Método 3)

---

## ✅ Resultado Esperado

Após o build bem-sucedido, você terá:

```
release/
  └── DungeonMapper-Portable-1.0.0.exe  (aproximadamente 150-200MB)
```

Este é um arquivo `.exe` portátil que pode ser executado diretamente sem instalação!

---

**Dica:** O primeiro build pode demorar 5-10 minutos pois baixa o Electron (~150MB).
