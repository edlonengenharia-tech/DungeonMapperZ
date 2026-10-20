# Dungeon Mapper

Crie masmorras e mapas de batalha para RPG de mesa.

## Como Usar

### 1. Testar o App (Recomendado Primeiro)

Execute:
```
test.bat
```

Isso vai:
- Instalar dependencias
- Instalar Electron
- Buildar o app
- Abrir o app em uma janela

Se o app abrir corretamente, feche a janela e continue para o proximo passo.

### 2. Gerar o Executavel

Execute:
```
build.bat
```

Isso vai:
- Instalar todas as dependencias
- Buildar o app React
- Gerar o executavel Windows

O executavel estara na pasta `release/`.

## Requisitos

- Node.js 18+ (https://nodejs.org/)
- npm (vem com o Node.js)
- 2GB de espaco em disco
- Conexao com internet (apenas no primeiro build)

## Desenvolvimento

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

## Solucao de Problemas

### "Node.js not found"
Instale o Node.js em https://nodejs.org/

### "Build failed"
Execute `npm run build` para ver os erros

### "Executable not generated"
1. Execute `test.bat` primeiro para verificar se o app funciona
2. Verifique se tem 2GB+ de espaco livre
3. Tente executar como Administrador

### "App shows blank screen"
Execute `npm run build` para rebuildar o app

### "require is not defined in ES module scope"
Os arquivos do Electron foram renomeados para `.cjs` para resolver este problema.

## Estrutura do Projeto

```
├── build.bat              # Gerar executavel
├── test.bat               # Testar app
├── package.json           # Dependencias e scripts
├── electron-builder.yml   # Configuracao do build
├── electron/
│   ├── main.cjs          # Processo principal do Electron (CommonJS)
│   ├── main.dev.cjs      # Modo desenvolvimento (CommonJS)
│   └── preload.cjs       # Script de preload (CommonJS)
├── src/
│   ├── App.tsx           # Componente principal
│   ├── components/       # Componentes React
│   ├── types.ts          # Tipos TypeScript
│   └── utils/            # Funcoes utilitarias
├── dist/                 # Build do React (gerado)
└── release/              # Executavel (gerado)
```

## Licenca

MIT
