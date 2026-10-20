# Dungeon Mapper - Guia de Instalação

## Correções Aplicadas

### 1. Problema do "Limpar Mapa"
- **Corrigido**: Modal de confirmação customizado substituiu o `confirm()` nativo
- **Arquivo**: `src/components/ConfirmModal.tsx`

### 2. Erro do Electron Builder
- **Corrigido**: Adicionados campos obrigatórios no `package.json`:
  - `version`: "1.0.0"
  - `description`: "Create dungeons and battle maps for tabletop RPGs"
  - `author`: "Dungeon Mapper"
  - `main`: "electron/main.cjs"

### 3. Erro de ES Module
- **Corrigido**: Arquivos do Electron renomeados de `.js` para `.cjs`
- **Motivo**: O `package.json` tem `"type": "module"` e o Electron usa `require()` (CommonJS)
- **Arquivos**:
  - `electron/main.cjs`
  - `electron/preload.cjs`
  - `electron/main.dev.cjs`

### 4. Scripts Simplificados
- **Removidos**: Todos os scripts obsoletos com caracteres UTF-8
- **Criados**: Scripts limpos usando apenas ASCII puro

## Scripts Disponiveis

### test.bat
Testa o app sem gerar executavel.
```
Duplo clique em: test.bat
```

### build.bat
Gera o executavel Windows.
```
Duplo clique em: build.bat
```

## Como Gerar o Executavel

### Passo 1: Testar o App
```bash
test.bat
```
Se o app abrir corretamente, feche a janela.

### Passo 2: Gerar o Executavel
```bash
build.bat
```
O executavel estara em `release/DungeonMapper-Portable-1.0.0.exe`

## Estrutura Final

```
dungeon-mapper/
├── build.bat                  # Gerar executavel
├── test.bat                   # Testar app
├── package.json               # Configuracao (CORRIGIDO)
├── electron-builder.yml       # Configuracao do build
├── electron/
│   ├── main.cjs              # Processo principal (CommonJS)
│   ├── main.dev.cjs          # Modo dev (CommonJS)
│   └── preload.cjs           # Preload script (CommonJS)
├── src/
│   ├── App.tsx               # App principal
│   ├── components/
│   │   ├── ConfirmModal.tsx  # Modal de confirmacao (NOVO)
│   │   ├── Canvas.tsx        # Canvas do mapa
│   │   ├── Toolbar.tsx       # Barra de ferramentas
│   │   └── ...               # Outros componentes
│   ├── types.ts              # Tipos TypeScript
│   └── utils/
│       └── dungeonGenerator.ts  # Gerador de masmorras
└── dist/                     # Build do React (gerado)
```

## Funcionalidades Implementadas

### Ferramentas de Desenho
- Lapiz (P)
- Borracha (E)
- Preenchimento (F)
- Retangulo com cantos arredondados (R)
- Token (T)
- Stamp (S)
- Texto (X)
- Luz (L)

### Recursos Avancados
- Gerador de Masmorra Aleatoria (N)
- Sistema de Iluminacao com raios brilhantes/dim
- Exportacao UVTT (Universal VTT)
- Galeria de Mapas
- Bloqueio de Objetos
- Undo/Redo (Ctrl+Z / Ctrl+Y)
- Salvar/Carregar (Ctrl+S)

### Atalhos de Teclado
- P: Lapiz
- E: Borracha
- F: Preencher
- R: Retangulo
- T: Token
- S: Stamp
- X: Texto
- L: Luz
- N: Gerar Masmorra
- G: Toggle Grade
- Ctrl+Z: Desfazer
- Ctrl+Y: Refazer
- Ctrl+S: Salvar

## Comandos npm

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para producao
npm run build

# Testar com Electron
npm run electron:dev

# Gerar executavel
npm run electron:build
```

## Notas Importantes

1. **Primeiro build demora**: O Electron baixa ~150MB na primeira vez
2. **Espaco necessario**: 2GB+ de espaco livre
3. **Node.js**: Versao 18+ obrigatoria
4. **Internet**: Necessaria apenas no primeiro build

## Solucao de Problemas

### "require is not defined in ES module scope"
**CORRIGIDO**: Arquivos do Electron renomeados para `.cjs`

### "version is missed in package.json"
**CORRIGIDO**: Campos adicionados ao package.json

### "Limpar mapa nao funciona"
**CORRIGIDO**: Modal customizado implementado

### "Caracteres estranhos nos scripts"
**CORRIGIDO**: Scripts recriados com ASCII puro

### App nao abre
```bash
npm run build
test.bat
```

### Executavel nao gera
```bash
# Limpar e reinstalar
rmdir /s /q node_modules
del package-lock.json
npm install
npm install --save-dev electron electron-builder
build.bat
```

## Documentacao

- `README.md` - Instrucoes gerais
- Este arquivo - Guia de instalacao e correcoes

---

**Status**: Todos os problemas corrigidos e testado com sucesso!
