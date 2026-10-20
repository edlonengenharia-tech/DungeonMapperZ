# Dungeon Mapper

Crie masmorras e mapas de batalha para RPG de mesa.

## Como Usar

### 1. Testar o App (Recomendado Primeiro)

Execute:
```
test.bat
```

Isso vai:
- Instalar dependências
- Instalar Electron
- Buildar o app
- Abrir o app em uma janela

Se o app abrir corretamente, feche a janela e continue para o próximo passo.

### 2. Gerar o Executável

Execute:
```
build.bat
```

Isso vai:
- Instalar todas as dependências
- Buildar o app React
- Gerar o executável Windows

O executável estará na pasta `release/`.

## Requisitos

- Node.js 18+ (https://nodejs.org/)
- npm (vem com o Node.js)
- 2GB de espaço em disco
- Conexão com internet (apenas no primeiro build)

## Desenvolvimento

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

## Solução de Problemas

### "Node.js not found"
Instale o Node.js em https://nodejs.org/

### "Build failed"
Execute `npm run build` para ver os erros

### "Executable not generated"
1. Execute `test.bat` primeiro para verificar se o app funciona
2. Verifique se tem 2GB+ de espaço livre
3. Tente executar como Administrador

### "App shows blank screen"
Execute `npm run build` para rebuildar o app

## Estrutura do Projeto

```
├── build.bat              # Gerar executável
├── test.bat               # Testar app
├── package.json           # Dependências e scripts
├── electron-builder.yml   # Configuração do build
├── electron/
│   ├── main.js           # Processo principal do Electron
│   ├── main.dev.js       # Modo desenvolvimento
│   └── preload.js        # Script de preload
├── src/
│   ├── App.tsx           # Componente principal
│   ├── components/       # Componentes React
│   ├── types.ts          # Tipos TypeScript
│   └── utils/            # Funções utilitárias
├── dist/                 # Build do React (gerado)
└── release/              # Executável (gerado)
```

## Licença

MIT
