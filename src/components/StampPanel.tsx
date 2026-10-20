import { STAMP_SYMBOLS, TOKEN_COLORS } from '../types';

interface StampSettings {
  symbol: string;
  size: number;
  rotation: number;
  color: string;
  opacity: number;
  repeatSpeed: number;
  randomSize: boolean;
  randomRotation: boolean;
  randomColor: boolean;
  snap: boolean;
}

interface StampPanelProps {
  settings: StampSettings;
  setSettings: (settings: StampSettings) => void;
}

export default function StampPanel({ settings, setSettings }: StampPanelProps) {
  return (
    <div className="space-y-3">
      {/* Symbol Selection */}
      <div className="p-3 bg-[#0f0f1a] rounded-lg">
        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          Símbolo
        </h3>
        <div className="grid grid-cols-6 gap-1">
          {STAMP_SYMBOLS.map(symbol => (
            <button
              key={symbol}
              onClick={() => setSettings({ ...settings, symbol })}
              className={`w-8 h-8 flex items-center justify-center rounded text-lg transition-all
                ${settings.symbol === symbol ? 'bg-indigo-600/30 border border-indigo-500 scale-110' : 'hover:bg-white/10'}`}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="p-3 bg-[#0f0f1a] rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-gray-400 text-xs">Tamanho</label>
          <span className="text-gray-500 text-xs">{settings.size}px</span>
        </div>
        <input
          type="range"
          min="12"
          max="48"
          value={settings.size}
          onChange={e => setSettings({ ...settings, size: Number(e.target.value) })}
          className="w-full accent-indigo-500"
        />
      </div>

      {/* Rotation */}
      <div className="p-3 bg-[#0f0f1a] rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-gray-400 text-xs">Rotação</label>
          <span className="text-gray-500 text-xs">{settings.rotation}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          value={settings.rotation}
          onChange={e => setSettings({ ...settings, rotation: Number(e.target.value) })}
          className="w-full accent-indigo-500"
        />
      </div>

      {/* Color */}
      <div className="p-3 bg-[#0f0f1a] rounded-lg">
        <label className="text-gray-400 text-xs block mb-1">Cor</label>
        <div className="flex flex-wrap gap-1">
          {['#ffffff', ...TOKEN_COLORS].map(color => (
            <button
              key={color}
              onClick={() => setSettings({ ...settings, color })}
              className={`w-6 h-6 rounded-full border-2 transition-all
                ${settings.color === color ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Opacity */}
      <div className="p-3 bg-[#0f0f1a] rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-gray-400 text-xs">Opacidade</label>
          <span className="text-gray-500 text-xs">{Math.round(settings.opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="20"
          max="100"
          value={settings.opacity * 100}
          onChange={e => setSettings({ ...settings, opacity: Number(e.target.value) / 100 })}
          className="w-full accent-indigo-500"
        />
      </div>

      {/* Repeat Speed */}
      <div className="p-3 bg-[#0f0f1a] rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-gray-400 text-xs">Densidade</label>
          <span className="text-gray-500 text-xs">{settings.repeatSpeed}</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={settings.repeatSpeed}
          onChange={e => setSettings({ ...settings, repeatSpeed: Number(e.target.value) })}
          className="w-full accent-indigo-500"
        />
      </div>

      {/* Randomization Options */}
      <div className="p-3 bg-[#0f0f1a] rounded-lg space-y-2">
        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          Randomização
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.randomSize}
            onChange={e => setSettings({ ...settings, randomSize: e.target.checked })}
            className="accent-indigo-500"
          />
          <span className="text-gray-300 text-sm">Tamanho aleatório</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.randomRotation}
            onChange={e => setSettings({ ...settings, randomRotation: e.target.checked })}
            className="accent-indigo-500"
          />
          <span className="text-gray-300 text-sm">Rotação aleatória</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.randomColor}
            onChange={e => setSettings({ ...settings, randomColor: e.target.checked })}
            className="accent-indigo-500"
          />
          <span className="text-gray-300 text-sm">Cor aleatória</span>
        </label>
      </div>

      {/* Snap */}
      <div className="p-3 bg-[#0f0f1a] rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.snap}
            onChange={e => setSettings({ ...settings, snap: e.target.checked })}
            className="accent-indigo-500"
          />
          <span className="text-gray-300 text-sm">🔲 Alinhar à grade</span>
        </label>
      </div>

      <p className="text-gray-500 text-xs text-center">
        Arraste no mapa para carimbar símbolos. Cada stamp é um objeto individual.
      </p>
    </div>
  );
}

export type { StampSettings };
