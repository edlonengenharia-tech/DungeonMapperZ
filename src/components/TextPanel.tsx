import { TextObject } from '../types';

interface TextPanelProps {
  texts: TextObject[];
  selectedTextId: string | null;
  onSelectText: (id: string | null) => void;
  onRemoveText: (id: string) => void;
  onUpdateText: (id: string, updates: Partial<TextObject>) => void;
  defaultSettings: {
    fontSize: number;
    color: string;
    align: 'left' | 'center' | 'right';
    shadow: boolean;
  };
  setDefaultSettings: (settings: { fontSize: number; color: string; align: 'left' | 'center' | 'right'; shadow: boolean }) => void;
}

export default function TextPanel({
  texts,
  selectedTextId,
  onSelectText,
  onRemoveText,
  onUpdateText,
  defaultSettings,
  setDefaultSettings,
}: TextPanelProps) {
  const selectedText = texts.find(t => t.id === selectedTextId);

  return (
    <div className="space-y-3">
      {/* Default Settings */}
      <div className="p-3 bg-[#0f0f1a] rounded-lg space-y-2">
        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          ✍️ Configurações de Texto
        </h3>
        <div>
          <label className="text-gray-400 text-xs block mb-1">Tamanho da Fonte</label>
          <input
            type="range"
            min="8"
            max="32"
            value={defaultSettings.fontSize}
            onChange={e => setDefaultSettings({ ...defaultSettings, fontSize: Number(e.target.value) })}
            className="w-full accent-indigo-500"
          />
          <span className="text-gray-500 text-xs">{defaultSettings.fontSize}px</span>
        </div>
        <div>
          <label className="text-gray-400 text-xs block mb-1">Cor</label>
          <div className="flex flex-wrap gap-1">
            {['#ffffff', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#ecf0f1'].map(color => (
              <button
                key={color}
                onClick={() => setDefaultSettings({ ...defaultSettings, color })}
                className={`w-6 h-6 rounded border-2 transition-all ${
                  defaultSettings.color === color ? 'border-white scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="text-gray-400 text-xs block mb-1">Alinhamento</label>
          <div className="flex gap-1">
            {(['left', 'center', 'right'] as const).map(align => (
              <button
                key={align}
                onClick={() => setDefaultSettings({ ...defaultSettings, align })}
                className={`px-3 py-1 rounded text-xs transition-all ${
                  defaultSettings.align === align ? 'bg-indigo-600 text-white' : 'bg-[#2a2a4a] text-gray-400 hover:text-white'
                }`}
              >
                {align === 'left' ? '⬅' : align === 'center' ? '⬛' : '➡'}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={defaultSettings.shadow}
            onChange={e => setDefaultSettings({ ...defaultSettings, shadow: e.target.checked })}
            className="accent-indigo-500"
          />
          <span className="text-gray-300 text-sm">Sombra (Drop Shadow)</span>
        </label>
      </div>

      {/* Text List */}
      <div>
        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          Textos no Mapa ({texts.length})
        </h3>
        {texts.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-3">
            Nenhum texto. Clique no mapa com a ferramenta Texto.
          </p>
        ) : (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {texts.map(text => (
              <div
                key={text.id}
                onClick={() => onSelectText(text.id)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                  selectedTextId === text.id ? 'bg-indigo-500/20 border border-indigo-500/50' : 'hover:bg-white/5'
                }`}
              >
                <span className="text-sm text-gray-300 flex-1 truncate" style={{ color: text.color }}>
                  {text.text || '(vazio)'}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); onRemoveText(text.id); }}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Text Properties */}
      {selectedText && (
        <div className="p-3 bg-[#0f0f1a] rounded-lg space-y-2">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
            Editar Texto
          </h3>
          <div>
            <label className="text-gray-400 text-xs block mb-1">Conteúdo</label>
            <input
              type="text"
              value={selectedText.text}
              onChange={e => onUpdateText(selectedText.id, { text: e.target.value })}
              className="w-full px-2 py-1.5 bg-[#1a1a2e] rounded text-white text-sm border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs block mb-1">Tamanho: {selectedText.fontSize}px</label>
            <input
              type="range"
              min="8"
              max="32"
              value={selectedText.fontSize}
              onChange={e => onUpdateText(selectedText.id, { fontSize: Number(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs block mb-1">Cor</label>
            <div className="flex flex-wrap gap-1">
              {['#ffffff', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#ecf0f1'].map(color => (
                <button
                  key={color}
                  onClick={() => onUpdateText(selectedText.id, { color })}
                  className={`w-5 h-5 rounded border-2 transition-all ${
                    selectedText.color === color ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs block mb-1">Alinhamento</label>
            <div className="flex gap-1">
              {(['left', 'center', 'right'] as const).map(align => (
                <button
                  key={align}
                  onClick={() => onUpdateText(selectedText.id, { align })}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    selectedText.align === align ? 'bg-indigo-600 text-white' : 'bg-[#2a2a4a] text-gray-400 hover:text-white'
                  }`}
                >
                  {align === 'left' ? '⬅' : align === 'center' ? '⬛' : '➡'}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedText.shadow}
              onChange={e => onUpdateText(selectedText.id, { shadow: e.target.checked })}
              className="accent-indigo-500"
            />
            <span className="text-gray-300 text-sm">Sombra</span>
          </label>
        </div>
      )}
    </div>
  );
}
