# Dungeon Mapper

Create dungeons and battle maps for tabletop RPGs.

## Quick Start

### 1. Install Node.js

Download and install Node.js 18+ from: https://nodejs.org/

### 2. Test the App

Double-click: `test.bat`

This will:
- Install dependencies
- Install Electron
- Build the app
- Open the app in a window

If the app opens correctly, you can generate the executable.

### 3. Generate Executable

Double-click: `build.bat`

This will:
- Install all dependencies
- Build the React app
- Generate Windows executable

The executable will be in the `release/` folder.

## Scripts

- `build.bat` - Generate Windows executable
- `test.bat` - Test the app without generating executable

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Requirements

- Node.js 18+
- npm
- 2GB free disk space
- Internet connection (first build only)

## Troubleshooting

### "Node.js not found"
Install Node.js from https://nodejs.org/

### "Build failed"
Run `npm run build` to check for errors

### "Executable not generated"
1. Run `test.bat` first to verify the app works
2. Check you have 2GB+ free disk space
3. Try running as Administrator

### "App shows blank screen"
Run `npm run build` to rebuild the app

## Files

- `electron/main.js` - Electron main process
- `electron/preload.js` - Preload script
- `electron-builder.yml` - Build configuration
- `src/` - React source code
- `dist/` - Built app (generated)
- `release/` - Executable (generated)

## License

MIT
