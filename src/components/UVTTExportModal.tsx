import { useState } from 'react';
import { TILE_TYPES, Token, LightSource, TextObject, StampItem } from '../types';

interface UVTTExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  grid: (string | null)[][];
  tokens: Token[];
  lights: LightSource[];
  texts: TextObject[];
  stamps: StampItem[];
  gridSize: number;
}

export default function UVTTExportModal({ isOpen, onClose, grid, tokens, lights, texts, stamps, gridSize }: UVTTExportModalProps) {
  const [gridPixels, setGridPixels] = useState(70);
  const [exportType, setExportType] = useState<'uvtt' | 'png' | 'pdf'>('uvtt');

  if (!isOpen) return null;

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  function detectWalls(): { x: number; y: number; side: string }[] {
    const walls: { x: number; y: number; side: string }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 'wall') {
          // Check each side
          if (r === 0 || grid[r - 1][c] !== 'wall') walls.push({ x: c, y: r, side: 'north' });
          if (r === rows - 1 || grid[r + 1][c] !== 'wall') walls.push({ x: c, y: r, side: 'south' });
          if (c === 0 || grid[r][c - 1] !== 'wall') walls.push({ x: c, y: r, side: 'west' });
          if (c === cols - 1 || grid[r][c + 1] !== 'wall') walls.push({ x: c, y: r, side: 'east' });
        }
      }
    }
    return walls;
  }

  function detectDoors(): { x: number; y: number }[] {
    const doors: { x: number; y: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 'door') {
          doors.push({ x: c, y: r });
        }
      }
    }
    return doors;
  }

  function exportUVTT() {
    const walls = detectWalls();
    const doors = detectDoors();

    const uvttData = {
      format: 'universal-vtt',
      version: 1.0,
      resolution: {
        map_origin: { x: 0, y: 0 },
        map_size: { x: cols, y: rows },
        pixels_per_grid_square: gridPixels,
      },
      line_of_sight: walls.map(w => ({
        points: getWallPoints(w),
      })),
      environment: {
        baked_lighting: false,
        ambient_light: { intensity: 0.2 },
      },
      lights: lights.map(light => ({
        name: light.type,
        position: { x: light.x + 0.5, y: light.y + 0.5 },
        color: light.color,
        intensity: 1,
        range: {
          bright: light.brightRadius,
          dim: light.dimRadius,
        },
      })),
      doors: doors.map(door => ({
        position: { x: door.x, y: door.y },
        closed_position: getDoorPoints(door),
        teleport_bounds: [],
      })),
    };

    const blob = new Blob([JSON.stringify(uvttData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `map-uvtt-${Date.now()}.uvtt`;
    link.href = URL.createObjectURL(blob);
    link.click();
    onClose();
  }

  function getWallPoints(wall: { x: number; y: number; side: string }) {
    const { x, y, side } = wall;
    switch (side) {
      case 'north': return [{ x: x, y: y }, { x: x + 1, y: y }];
      case 'south': return [{ x: x, y: y + 1 }, { x: x + 1, y: y + 1 }];
      case 'west': return [{ x: x, y: y }, { x: x, y: y + 1 }];
      case 'east': return [{ x: x + 1, y: y }, { x: x + 1, y: y + 1 }];
      default: return [];
    }
  }

  function getDoorPoints(door: { x: number; y: number }) {
    return [
      { x: door.x, y: door.y },
      { x: door.x + 1, y: door.y },
      { x: door.x + 1, y: door.y + 1 },
      { x: door.x, y: door.y + 1 },
    ];
  }

  function exportPNG(scale: number = 2) {
    const cellSize = gridSize * scale;
    const canvas = document.createElement('canvas');
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    const ctx = canvas.getContext('2d')!;

    // Draw cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellSize;
        const y = r * cellSize;
        const tileId = grid[r][c];

        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x, y, cellSize, cellSize);

        if (tileId) {
          const tile = TILE_TYPES.find(t => t.id === tileId);
          if (tile) {
            ctx.fillStyle = tile.color;
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
      }
    }

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellSize);
      ctx.lineTo(cols * cellSize, r * cellSize);
      ctx.stroke();
    }
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellSize, 0);
      ctx.lineTo(c * cellSize, rows * cellSize);
      ctx.stroke();
    }

    // Draw tokens
    tokens.forEach(token => {
      const x = token.x * cellSize + cellSize / 2;
      const y = token.y * cellSize + cellSize / 2;
      const radius = (cellSize * 0.35) * (token.size / 100);
      ctx.fillStyle = token.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (token.label) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(10, cellSize * 0.25)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(token.label, x, y);
      }
    });

    // Draw stamps
    stamps.forEach(stamp => {
      const x = stamp.x * cellSize + cellSize / 2;
      const y = stamp.y * cellSize + cellSize / 2;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((stamp.rotation * Math.PI) / 180);
      ctx.globalAlpha = stamp.opacity;
      ctx.font = `${stamp.size * scale}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(stamp.symbol, 0, 0);
      ctx.restore();
    });

    // Draw texts
    texts.forEach(text => {
      const x = text.x * cellSize + cellSize / 2;
      const y = text.y * cellSize + cellSize / 2;
      ctx.save();
      ctx.font = `${text.fontSize * scale}px sans-serif`;
      ctx.fillStyle = text.color;
      ctx.textAlign = text.align;
      ctx.textBaseline = 'middle';
      if (text.shadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }
      ctx.fillText(text.text, x, y);
      ctx.restore();
    });

    const link = document.createElement('a');
    link.download = `dungeon-map-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] rounded-xl p-6 max-w-md w-full mx-4 border border-[#2a2a4a] shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">📤 Exportar Mapa</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="space-y-4">
          {/* Export Type */}
          <div>
            <label className="text-gray-400 text-sm block mb-2">Formato</label>
            <div className="grid grid-cols-3 gap-2">
              {(['uvtt', 'png', 'pdf'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setExportType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    exportType === type
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-[#0f0f1a] text-gray-400 border-[#2a2a4a] hover:border-indigo-500/50'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Pixels (for UVTT) */}
          {exportType === 'uvtt' && (
            <div className="p-3 bg-[#0f0f1a] rounded-lg">
              <label className="text-gray-400 text-sm block mb-1">Pixels por célula (UVTT)</label>
              <input
                type="number"
                min="50"
                max="150"
                value={gridPixels}
                onChange={e => setGridPixels(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1a1a2e] rounded-lg text-white border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
              />
              <p className="text-gray-500 text-xs mt-1">Padrão UVTT: 70px por célula</p>
            </div>
          )}

          {/* Info */}
          <div className="p-3 bg-[#0f0f1a] rounded-lg text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Dimensões:</span>
              <span className="text-white">{cols}×{rows} células</span>
            </div>
            <div className="flex justify-between text-gray-400 mt-1">
              <span>Paredes detectadas:</span>
              <span className="text-white">{detectWalls().length}</span>
            </div>
            <div className="flex justify-between text-gray-400 mt-1">
              <span>Portas:</span>
              <span className="text-white">{detectDoors().length}</span>
            </div>
            <div className="flex justify-between text-gray-400 mt-1">
              <span>Fontes de luz:</span>
              <span className="text-white">{lights.length}</span>
            </div>
            <div className="flex justify-between text-gray-400 mt-1">
              <span>Tokens:</span>
              <span className="text-white">{tokens.length}</span>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="space-y-2">
            {exportType === 'uvtt' && (
              <button
                onClick={exportUVTT}
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg transition-all flex items-center gap-3 shadow-lg shadow-emerald-600/20"
              >
                <span className="text-2xl">🎲</span>
                <div className="text-left">
                  <div className="font-medium">Exportar UVTT</div>
                  <div className="text-sm text-emerald-200">Roll20, Foundry, e outros VTTs</div>
                </div>
              </button>
            )}

            {exportType === 'png' && (
              <>
                <button
                  onClick={() => exportPNG(2)}
                  className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all flex items-center gap-3"
                >
                  <span className="text-2xl">🖼️</span>
                  <div className="text-left">
                    <div className="font-medium">PNG Normal</div>
                    <div className="text-sm text-indigo-200">{cols * gridSize * 2}×{rows * gridSize * 2}px</div>
                  </div>
                </button>
                <button
                  onClick={() => exportPNG(4)}
                  className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all flex items-center gap-3"
                >
                  <span className="text-2xl">🖼️</span>
                  <div className="text-left">
                    <div className="font-medium">PNG Alta Resolução</div>
                    <div className="text-sm text-indigo-200">{cols * gridSize * 4}×{rows * gridSize * 4}px</div>
                  </div>
                </button>
              </>
            )}

            {exportType === 'pdf' && (
              <button
                onClick={() => exportPNG(4)}
                className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all flex items-center gap-3"
              >
                <span className="text-2xl">📄</span>
                <div className="text-left">
                  <div className="font-medium">Exportar para Impressão</div>
                  <div className="text-sm text-amber-200">PNG em alta resolução (imprima como PDF)</div>
                </div>
              </button>
            )}
          </div>

          {/* UVTT Info */}
          {exportType === 'uvtt' && (
            <div className="p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
              <p className="text-emerald-300 text-xs">
                💡 O formato UVTT inclui paredes, portas e iluminação automática. Compatível com Roll20, Foundry VTT, e outros.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
