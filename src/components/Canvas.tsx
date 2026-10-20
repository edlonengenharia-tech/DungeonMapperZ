import { useRef, useEffect, useCallback, useState } from 'react';
import { TileType, Token, TextObject, LightSource, StampItem, TILE_TYPES } from '../types';
import type { StampSettings } from './StampPanel';

interface CanvasProps {
  grid: (string | null)[][];
  tokens: Token[];
  texts: TextObject[];
  lights: LightSource[];
  stamps: StampItem[];
  selectedTile: TileType;
  tool: string;
  gridSize: number;
  onCellChange: (row: number, col: number) => void;
  onCellDrag: (row: number, col: number) => void;
  onTokenMove: (tokenId: string, x: number, y: number) => void;
  onAddToken: (x: number, y: number) => void;
  onFloodFill: (row: number, col: number) => void;
  onRectDraw: (startRow: number, startCol: number, endRow: number, endCol: number, cornerRadius?: number) => void;
  onAddText: (x: number, y: number) => void;
  onAddLight: (x: number, y: number) => void;
  onAddStamp: (x: number, y: number) => void;
  showGrid: boolean;
  lightMode: boolean;
  cornerRadius: number;
  stampSettings: StampSettings;
}

export default function Canvas({
  grid,
  tokens,
  texts,
  lights,
  stamps,
  selectedTile,
  tool,
  gridSize,
  onCellChange,
  onCellDrag,
  onTokenMove,
  onAddToken,
  onFloodFill,
  onRectDraw,
  onAddText,
  onAddLight,
  onAddStamp,
  showGrid,
  lightMode,
  cornerRadius,
  stampSettings,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rectStart, setRectStart] = useState<{ row: number; col: number } | null>(null);
  const [rectEnd, setRectEnd] = useState<{ row: number; col: number } | null>(null);
  const [dragToken, setDragToken] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [stampCounter, setStampCounter] = useState(0);

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = gridSize * scale;
    const width = cols * cellSize;
    const height = rows * cellSize;

    canvas.width = Math.max(width + Math.abs(offset.x) + 200, containerRef.current?.clientWidth || 800);
    canvas.height = Math.max(height + Math.abs(offset.y) + 200, containerRef.current?.clientHeight || 600);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);

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
            drawPattern(ctx, tile, x, y, cellSize);
            if (tile.borderColor) {
              ctx.strokeStyle = tile.borderColor;
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, cellSize, cellSize);
            }
          }
        }
      }
    }

    // Draw grid lines
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
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
    }

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
      ctx.font = `bold ${text.fontSize * scale}px sans-serif`;
      ctx.fillStyle = text.color;
      ctx.textAlign = text.align;
      ctx.textBaseline = 'middle';
      if (text.shadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4 * scale;
        ctx.shadowOffsetX = 2 * scale;
        ctx.shadowOffsetY = 2 * scale;
      }
      ctx.fillText(text.text, x, y);
      ctx.restore();
    });

    // Draw rectangle preview
    if (tool === 'rect' && rectStart && rectEnd) {
      const minR = Math.min(rectStart.row, rectEnd.row);
      const maxR = Math.max(rectStart.row, rectEnd.row);
      const minC = Math.min(rectStart.col, rectEnd.col);
      const maxC = Math.max(rectStart.col, rectEnd.col);
      const cr = cornerRadius * scale;

      ctx.fillStyle = selectedTile.color + '66';
      if (cr > 0) {
        drawRoundedRect(ctx, minC * cellSize, minR * cellSize, (maxC - minC + 1) * cellSize, (maxR - minR + 1) * cellSize, cr);
        ctx.fill();
      } else {
        ctx.fillRect(minC * cellSize, minR * cellSize, (maxC - minC + 1) * cellSize, (maxR - minR + 1) * cellSize);
      }
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      if (cr > 0) {
        drawRoundedRect(ctx, minC * cellSize, minR * cellSize, (maxC - minC + 1) * cellSize, (maxR - minR + 1) * cellSize, cr);
        ctx.stroke();
      } else {
        ctx.strokeRect(minC * cellSize, minR * cellSize, (maxC - minC + 1) * cellSize, (maxR - minR + 1) * cellSize);
      }
      ctx.setLineDash([]);
    }

    // Draw tokens
    tokens.forEach(token => {
      const x = token.x * cellSize + cellSize / 2;
      const y = token.y * cellSize + cellSize / 2;
      const radius = (cellSize * 0.35) * (token.size / 100);

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
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
      ctx.restore();

      if (token.label) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(10, cellSize * 0.25)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(token.label, x, y);
      }

      if (token.locked) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = `${cellSize * 0.2}px sans-serif`;
        ctx.fillText('🔒', x + radius * 0.7, y - radius * 0.7);
      }
    });

    // Draw light sources
    lights.forEach(light => {
      const x = light.x * cellSize + cellSize / 2;
      const y = light.y * cellSize + cellSize / 2;

      if (lightMode) {
        // Draw dim radius
        const dimRadius = light.dimRadius * cellSize;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, dimRadius);
        gradient.addColorStop(0, light.color + '40');
        gradient.addColorStop(light.brightRadius / light.dimRadius, light.color + '20');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, dimRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw bright radius
        const brightRadius = light.brightRadius * cellSize;
        const brightGradient = ctx.createRadialGradient(x, y, 0, x, y, brightRadius);
        brightGradient.addColorStop(0, light.color + '60');
        brightGradient.addColorStop(1, light.color + '10');
        ctx.fillStyle = brightGradient;
        ctx.beginPath();
        ctx.arc(x, y, brightRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw light icon
      ctx.fillStyle = light.color;
      ctx.beginPath();
      ctx.arc(x, y, cellSize * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Rays
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const innerR = cellSize * 0.25;
        const outerR = cellSize * 0.35;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * innerR, y + Math.sin(angle) * innerR);
        ctx.lineTo(x + Math.cos(angle) * outerR, y + Math.sin(angle) * outerR);
        ctx.strokeStyle = light.color + '80';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // Light mode overlay - darken unlit areas
    if (lightMode && lights.length > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, cols * cellSize, rows * cellSize);

      // Cut out lit areas
      ctx.globalCompositeOperation = 'destination-out';
      lights.forEach(light => {
        const x = light.x * cellSize + cellSize / 2;
        const y = light.y * cellSize + cellSize / 2;
        const dimRadius = light.dimRadius * cellSize;
        const brightRadius = light.brightRadius * cellSize;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, dimRadius);
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(brightRadius / dimRadius, 'rgba(0,0,0,0.5)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, dimRadius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.restore();
  }, [grid, tokens, texts, lights, stamps, gridSize, scale, offset, showGrid, rectStart, rectEnd, tool, selectedTile, lightMode, cornerRadius, rows, cols]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function drawPattern(ctx: CanvasRenderingContext2D, tile: TileType, x: number, y: number, size: number) {
    ctx.save();
    switch (tile.pattern) {
      case 'brick':
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        const brickH = size / 3;
        const brickW = size / 2;
        for (let row = 0; row < 3; row++) {
          const offsetY = row * brickH;
          const offsetX = row % 2 === 0 ? 0 : brickW / 2;
          ctx.beginPath();
          ctx.moveTo(x, y + offsetY);
          ctx.lineTo(x + size, y + offsetY);
          ctx.stroke();
          for (let col = 0; col < 3; col++) {
            ctx.beginPath();
            ctx.moveTo(x + offsetX + col * brickW, y + offsetY);
            ctx.lineTo(x + offsetX + col * brickW, y + offsetY + brickH);
            ctx.stroke();
          }
        }
        break;
      case 'lines':
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        for (let i = 0; i < size; i += 4) {
          ctx.beginPath();
          ctx.moveTo(x, y + i);
          ctx.lineTo(x + size, y + i);
          ctx.stroke();
        }
        break;
      case 'dots':
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        for (let i = 4; i < size; i += 8) {
          for (let j = 4; j < size; j += 8) {
            ctx.beginPath();
            ctx.arc(x + i, y + j, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      case 'cross':
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        for (let i = 6; i < size; i += 12) {
          ctx.beginPath();
          ctx.moveTo(x + i - 3, y + i - 3);
          ctx.lineTo(x + i + 3, y + i + 3);
          ctx.moveTo(x + i + 3, y + i - 3);
          ctx.lineTo(x + i - 3, y + i + 3);
          ctx.stroke();
        }
        break;
      case 'water':
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        for (let i = 6; i < size; i += 10) {
          ctx.beginPath();
          ctx.moveTo(x, y + i);
          ctx.quadraticCurveTo(x + size / 4, y + i - 3, x + size / 2, y + i);
          ctx.quadraticCurveTo(x + size * 3 / 4, y + i + 3, x + size, y + i);
          ctx.stroke();
        }
        break;
      case 'grass':
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        for (let i = 4; i < size; i += 7) {
          for (let j = 4; j < size; j += 7) {
            ctx.beginPath();
            ctx.moveTo(x + i, y + j + 4);
            ctx.lineTo(x + i - 1, y + j);
            ctx.moveTo(x + i, y + j + 4);
            ctx.lineTo(x + i + 2, y + j + 1);
            ctx.stroke();
          }
        }
        break;
    }
    ctx.restore();
  }

  function getCellFromEvent(e: React.MouseEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;
    const cellSize = gridSize * scale;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      return { row, col };
    }
    return null;
  }

  function getTokenAt(e: React.MouseEvent): Token | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;
    const cellSize = gridSize * scale;
    for (const token of tokens) {
      const tx = token.x * cellSize + cellSize / 2;
      const ty = token.y * cellSize + cellSize / 2;
      const radius = (cellSize * 0.35) * (token.size / 100);
      const dist = Math.sqrt((x - tx) ** 2 + (y - ty) ** 2);
      if (dist <= radius) return token;
    }
    return null;
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      return;
    }

    const cell = getCellFromEvent(e);
    if (!cell) return;

    if (tool === 'token') {
      const token = getTokenAt(e);
      if (token && !token.locked) {
        setDragToken(token.id);
      } else if (!token) {
        onAddToken(cell.col, cell.row);
      }
      return;
    }

    if (tool === 'fill') {
      onFloodFill(cell.row, cell.col);
      return;
    }

    if (tool === 'rect') {
      setRectStart(cell);
      setRectEnd(cell);
      return;
    }

    if (tool === 'text') {
      onAddText(cell.col, cell.row);
      return;
    }

    if (tool === 'light') {
      onAddLight(cell.col, cell.row);
      return;
    }

    if (tool === 'stamp') {
      onAddStamp(cell.col, cell.row);
      setStampCounter(0);
      setIsDragging(true);
      return;
    }

    setIsDragging(true);
    onCellChange(cell.row, cell.col);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (isPanning) {
      setOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }

    if (dragToken) {
      const cell = getCellFromEvent(e);
      if (cell) onTokenMove(dragToken, cell.col, cell.row);
      return;
    }

    const cell = getCellFromEvent(e);
    if (!cell) return;

    if (tool === 'rect' && rectStart) {
      setRectEnd(cell);
      return;
    }

    if (tool === 'stamp' && isDragging) {
      setStampCounter(prev => {
        const next = prev + 1;
        if (next >= stampSettings.repeatSpeed) {
          onAddStamp(cell.col, cell.row);
          return 0;
        }
        return next;
      });
      return;
    }

    if (isDragging) {
      onCellDrag(cell.row, cell.col);
    }
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (isPanning) { setIsPanning(false); return; }
    if (dragToken) { setDragToken(null); return; }

    if (tool === 'rect' && rectStart) {
      const cell = getCellFromEvent(e);
      if (cell) onRectDraw(rectStart.row, rectStart.col, cell.row, cell.col, cornerRadius);
      setRectStart(null);
      setRectEnd(null);
      return;
    }

    if (tool === 'stamp') {
      setIsDragging(false);
      return;
    }

    setIsDragging(false);
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.3, Math.min(3, prev + delta)));
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden relative bg-[#0f0f1a] ${
        tool === 'token' ? 'cursor-pointer' :
        tool === 'fill' ? 'cursor-cell' :
        tool === 'eraser' ? 'cursor-not-allowed' :
        tool === 'text' ? 'cursor-text' :
        tool === 'light' ? 'cursor-crosshair' :
        tool === 'stamp' ? 'cursor-copy' :
        'cursor-crosshair'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { setIsDragging(false); setIsPanning(false); }}
        onWheel={handleWheel}
        onContextMenu={e => e.preventDefault()}
      />
      <div className="absolute bottom-4 left-4 flex gap-2">
        <div className="bg-black/60 text-white px-3 py-1 rounded text-sm">
          Zoom: {Math.round(scale * 100)}%
        </div>
        <div className="bg-black/60 text-white px-3 py-1 rounded text-sm">
          {cols}×{rows} cells
        </div>
      </div>
    </div>
  );
}
