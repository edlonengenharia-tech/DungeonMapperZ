import { TILE_TYPES, Token } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  grid: (string | null)[][];
  tokens: Token[];
  gridSize: number;
}

export default function ExportModal({ isOpen, onClose, grid, tokens, gridSize }: ExportModalProps) {
  if (!isOpen) return null;

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  function exportAsPNG(scale: number = 2) {
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

            if (tile.borderColor) {
              ctx.strokeStyle = tile.borderColor;
              ctx.lineWidth = 2 * scale;
              ctx.strokeRect(x, y, cellSize, cellSize);
            }
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

      if (token.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (token.shape === 'square') {
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        ctx.strokeRect(x - radius, y - radius, radius * 2, radius * 2);
      } else if (token.shape === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(x, y - radius);
        ctx.lineTo(x + radius, y + radius);
        ctx.lineTo(x - radius, y + radius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      if (token.label) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(10, cellSize * 0.25)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(token.label, x, y);
      }
    });

    // Download
    const link = document.createElement('a');
    link.download = `dungeon-map-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    onClose();
  }

  function exportAsJSON() {
    const data = {
      grid,
      tokens,
      width: cols,
      height: rows,
      gridSize,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `dungeon-map-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    onClose();
  }

  function exportForVTT() {
    // Export without tokens for VTT platforms
    const cellSize = gridSize * 2;
    const canvas = document.createElement('canvas');
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    const ctx = canvas.getContext('2d')!;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellSize;
        const y = r * cellSize;
        const tileId = grid[r][c];

        ctx.fillStyle = '#2a2a2a';
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

    const link = document.createElement('a');
    link.download = `vtt-map-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] rounded-xl p-6 max-w-md w-full mx-4 border border-[#2a2a4a] shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">📤 Exportar Mapa</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => exportAsPNG(1)}
            className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all flex items-center gap-3"
          >
            <span className="text-2xl">🖼️</span>
            <div className="text-left">
              <div className="font-medium">PNG (Tamanho Normal)</div>
              <div className="text-sm text-indigo-200">{cols * gridSize}×{rows * gridSize}px</div>
            </div>
          </button>

          <button
            onClick={() => exportAsPNG(2)}
            className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all flex items-center gap-3"
          >
            <span className="text-2xl">🖼️</span>
            <div className="text-left">
              <div className="font-medium">PNG (Alta Resolução)</div>
              <div className="text-sm text-indigo-200">{cols * gridSize * 2}×{rows * gridSize * 2}px</div>
            </div>
          </button>

          <button
            onClick={() => exportAsPNG(4)}
            className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all flex items-center gap-3"
          >
            <span className="text-2xl">🖼️</span>
            <div className="text-left">
              <div className="font-medium">PNG (Impressão)</div>
              <div className="text-sm text-indigo-200">{cols * gridSize * 4}×{rows * gridSize * 4}px</div>
            </div>
          </button>

          <button
            onClick={exportForVTT}
            className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all flex items-center gap-3"
          >
            <span className="text-2xl">🎲</span>
            <div className="text-left">
              <div className="font-medium">Para Mesa Virtual (VTT)</div>
              <div className="text-sm text-emerald-200">Sem tokens - Roll20, Foundry, etc.</div>
            </div>
          </button>

          <button
            onClick={exportAsJSON}
            className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all flex items-center gap-3"
          >
            <span className="text-2xl">📋</span>
            <div className="text-left">
              <div className="font-medium">JSON (Projeto)</div>
              <div className="text-sm text-amber-200">Salve para editar depois</div>
            </div>
          </button>
        </div>

        <p className="text-gray-500 text-xs mt-4 text-center">
          Os mapas exportados podem ser usados em qualquer mesa virtual ou impressos para sua sessão.
        </p>
      </div>
    </div>
  );
}
