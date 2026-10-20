import { useState } from 'react';
import { generateRandomDungeon, DEFAULT_CONFIG, DungeonConfig } from '../utils/dungeonGenerator';
import { TILE_TYPES } from '../types';

interface RandomDungeonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (grid: (string | null)[][]) => void;
}

export default function RandomDungeonModal({ isOpen, onClose, onGenerate }: RandomDungeonModalProps) {
  const [config, setConfig] = useState<DungeonConfig>({ ...DEFAULT_CONFIG });
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const grid = generateRandomDungeon(config);
      onGenerate(grid);
      setIsGenerating(false);
      onClose();
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] rounded-xl p-6 max-w-lg w-full mx-4 border border-[#2a2a4a] shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🎲 Gerador de Masmorra Aleatória
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="space-y-4">
          {/* Map Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Largura</label>
              <input
                type="number"
                min="15"
                max="80"
                value={config.width}
                onChange={e => setConfig({ ...config, width: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#0f0f1a] rounded-lg text-white border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Altura</label>
              <input
                type="number"
                min="15"
                max="80"
                value={config.height}
                onChange={e => setConfig({ ...config, height: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#0f0f1a] rounded-lg text-white border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Room Settings */}
          <div className="p-3 bg-[#0f0f1a] rounded-lg space-y-3">
            <h3 className="text-gray-300 text-sm font-medium">🏠 Salas</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-gray-500 text-xs block mb-1">Quantidade</label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={config.roomCount}
                  onChange={e => setConfig({ ...config, roomCount: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 bg-[#1a1a2e] rounded text-white text-sm border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1">Tam. Mín</label>
                <input
                  type="number"
                  min="3"
                  max="8"
                  value={config.roomMinSize}
                  onChange={e => setConfig({ ...config, roomMinSize: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 bg-[#1a1a2e] rounded text-white text-sm border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1">Tam. Máx</label>
                <input
                  type="number"
                  min="4"
                  max="15"
                  value={config.roomMaxSize}
                  onChange={e => setConfig({ ...config, roomMaxSize: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 bg-[#1a1a2e] rounded text-white text-sm border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Corridor Settings */}
          <div className="p-3 bg-[#0f0f1a] rounded-lg">
            <h3 className="text-gray-300 text-sm font-medium mb-2">🚇 Corredores</h3>
            <div>
              <label className="text-gray-500 text-xs block mb-1">Largura</label>
              <input
                type="number"
                min="1"
                max="3"
                value={config.corridorWidth}
                onChange={e => setConfig({ ...config, corridorWidth: Number(e.target.value) })}
                className="w-full px-2 py-1.5 bg-[#1a1a2e] rounded text-white text-sm border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Tile Types */}
          <div className="p-3 bg-[#0f0f1a] rounded-lg space-y-2">
            <h3 className="text-gray-300 text-sm font-medium">🧱 Tipos de Tile</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-500 text-xs block mb-1">Parede</label>
                <select
                  value={config.wallType}
                  onChange={e => setConfig({ ...config, wallType: e.target.value })}
                  className="w-full px-2 py-1.5 bg-[#1a1a2e] rounded text-white text-sm border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
                >
                  {TILE_TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1">Chão</label>
                <select
                  value={config.floorType}
                  onChange={e => setConfig({ ...config, floorType: e.target.value })}
                  className="w-full px-2 py-1.5 bg-[#1a1a2e] rounded text-white text-sm border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
                >
                  {TILE_TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="p-3 bg-[#0f0f1a] rounded-lg">
            <h3 className="text-gray-300 text-sm font-medium mb-2">⚡ Presets</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setConfig({ ...DEFAULT_CONFIG })}
                className="px-3 py-2 bg-[#1a1a2e] rounded-lg text-xs text-gray-300 hover:text-white hover:bg-indigo-600/20 border border-[#2a2a4a] hover:border-indigo-500/50 transition-all"
              >
                🏰 Masmorra Clássica
              </button>
              <button
                onClick={() => setConfig({ ...DEFAULT_CONFIG, roomCount: 15, roomMinSize: 3, roomMaxSize: 6, corridorWidth: 1 })}
                className="px-3 py-2 bg-[#1a1a2e] rounded-lg text-xs text-gray-300 hover:text-white hover:bg-indigo-600/20 border border-[#2a2a4a] hover:border-indigo-500/50 transition-all"
              >
                🕳️ Catacumbas
              </button>
              <button
                onClick={() => setConfig({ ...DEFAULT_CONFIG, roomCount: 5, roomMinSize: 6, roomMaxSize: 12, floorType: 'wood', wallType: 'stone' })}
                className="px-3 py-2 bg-[#1a1a2e] rounded-lg text-xs text-gray-300 hover:text-white hover:bg-indigo-600/20 border border-[#2a2a4a] hover:border-indigo-500/50 transition-all"
              >
                🏰 Castelo
              </button>
              <button
                onClick={() => setConfig({ ...DEFAULT_CONFIG, roomCount: 4, roomMinSize: 8, roomMaxSize: 15, corridorWidth: 2, floorType: 'sand', wallType: 'stone' })}
                className="px-3 py-2 bg-[#1a1a2e] rounded-lg text-xs text-gray-300 hover:text-white hover:bg-indigo-600/20 border border-[#2a2a4a] hover:border-indigo-500/50 transition-all"
              >
                🏛️ Templo Antigo
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#2a2a4a] text-gray-300 rounded-lg hover:bg-[#3a3a5a] transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all font-medium shadow-lg shadow-purple-600/20 disabled:opacity-50"
            >
              {isGenerating ? '⏳ Gerando...' : '🎲 Gerar Masmorra'}
            </button>
          </div>

          <p className="text-gray-500 text-xs text-center">
            ⚠️ A geração substituirá o mapa atual. Salve antes de gerar!
          </p>
        </div>
      </div>
    </div>
  );
}
