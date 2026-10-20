import { TileType, TILE_TYPES, Token, TOKEN_COLORS, StampItem } from '../types';
import { useState } from 'react';

interface TokenSettings {
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  label: string;
}

interface TilePaletteProps {
  selectedTile: TileType;
  setSelectedTile: (tile: TileType) => void;
  tokens: Token[];
  onRemoveToken: (id: string) => void;
  onUpdateToken: (id: string, updates: Partial<Token>) => void;
  selectedTokenId: string | null;
  setSelectedTokenId: (id: string | null) => void;
  tool: string;
  tokenSettings: TokenSettings;
  setTokenSettings: (settings: TokenSettings) => void;
  stamps: StampItem[];
  onRemoveStamp: (id: string) => void;
}

export default function TilePalette({
  selectedTile,
  setSelectedTile,
  tokens,
  onRemoveToken,
  onUpdateToken,
  selectedTokenId,
  setSelectedTokenId,
  tool,
  tokenSettings,
  setTokenSettings,
  stamps,
  onRemoveStamp,
}: TilePaletteProps) {
  const [tab, setTab] = useState<'tiles' | 'tokens' | 'stamps'>('tiles');

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#2a2a4a]">
        <button
          onClick={() => setTab('tiles')}
          className={`flex-1 py-2 text-xs font-medium transition-all
            ${tab === 'tiles' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-gray-400 hover:text-white'}`}
        >
          🧱 Tiles
        </button>
        <button
          onClick={() => setTab('tokens')}
          className={`flex-1 py-2 text-xs font-medium transition-all
            ${tab === 'tokens' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-gray-400 hover:text-white'}`}
        >
          🎯 Tokens
        </button>
        <button
          onClick={() => setTab('stamps')}
          className={`flex-1 py-2 text-xs font-medium transition-all
            ${tab === 'stamps' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-gray-400 hover:text-white'}`}
        >
          🌲 Stamps
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {tab === 'tiles' ? (
          <div>
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
              Tipos de Terreno
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {TILE_TYPES.map(tile => (
                <button
                  key={tile.id}
                  onClick={() => setSelectedTile(tile)}
                  className={`flex flex-col items-center p-1.5 rounded-lg transition-all border
                    ${selectedTile.id === tile.id
                      ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/10'
                      : 'border-transparent hover:border-gray-600 hover:bg-white/5'
                    }`}
                >
                  <div
                    className="w-7 h-7 rounded-md mb-1 border border-white/10"
                    style={{ backgroundColor: tile.color }}
                  />
                  <span className="text-[10px] text-gray-300">{tile.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : tab === 'tokens' ? (
          <div>
            {/* Token Creation */}
            <div className="mb-3 p-2 bg-[#0f0f1a] rounded-lg">
              <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                Novo Token
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-gray-400 text-[10px]">Cor</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {TOKEN_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setTokenSettings({ ...tokenSettings, color })}
                        className={`w-5 h-5 rounded-full border-2 transition-all
                          ${tokenSettings.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-[10px]">Forma</label>
                  <div className="flex gap-1 mt-1">
                    {(['circle', 'square', 'triangle'] as const).map(shape => (
                      <button
                        key={shape}
                        onClick={() => setTokenSettings({ ...tokenSettings, shape })}
                        className={`px-2 py-1 rounded text-xs transition-all
                          ${tokenSettings.shape === shape ? 'bg-indigo-600 text-white' : 'bg-[#2a2a4a] text-gray-400 hover:text-white'}`}
                      >
                        {shape === 'circle' ? '⚫' : shape === 'square' ? '🟦' : '🔺'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-[10px]">Rótulo</label>
                  <input
                    type="text"
                    value={tokenSettings.label}
                    onChange={e => setTokenSettings({ ...tokenSettings, label: e.target.value })}
                    placeholder="Ex: Guerreiro"
                    className="w-full mt-1 px-2 py-1 bg-[#2a2a4a] rounded text-xs text-white border border-transparent focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Token List */}
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
              Tokens ({tokens.length})
            </h3>
            {tokens.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-3">
                Nenhum token. Use T para adicionar.
              </p>
            ) : (
              <div className="space-y-1">
                {tokens.map(token => (
                  <div
                    key={token.id}
                    onClick={() => setSelectedTokenId(token.id)}
                    className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all
                      ${selectedTokenId === token.id ? 'bg-indigo-500/20 border border-indigo-500/50' : 'hover:bg-white/5'}`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                      style={{ backgroundColor: token.color }}
                    />
                    <span className="text-xs text-gray-300 flex-1 truncate">
                      {token.label || 'Token'}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); onUpdateToken(token.id, { locked: !token.locked }); }}
                      className="text-gray-400 hover:text-white text-xs"
                      title={token.locked ? 'Desbloquear' : 'Bloquear'}
                    >
                      {token.locked ? '🔒' : '🔓'}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); onRemoveToken(token.id); }}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Token Properties */}
            {selectedTokenId && tool === 'token' && (
              <div className="mt-3 p-2 bg-[#0f0f1a] rounded-lg">
                <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                  Propriedades
                </h3>
                {(() => {
                  const token = tokens.find(t => t.id === selectedTokenId);
                  if (!token) return null;
                  return (
                    <div className="space-y-2">
                      <div>
                        <label className="text-gray-400 text-[10px]">Tamanho</label>
                        <input
                          type="range"
                          min="50"
                          max="150"
                          value={token.size}
                          onChange={e => onUpdateToken(token.id, { size: Number(e.target.value) })}
                          className="w-full accent-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-[10px]">Rótulo</label>
                        <input
                          type="text"
                          value={token.label}
                          onChange={e => onUpdateToken(token.id, { label: e.target.value })}
                          className="w-full mt-1 px-2 py-1 bg-[#2a2a4a] rounded text-xs text-white border border-transparent focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
              Stamps no Mapa ({stamps.length})
            </h3>
            {stamps.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-3">
                Nenhum stamp. Use a ferramenta Stamp (S) para adicionar.
              </p>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {stamps.map(stamp => (
                  <div
                    key={stamp.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <span className="text-lg">{stamp.symbol}</span>
                    <span className="text-xs text-gray-400 flex-1">
                      ({stamp.x}, {stamp.y})
                    </span>
                    <button
                      onClick={() => onRemoveStamp(stamp.id)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            {stamps.length > 0 && (
              <button
                onClick={() => stamps.forEach(s => onRemoveStamp(s.id))}
                className="mt-2 w-full px-2 py-1 bg-red-600/20 text-red-300 text-xs rounded hover:bg-red-600/30 transition-all"
              >
                🗑️ Remover Todos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
