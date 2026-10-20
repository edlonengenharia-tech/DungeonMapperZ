import { useState, useCallback, useEffect, useRef } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import TilePalette from './components/TilePalette';
import UVTTExportModal from './components/UVTTExportModal';
import MapSizeModal from './components/MapSizeModal';
import RandomDungeonModal from './components/RandomDungeonModal';
import ShowcaseModal from './components/ShowcaseModal';
import LightingPanel from './components/LightingPanel';
import StampPanel, { StampSettings } from './components/StampPanel';
import TextPanel from './components/TextPanel';
import { Tool, TileType, Token, TextObject, LightSource, StampItem, TILE_TYPES, TOKEN_COLORS, LIGHT_PRESETS } from './types';

interface TokenSettings {
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  label: string;
}

const DEFAULT_WIDTH = 30;
const DEFAULT_HEIGHT = 30;

function createEmptyGrid(width: number, height: number): (string | null)[][] {
  return Array.from({ length: height }, () => Array(width).fill(null));
}

export default function App() {
  const [grid, setGrid] = useState<(string | null)[][]>(createEmptyGrid(DEFAULT_WIDTH, DEFAULT_HEIGHT));
  const [tokens, setTokens] = useState<Token[]>([]);
  const [texts, setTexts] = useState<TextObject[]>([]);
  const [lights, setLights] = useState<LightSource[]>([]);
  const [stamps, setStamps] = useState<StampItem[]>([]);
  const [selectedTile, setSelectedTile] = useState<TileType>(TILE_TYPES[0]);
  const [tool, setTool] = useState<Tool>('pencil');
  const [gridSize, setGridSize] = useState(32);
  const [showGrid, setShowGrid] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [showMapSize, setShowMapSize] = useState(false);
  const [showRandomDungeon, setShowRandomDungeon] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [selectedLightId, setSelectedLightId] = useState<string | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [history, setHistory] = useState<(string | null)[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lightMode, setLightMode] = useState(false);
  const [cornerRadius, setCornerRadius] = useState(0);
  const [tokenSettings, setTokenSettings] = useState<TokenSettings>({
    color: TOKEN_COLORS[0],
    shape: 'circle',
    label: '',
  });
  const [stampSettings, setStampSettings] = useState<StampSettings>({
    symbol: '🌲',
    size: 24,
    rotation: 0,
    color: '#ffffff',
    opacity: 1,
    repeatSpeed: 2,
    randomSize: true,
    randomRotation: true,
    randomColor: false,
    snap: false,
  });
  const [textSettings, setTextSettings] = useState({
    fontSize: 14,
    color: '#ffffff',
    align: 'center' as 'left' | 'center' | 'right',
    shadow: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to history
  const pushHistory = useCallback((newGrid: (string | null)[][]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newGrid.map(row => [...row]));
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setGrid(history[historyIndex - 1].map(row => [...row]));
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setGrid(history[historyIndex + 1].map(row => [...row]));
    }
  }, [history, historyIndex]);

  useEffect(() => {
    if (history.length === 0) {
      setHistory([grid.map(row => [...row])]);
      setHistoryIndex(0);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo(); }
        if (e.key === 'y') { e.preventDefault(); redo(); }
        if (e.key === 's') { e.preventDefault(); handleSave(); }
        return;
      }
      switch (e.key.toLowerCase()) {
        case 'p': setTool('pencil'); break;
        case 'e': setTool('eraser'); break;
        case 'f': setTool('fill'); break;
        case 'r': setTool('rect'); break;
        case 't': setTool('token'); break;
        case 's': setTool('stamp'); break;
        case 'x': setTool('text'); break;
        case 'l': setTool('light'); break;
        case 'g': setShowGrid(prev => !prev); break;
        case 'n': setShowRandomDungeon(true); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleCellChange = useCallback((row: number, col: number) => {
    setGrid(prev => {
      const newGrid = prev.map(r => [...r]);
      if (tool === 'eraser') {
        newGrid[row][col] = null;
      } else {
        newGrid[row][col] = selectedTile.id;
      }
      pushHistory(newGrid);
      return newGrid;
    });
  }, [tool, selectedTile, pushHistory]);

  const handleCellDrag = useCallback((row: number, col: number) => {
    setGrid(prev => {
      const newGrid = prev.map(r => [...r]);
      if (tool === 'eraser') {
        newGrid[row][col] = null;
      } else {
        newGrid[row][col] = selectedTile.id;
      }
      return newGrid;
    });
  }, [tool, selectedTile]);

  const handleFloodFill = useCallback((startRow: number, startCol: number) => {
    setGrid(prev => {
      const newGrid = prev.map(r => [...r]);
      const targetColor = newGrid[startRow][startCol];
      const fillColor = tool === 'eraser' ? null : selectedTile.id;
      if (targetColor === fillColor) return prev;
      const stack: [number, number][] = [[startRow, startCol]];
      const visited = new Set<string>();
      while (stack.length > 0) {
        const [r, c] = stack.pop()!;
        const key = `${r},${c}`;
        if (visited.has(key)) continue;
        if (r < 0 || r >= newGrid.length || c < 0 || c >= newGrid[0].length) continue;
        if (newGrid[r][c] !== targetColor) continue;
        visited.add(key);
        newGrid[r][c] = fillColor;
        stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
      }
      pushHistory(newGrid);
      return newGrid;
    });
  }, [tool, selectedTile, pushHistory]);

  const handleRectDraw = useCallback((startRow: number, startCol: number, endRow: number, endCol: number, cr?: number) => {
    setGrid(prev => {
      const newGrid = prev.map(r => [...r]);
      const minR = Math.min(startRow, endRow);
      const maxR = Math.max(startRow, endRow);
      const minC = Math.min(startCol, endCol);
      const maxC = Math.max(startCol, endCol);
      const radius = cr || 0;

      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          // Handle corner radius
          if (radius > 0) {
            const inCorner = (
              (r < minR + radius && c < minC + radius) ||
              (r < minR + radius && c > maxC - radius) ||
              (r > maxR - radius && c < minC + radius) ||
              (r > maxR - radius && c > maxC - radius)
            );
            if (inCorner) {
              // Check if inside rounded corner
              let cx = 0, cy = 0;
              if (r < minR + radius && c < minC + radius) { cx = minC + radius; cy = minR + radius; }
              else if (r < minR + radius && c > maxC - radius) { cx = maxC - radius; cy = minR + radius; }
              else if (r > maxR - radius && c < minC + radius) { cx = minC + radius; cy = maxR - radius; }
              else { cx = maxC - radius; cy = maxR - radius; }
              const dist = Math.sqrt((r - cy) ** 2 + (c - cx) ** 2);
              if (dist > radius) continue;
            }
          }

          if (tool === 'eraser') {
            newGrid[r][c] = null;
          } else {
            newGrid[r][c] = selectedTile.id;
          }
        }
      }
      pushHistory(newGrid);
      return newGrid;
    });
  }, [tool, selectedTile, pushHistory]);

  const handleAddToken = useCallback((x: number, y: number) => {
    const newToken: Token = {
      id: `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x, y,
      color: tokenSettings.color,
      label: tokenSettings.label,
      size: 100,
      shape: tokenSettings.shape,
    };
    setTokens(prev => [...prev, newToken]);
    setSelectedTokenId(newToken.id);
  }, [tokenSettings]);

  const handleTokenMove = useCallback((tokenId: string, x: number, y: number) => {
    setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, x, y } : t));
  }, []);

  const handleRemoveToken = useCallback((id: string) => {
    setTokens(prev => prev.filter(t => t.id !== id));
    if (selectedTokenId === id) setSelectedTokenId(null);
  }, [selectedTokenId]);

  const handleUpdateToken = useCallback((id: string, updates: Partial<Token>) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  // Text handlers
  const handleAddText = useCallback((x: number, y: number) => {
    const newText: TextObject = {
      id: `text-${Date.now()}`,
      x, y,
      text: 'Texto',
      fontSize: textSettings.fontSize,
      color: textSettings.color,
      align: textSettings.align,
      shadow: textSettings.shadow,
    };
    setTexts(prev => [...prev, newText]);
    setSelectedTextId(newText.id);
  }, [textSettings]);

  const handleRemoveText = useCallback((id: string) => {
    setTexts(prev => prev.filter(t => t.id !== id));
    if (selectedTextId === id) setSelectedTextId(null);
  }, [selectedTextId]);

  const handleUpdateText = useCallback((id: string, updates: Partial<TextObject>) => {
    setTexts(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  // Light handlers
  const handleAddLight = useCallback((x: number, y: number) => {
    const preset = LIGHT_PRESETS.torch;
    const newLight: LightSource = {
      id: `light-${Date.now()}`,
      x, y,
      brightRadius: preset.brightRadius,
      dimRadius: preset.dimRadius,
      color: preset.color,
      type: 'torch',
    };
    setLights(prev => [...prev, newLight]);
    setSelectedLightId(newLight.id);
  }, []);

  const handleRemoveLight = useCallback((id: string) => {
    setLights(prev => prev.filter(l => l.id !== id));
    if (selectedLightId === id) setSelectedLightId(null);
  }, [selectedLightId]);

  const handleUpdateLight = useCallback((id: string, updates: Partial<LightSource>) => {
    setLights(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  // Stamp handlers
  const handleAddStamp = useCallback((x: number, y: number) => {
    const newStamp: StampItem = {
      id: `stamp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x, y,
      symbol: stampSettings.symbol,
      size: stampSettings.randomSize ? stampSettings.size + (Math.random() - 0.5) * 10 : stampSettings.size,
      rotation: stampSettings.randomRotation ? Math.random() * 360 : stampSettings.rotation,
      color: stampSettings.randomColor ? TOKEN_COLORS[Math.floor(Math.random() * TOKEN_COLORS.length)] : stampSettings.color,
      opacity: stampSettings.opacity,
    };
    setStamps(prev => [...prev, newStamp]);
  }, [stampSettings]);

  const handleRemoveStamp = useCallback((id: string) => {
    setStamps(prev => prev.filter(s => s.id !== id));
  }, []);

  const handleClear = useCallback(() => {
    if (confirm('Tem certeza que deseja limpar todo o mapa?')) {
      const newGrid = createEmptyGrid(grid[0].length, grid.length);
      setGrid(newGrid);
      setTokens([]);
      setTexts([]);
      setLights([]);
      setStamps([]);
      pushHistory(newGrid);
    }
  }, [grid, pushHistory]);

  const handleResize = useCallback((width: number, height: number) => {
    const newGrid = createEmptyGrid(width, height);
    for (let r = 0; r < Math.min(grid.length, height); r++) {
      for (let c = 0; c < Math.min(grid[0].length, width); c++) {
        newGrid[r][c] = grid[r][c];
      }
    }
    setGrid(newGrid);
    pushHistory(newGrid);
  }, [grid, pushHistory]);

  const handleGenerateDungeon = useCallback((newGrid: (string | null)[][]) => {
    setGrid(newGrid);
    setTokens([]);
    setTexts([]);
    setLights([]);
    setStamps([]);
    pushHistory(newGrid);
  }, [pushHistory]);

  const handleLoadShowcaseMap = useCallback((newGrid: (string | null)[][]) => {
    setGrid(newGrid);
    pushHistory(newGrid);
  }, [pushHistory]);

  const handleSave = useCallback(() => {
    const data = { grid, tokens, texts, lights, stamps, width: grid[0].length, height: grid.length, gridSize };
    localStorage.setItem('dungeon-map-save', JSON.stringify(data));
    alert('Mapa salvo com sucesso!');
  }, [grid, tokens, texts, lights, stamps, gridSize]);

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem('dungeon-map-save');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setGrid(data.grid);
        setTokens(data.tokens || []);
        setTexts(data.texts || []);
        setLights(data.lights || []);
        setStamps(data.stamps || []);
        if (data.gridSize) setGridSize(data.gridSize);
        pushHistory(data.grid);
      } catch {
        alert('Erro ao carregar o mapa.');
      }
    } else {
      fileInputRef.current?.click();
    }
  }, [pushHistory]);

  const handleFileLoad = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        setGrid(data.grid);
        setTokens(data.tokens || []);
        setTexts(data.texts || []);
        setLights(data.lights || []);
        setStamps(data.stamps || []);
        if (data.gridSize) setGridSize(data.gridSize);
        pushHistory(data.grid);
      } catch {
        alert('Arquivo inválido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [pushHistory]);

  // Get active panel content based on tool
  const getActivePanel = () => {
    switch (tool) {
      case 'light':
        return (
          <LightingPanel
            lights={lights}
            selectedLightId={selectedLightId}
            onSelectLight={setSelectedLightId}
            onRemoveLight={handleRemoveLight}
            onUpdateLight={handleUpdateLight}
            lightMode={lightMode}
            onToggleLightMode={() => setLightMode(!lightMode)}
          />
        );
      case 'stamp':
        return <StampPanel settings={stampSettings} setSettings={setStampSettings} />;
      case 'text':
        return (
          <TextPanel
            texts={texts}
            selectedTextId={selectedTextId}
            onSelectText={setSelectedTextId}
            onRemoveText={handleRemoveText}
            onUpdateText={handleUpdateText}
            defaultSettings={textSettings}
            setDefaultSettings={setTextSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f0f1a] overflow-hidden">
      {/* Header */}
      <div className="bg-[#12122a] border-b border-[#2a2a4a] px-4 py-2 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏰</span>
          <h1 className="text-lg font-bold text-white">
            Dungeon <span className="text-indigo-400">Mapper</span>
          </h1>
        </div>
        <span className="text-gray-500 text-sm hidden sm:inline">
          Crie masmorras e mapas de batalha para RPG
        </span>
        <div className="flex-1" />
        <button
          onClick={() => setShowRandomDungeon(true)}
          className="px-3 py-1.5 rounded-md text-sm bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-all"
          title="Gerar Masmorra Aleatória (N)"
        >
          🎲 Gerar
        </button>
        <button
          onClick={() => setShowShowcase(true)}
          className="px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          🖼️ Galeria
        </button>
        <button
          onClick={() => setShowMapSize(true)}
          className="px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          📐 Redimensionar
        </button>
        <span className="text-gray-500 text-xs">
          {grid[0]?.length}×{grid.length}
        </span>
      </div>

      {/* Toolbar */}
      <Toolbar
        tool={tool}
        setTool={setTool}
        gridSize={gridSize}
        setGridSize={setGridSize}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        onUndo={undo}
        onRedo={redo}
        onClear={handleClear}
        onExport={() => setShowExport(true)}
        onSave={handleSave}
        onLoad={handleLoad}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        cornerRadius={cornerRadius}
        setCornerRadius={setCornerRadius}
        lightMode={lightMode}
        setLightMode={setLightMode}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
          <Canvas
            grid={grid}
            tokens={tokens}
            texts={texts}
            lights={lights}
            stamps={stamps}
            selectedTile={selectedTile}
            tool={tool}
            gridSize={gridSize}
            onCellChange={handleCellChange}
            onCellDrag={handleCellDrag}
            onTokenMove={handleTokenMove}
            onAddToken={handleAddToken}
            onFloodFill={handleFloodFill}
            onRectDraw={handleRectDraw}
            onAddText={handleAddText}
            onAddLight={handleAddLight}
            onAddStamp={handleAddStamp}
            showGrid={showGrid}
            lightMode={lightMode}
            cornerRadius={cornerRadius}
            stampSettings={stampSettings}
          />

          {/* Quick Help */}
          <div className="absolute top-3 left-3 bg-black/50 text-gray-400 text-xs px-3 py-2 rounded-lg backdrop-blur-sm max-w-xs">
            <p><kbd className="bg-white/10 px-1 rounded">P</kbd> Lápis <kbd className="bg-white/10 px-1 rounded">E</kbd> Borracha <kbd className="bg-white/10 px-1 rounded">F</kbd> Preencher <kbd className="bg-white/10 px-1 rounded">R</kbd> Retângulo</p>
            <p><kbd className="bg-white/10 px-1 rounded">T</kbd> Token <kbd className="bg-white/10 px-1 rounded">S</kbd> Stamp <kbd className="bg-white/10 px-1 rounded">X</kbd> Texto <kbd className="bg-white/10 px-1 rounded">L</kbd> Luz</p>
            <p><kbd className="bg-white/10 px-1 rounded">N</kbd> Gerar Masmorra <kbd className="bg-white/10 px-1 rounded">G</kbd> Grade <kbd className="bg-white/10 px-1 rounded">Alt+Arrastar</kbd> Mover</p>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-64 bg-[#1a1a2e] border-l border-[#2a2a4a] flex flex-col overflow-hidden">
          <TilePalette
            selectedTile={selectedTile}
            setSelectedTile={setSelectedTile}
            tokens={tokens}
            onRemoveToken={handleRemoveToken}
            onUpdateToken={handleUpdateToken}
            selectedTokenId={selectedTokenId}
            setSelectedTokenId={setSelectedTokenId}
            tool={tool}
            tokenSettings={tokenSettings}
            setTokenSettings={setTokenSettings}
            stamps={stamps}
            onRemoveStamp={handleRemoveStamp}
          />

          {/* Active Tool Panel */}
          {(tool === 'light' || tool === 'stamp' || tool === 'text') && (
            <div className="border-t border-[#2a2a4a] overflow-y-auto p-3 max-h-[50vh]">
              {getActivePanel()}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <UVTTExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        grid={grid}
        tokens={tokens}
        lights={lights}
        texts={texts}
        stamps={stamps}
        gridSize={gridSize}
      />
      <MapSizeModal
        isOpen={showMapSize}
        onClose={() => setShowMapSize(false)}
        onConfirm={handleResize}
        currentWidth={grid[0]?.length || DEFAULT_WIDTH}
        currentHeight={grid.length || DEFAULT_HEIGHT}
      />
      <RandomDungeonModal
        isOpen={showRandomDungeon}
        onClose={() => setShowRandomDungeon(false)}
        onGenerate={handleGenerateDungeon}
      />
      <ShowcaseModal
        isOpen={showShowcase}
        onClose={() => setShowShowcase(false)}
        onLoadMap={handleLoadShowcaseMap}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileLoad}
        className="hidden"
      />
    </div>
  );
}
