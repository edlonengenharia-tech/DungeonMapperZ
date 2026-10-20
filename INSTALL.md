# Dungeon Mapper - Guia de Instalação

## ✅ Correções Aplicadas

### 1. Problema do "Limpar Mapa"
- **Corrigido**: Modal de confirmação customizado substituiu o `confirm()` nativo
- **Arquivo**: `src/components/ConfirmModal.tsx`

### 2. Erro do Electron Builder
- **Corrigido**: Adicionados campos obrigatórios no `package.json`:
  - `version`: "1.0.0"
  - `description`: "Create dungeons and battle maps for tabletop RPGs"
  - `author`: "Dungeon Mapper"
  - `main`: "electron/main.js"

### 3. Scripts Simplificados
- **Removidos**: Todos os scripts obsoletos com caracteres UTF-8
- **Criados**: Scripts limpos usando apenas ASCII puro

## 📦 Scripts Disponíveis

### test.bat
Testa o app sem gerar executável.
```
Duplo clique em: test.bat
```

### build.bat
Gera o executável Windows.
```
Duplo clique em: build.bat
```

## 🚀 Como Gerar o Executável

### Passo 1: Testar o App
```bash
test.bat
```
Se o app abrir corretamente, feche a janela.

### Passo 2: Gerar o Executável
```bash
build.bat
```
O executável estará em `release/DungeonMapper-Portable-1.0.0.exe`

## 📋 Estrutura Final

```
dungeon-mapper/
├── build.bat                  # Gerar executável
├── test.bat                   # Testar app
├── package.json               # Configuração (CORRIGIDO)
├── electron-builder.yml       # Configuração do build
├── electron/
│   ├── main.js               # Processo principal
│   ├── main.dev.js           # Modo dev
│   └── preload.js            # Preload script
├── src/
│   ├── App.tsx               # App principal
│   ├── components/
│   │   ├── ConfirmModal.tsx  # Modal de confirmação (NOVO)
│   │   ├── Canvas.tsx        # Canvas do mapa
│   │   ├── Toolbar.tsx       # Barra de ferramentas
│   │   └── ...               # Outros componentes
│   ├── types.ts              # Tipos TypeScript
│   └── utils/
│       └── dungeonGenerator.ts  # Gerador de masmorras
└── dist/                     # Build do React (gerado)
```

## 🎯 Funcionalidades Implementadas

### Ferramentas de Desenho
- ✏️ Lápis (P)
- 🧹 Borracha (E)
- 🪣 Preenchimento (F)
- ⬜ Retângulo com cantos arredondados (R)
- 🎯 Token (T)
- 🌲 Stamp (S)
- ✍️ Texto (X)
- 💡 Luz (L)

### Recursos Avançados
- 🎲 Gerador de Masmorra Aleatória (N)
- 💡 Sistema de Iluminação com raios brilhantes/dim
- 📤 Exportação UVTT (Universal VTT)
- 🖼️ Galeria de Mapas
- 🔒 Bloqueio de Objetos
- ↩️ Undo/Redo (Ctrl+Z / Ctrl+Y)
- 💾 Salvar/Carregar (Ctrl+S)

### Atalhos de Teclado
- P: Lápis
- E: Borracha
- F: Preencher
- R: Retângulo
- T: Token
- S: Stamp
- X: Texto
- L: Luz
- N: Gerar Masmorra
- G: Toggle Grade
- Ctrl+Z: Desfazer
- Ctrl+Y: Refazer
- Ctrl+S: Salvar

## 🔧 Comandos npm

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Testar com Electron
npm run electron:dev

# Gerar executável
npm run electron:build
```

## 📝 Notas Importantes

1. **Primeiro build demora**: O Electron baixa ~150MB na primeira vez
2. **Espaço necessário**: 2GB+ de espaço livre
3. **Node.js**: Versão 18+ obrigatória
4. **Internet**: Necessária apenas no primeiro build

## 🐛 Solução de Problemas

### "version is missed in package.json"
✅ **CORRIGIDO**: Campos adicionados ao package.json

### "Limpar mapa não funciona"
✅ **CORRIGIDO**: Modal customizado implementado

### "Caracteres estranhos nos scripts"
✅ **CORRIGIDO**: Scripts recriados com ASCII puro

### App não abre
```bash
npm run build
test.bat
```

### Executável não gera
```bash
# Limpar e reinstalar
rmdir /s /q node_modules
del package-lock.json
npm install
npm install --save-dev electron electron-builder
build.bat
```

## 📚 Documentação

- `README.md` - Instruções gerais
- Este arquivo - Guia de instalação e correções

---

**Status**: ✅ Todos os problemas corrigidos e testado com sucesso!
