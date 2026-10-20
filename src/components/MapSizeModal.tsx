import { useState } from 'react';

interface MapSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (width: number, height: number) => void;
  currentWidth: number;
  currentHeight: number;
}

export default function MapSizeModal({ isOpen, onClose, onConfirm, currentWidth, currentHeight }: MapSizeModalProps) {
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);

  if (!isOpen) return null;

  const presets = [
    { name: 'Pequeno (20×20)', w: 20, h: 20 },
    { name: 'Médio (30×30)', w: 30, h: 30 },
    { name: 'Grande (40×40)', w: 40, h: 40 },
    { name: 'Muito Grande (50×50)', w: 50, h: 50 },
    { name: 'Retangular (40×25)', w: 40, h: 25 },
    { name: 'Largo (60×30)', w: 60, h: 30 },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] rounded-xl p-6 max-w-md w-full mx-4 border border-[#2a2a4a] shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">📐 Tamanho do Mapa</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Largura (colunas)</label>
              <input
                type="number"
                min="5"
                max="100"
                value={width}
                onChange={e => setWidth(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-[#0f0f1a] rounded-lg text-white border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Altura (linhas)</label>
              <input
                type="number"
                min="5"
                max="100"
                value={height}
                onChange={e => setHeight(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-[#0f0f1a] rounded-lg text-white border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map(p => (
                <button
                  key={p.name}
                  onClick={() => { setWidth(p.w); setHeight(p.h); }}
                  className="px-3 py-2 bg-[#0f0f1a] rounded-lg text-sm text-gray-300 hover:text-white hover:bg-indigo-600/20 border border-[#2a2a4a] hover:border-indigo-500/50 transition-all"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#2a2a4a] text-gray-300 rounded-lg hover:bg-[#3a3a5a] transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={() => { onConfirm(width, height); onClose(); }}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
