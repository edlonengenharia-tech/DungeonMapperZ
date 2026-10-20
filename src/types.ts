export type Tool = 'pencil' | 'eraser' | 'fill' | 'rect' | 'select' | 'token' | 'stamp' | 'text' | 'light';

export interface TileType {
  id: string;
  name: string;
  color: string;
  borderColor?: string;
  icon?: string;
  pattern?: 'solid' | 'cross' | 'dots' | 'lines' | 'brick' | 'water' | 'grass';
}

export interface Token {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  locked?: boolean;
}

export interface TextObject {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  align: 'left' | 'center' | 'right';
  shadow: boolean;
  locked?: boolean;
}

export interface LightSource {
  id: string;
  x: number;
  y: number;
  brightRadius: number;
  dimRadius: number;
  color: string;
  type: 'torch' | 'lamp' | 'cantrip' | 'lantern' | 'custom';
  locked?: boolean;
}

export interface StampItem {
  id: string;
  x: number;
  y: number;
  symbol: string;
  size: number;
  rotation: number;
  color: string;
  opacity: number;
  locked?: boolean;
}

export interface MapState {
  grid: (string | null)[][];
  tokens: Token[];
  texts: TextObject[];
  lights: LightSource[];
  stamps: StampItem[];
  width: number;
  height: number;
}

export const TILE_TYPES: TileType[] = [
  { id: 'floor', name: 'Chão', color: '#4a4a4a', pattern: 'solid' },
  { id: 'wall', name: 'Parede', color: '#2d2d2d', borderColor: '#1a1a1a', pattern: 'brick' },
  { id: 'door', name: 'Porta', color: '#8B4513', pattern: 'solid' },
  { id: 'stairs', name: 'Escadas', color: '#5c5c5c', pattern: 'lines' },
  { id: 'water', name: 'Água', color: '#1a5276', pattern: 'water' },
  { id: 'lava', name: 'Lava', color: '#c0392b', pattern: 'dots' },
  { id: 'grass', name: 'Grama', color: '#27ae60', pattern: 'grass' },
  { id: 'sand', name: 'Areia', color: '#d4ac6e', pattern: 'dots' },
  { id: 'stone', name: 'Pedra', color: '#5d6d7e', pattern: 'cross' },
  { id: 'wood', name: 'Madeira', color: '#8B6914', pattern: 'lines' },
  { id: 'ice', name: 'Gelo', color: '#aed6f1', pattern: 'solid' },
  { id: 'pit', name: 'Abismo', color: '#1a1a1a', pattern: 'solid' },
  { id: 'trap', name: 'Armadilha', color: '#7d3c98', pattern: 'cross' },
  { id: 'altar', name: 'Altar', color: '#f39c12', pattern: 'solid' },
  { id: 'rubble', name: 'Entulho', color: '#6c6c6c', pattern: 'dots' },
  { id: 'swamp', name: 'Pântano', color: '#1e5631', pattern: 'grass' },
];

export const TOKEN_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#e67e22', '#ecf0f1', '#34495e', '#ff6b9d'
];

export const LIGHT_PRESETS = {
  torch: { name: 'Tocha', brightRadius: 3, dimRadius: 6, color: '#ff9500' },
  lamp: { name: 'Lâmpada', brightRadius: 4, dimRadius: 8, color: '#ffd700' },
  cantrip: { name: 'Truque de Luz', brightRadius: 5, dimRadius: 10, color: '#87ceeb' },
  lantern: { name: 'Lanterna', brightRadius: 6, dimRadius: 12, color: '#ffaa00' },
  custom: { name: 'Personalizado', brightRadius: 3, dimRadius: 6, color: '#ffffff' },
};

export const STAMP_SYMBOLS = [
  '🌲', '🌳', '🪨', '💀', '🗡️', '🛡️', '🏺', '📦', '🪑', '🕯️',
  '⚔️', '🏹', '🔮', '💎', '🪙', '🍺', '📜', '🗝️', '🧪', '🔥',
  '🌿', '🍄', '🕸️', '⛏️', '🪤', '🏴', '🚪', '🪜', '🗿', '🐉',
];

export const LIGHT_COLORS = [
  '#ff9500', '#ffd700', '#87ceeb', '#ff4444', '#44ff44',
  '#ff44ff', '#ffffff', '#ff6600', '#00ffff', '#ff0088',
];
