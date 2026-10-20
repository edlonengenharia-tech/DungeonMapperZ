import { Tool } from '../types';

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExport: () => void;
  onSave: () => void;
  onLoad: () => void;
  canUndo: boolean;
  canRedo: boolean;
  cornerRadius: number;
  setCornerRadius: (r: number) => void;
  lightMode: boolean;
  setLightMode: (mode: boolean) => void;
}

export default function Toolbar({
  tool,
  setTool,
  gridSize,
  setGridSize,
  showGrid,
  setShowGrid,
  onUndo,
  onRedo,
  onClear,
  onExport,
  onSave,
  onLoad,
  canUndo,
  canRedo,
  cornerRadius,
  setCornerRadius,
  lightMode,
  setLightMode,
}: ToolbarProps) {
  const tools: { id: Tool; icon: string; label: string; shortcut: string }[] = [
    { id: 'pencil', icon: '✏️', label: 'Lápis', shortcut: 'P' },
    { id: 'eraser', icon: '🧹', label: 'Borracha', shortcut: 'E' },
    { id: 'fill', icon: '🪣', label: 'Preencher', shortcut: 'F' },
    { id: 'rect', icon: '⬜', label: 'Retângulo', shortcut: 'R' },
    { id: 'token', icon: '🎯', label: 'Token', shortcut: 'T' },
    { id: 'stamp', icon: '🌲', label: 'Stamp', shortcut: 'S' },
    { id: 'text', icon: '✍️', label: 'Texto', shortcut: 'X' },
    { id: 'light', icon: '💡', label: 'Luz', shortcut: 'L' },
  ];

  return (
    <div className="bg-[#1a1a2e] border-b border-[#2a2a4a] px-3 py-2 flex items-center gap-2 flex-wrap">
      {/* Tools */}
      <div className="flex items-center gap-0.5 bg-[#0f0f1a] rounded-lg p-1">
        {tools.map(t => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={`px-2 py-1.5 rounded-md text-sm transition-all flex items-center gap-1
              ${tool === t.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            title={`${t.label} (${t.shortcut})`}
          >
            <span>{t.icon}</span>
            <span className="hidden lg:inline text-xs">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="w-px h-8 bg-[#2a2a4a] mx-1" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="px-2 py-1.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Desfazer (Ctrl+Z)"
        >
          ↩️
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="px-2 py-1.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Refazer (Ctrl+Y)"
        >
          ↪️
        </button>
      </div>

      <div className="w-px h-8 bg-[#2a2a4a] mx-1" />

      {/* Corner Radius (for rect tool) */}
      {tool === 'rect' && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">Raio:</span>
            <input
              type="range"
              min="0"
              max="10"
              value={cornerRadius}
              onChange={e => setCornerRadius(Number(e.target.value))}
              className="w-16 accent-indigo-500"
            />
            <span className="text-gray-300 text-xs w-4">{cornerRadius}</span>
          </div>
          <div className="w-px h-8 bg-[#2a2a4a] mx-1" />
        </>
      )}

      {/* Grid Size */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-xs hidden md:inline">Tamanho:</span>
        <input
          type="range"
          min="16"
          max="48"
          value={gridSize}
          onChange={e => setGridSize(Number(e.target.value))}
          className="w-16 accent-indigo-500"
        />
        <span className="text-gray-300 text-xs w-8">{gridSize}px</span>
      </div>

      <div className="w-px h-8 bg-[#2a2a4a] mx-1" />

      {/* Grid Toggle */}
      <button
        onClick={() => setShowGrid(!showGrid)}
        className={`px-2 py-1.5 rounded-md text-xs transition-all
          ${showGrid ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
      >
        🔲 Grade
      </button>

      {/* Light Mode Toggle */}
      <button
        onClick={() => setLightMode(!lightMode)}
        className={`px-2 py-1.5 rounded-md text-xs transition-all
          ${lightMode ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
      >
        💡 Luz
      </button>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSave}
          className="px-2 py-1.5 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          title="Salvar mapa"
        >
          💾
        </button>
        <button
          onClick={onLoad}
          className="px-2 py-1.5 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          title="Carregar mapa"
        >
          📂
        </button>
        <button
          onClick={onClear}
          className="px-2 py-1.5 rounded-md text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          title="Limpar mapa"
        >
          🗑️
        </button>
        <button
          onClick={onExport}
          className="px-3 py-1.5 rounded-md text-xs bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
          title="Exportar mapa"
        >
          📤 Exportar
        </button>
      </div>
    </div>
  );
}
