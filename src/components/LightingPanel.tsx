import { LightSource, LIGHT_PRESETS, LIGHT_COLORS } from '../types';

interface LightingPanelProps {
  lights: LightSource[];
  selectedLightId: string | null;
  onSelectLight: (id: string | null) => void;
  onRemoveLight: (id: string) => void;
  onUpdateLight: (id: string, updates: Partial<LightSource>) => void;
  lightMode: boolean;
  onToggleLightMode: () => void;
}

export default function LightingPanel({
  lights,
  selectedLightId,
  onSelectLight,
  onRemoveLight,
  onUpdateLight,
  lightMode,
  onToggleLightMode,
}: LightingPanelProps) {
  const selectedLight = lights.find(l => l.id === selectedLightId);

  return (
    <div className="space-y-3">
      {/* Light Mode Toggle */}
      <div className="p-3 bg-[#0f0f1a] rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm font-medium">💡 Modo Iluminação</span>
          <button
            onClick={onToggleLightMode}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              lightMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'bg-[#2a2a4a] text-gray-400 hover:text-white'
            }`}
          >
            {lightMode ? 'Ligado' : 'Desligado'}
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-1">
          Áreas sem luz ficam escuras. Use a ferramenta Luz (L) para adicionar fontes.
        </p>
      </div>

      {/* Light List */}
      <div>
        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          Fontes de Luz ({lights.length})
        </h3>
        {lights.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-3">
            Nenhuma fonte de luz. Clique no mapa com a ferramenta Luz.
          </p>
        ) : (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {lights.map(light => (
              <div
                key={light.id}
                onClick={() => onSelectLight(light.id)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                  selectedLightId === light.id ? 'bg-amber-500/20 border border-amber-500/50' : 'hover:bg-white/5'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: light.color, boxShadow: `0 0 6px ${light.color}` }}
                />
                <span className="text-sm text-gray-300 flex-1">
                  {LIGHT_PRESETS[light.type].name} ({light.brightRadius}/{light.dimRadius})
                </span>
                <button
                  onClick={e => { e.stopPropagation(); onRemoveLight(light.id); }}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Light Properties */}
      {selectedLight && (
        <div className="p-3 bg-[#0f0f1a] rounded-lg space-y-3">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
            Propriedades da Luz
          </h3>

          {/* Type */}
          <div>
            <label className="text-gray-400 text-xs block mb-1">Tipo</label>
            <select
              value={selectedLight.type}
              onChange={e => {
                const preset = LIGHT_PRESETS[e.target.value as keyof typeof LIGHT_PRESETS];
                onUpdateLight(selectedLight.id, {
                  type: e.target.value as LightSource['type'],
                  brightRadius: preset.brightRadius,
                  dimRadius: preset.dimRadius,
                  color: preset.color,
                });
              }}
              className="w-full px-2 py-1.5 bg-[#1a1a2e] rounded text-white text-sm border border-[#2a2a4a] focus:border-amber-500 focus:outline-none"
            >
              {Object.entries(LIGHT_PRESETS).map(([key, preset]) => (
                <option key={key} value={key}>{preset.name}</option>
              ))}
            </select>
          </div>

          {/* Bright Radius */}
          <div>
            <label className="text-gray-400 text-xs block mb-1">
              Raio Brilhante: {selectedLight.brightRadius}
            </label>
            <input
              type="range"
              min="1"
              max="15"
              value={selectedLight.brightRadius}
              onChange={e => onUpdateLight(selectedLight.id, { brightRadius: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Dim Radius */}
          <div>
            <label className="text-gray-400 text-xs block mb-1">
              Raio Dim: {selectedLight.dimRadius}
            </label>
            <input
              type="range"
              min={selectedLight.brightRadius}
              max="20"
              value={selectedLight.dimRadius}
              onChange={e => onUpdateLight(selectedLight.id, { dimRadius: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-gray-400 text-xs block mb-1">Cor</label>
            <div className="flex flex-wrap gap-1">
              {LIGHT_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => onUpdateLight(selectedLight.id, { color })}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedLight.color === color ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
