import { useState } from 'react';

interface ShowcaseMap {
  id: string;
  title: string;
  author: string;
  tags: string[];
  description: string;
  date: string;
  grid: (string | null)[][];
  likes: number;
}

const SAMPLE_MAPS: ShowcaseMap[] = [
  {
    id: '1',
    title: 'Masmorra do Dragão Ancião',
    author: 'MestreCorvus',
    tags: ['dragão', 'masmorra', 'fantasia'],
    description: 'Uma masmorra profunda habitada por um dragão vermelho ancião. Salas de tesouro, armadilhas de lava e corredores sinuosos.',
    date: '2026-10-15',
    grid: [],
    likes: 142,
  },
  {
    id: '2',
    title: 'Taverna do Javali Dourado',
    author: 'RPGBrasil',
    tags: ['taverna', 'urbano', 'social'],
    description: 'Uma aconchegante taverna no centro da cidade. Perfeita para encontros sociais e início de aventuras.',
    date: '2026-10-12',
    grid: [],
    likes: 89,
  },
  {
    id: '3',
    title: 'Templo Submerso de Aquarys',
    author: 'DungeonMaster42',
    tags: ['templo', 'aquático', 'puzzle'],
    description: 'Ruínas de um templo antigo submerso em águas profundas. Puzzles aquáticos e criaturas abissais.',
    date: '2026-10-08',
    grid: [],
    likes: 201,
  },
  {
    id: '4',
    title: 'Castelo de Winterhold',
    author: 'NordicGM',
    tags: ['castelo', 'gelo', 'medieval'],
    description: 'Um castelo fortificado nas montanhas geladas do norte. Muralhas duplas, torre de menagem e masmorras secretas.',
    date: '2026-10-05',
    grid: [],
    likes: 167,
  },
  {
    id: '5',
    title: 'Floresta Encantada de Elara',
    author: 'FantasyMaps',
    tags: ['floresta', 'natureza', 'fada'],
    description: 'Uma floresta mágica habitada por fadas e criaturas feéricas. Clareiras sagradas e círculos de cogumelos.',
    date: '2026-10-01',
    grid: [],
    likes: 123,
  },
  {
    id: '6',
    title: 'Laboratório do Alquimista',
    author: 'PotionMaster',
    tags: ['laboratório', 'urbano', 'puzzle'],
    description: 'O laboratório secreto de um alquimista louco. Frascos explosivos, armadilhas químicas e fórmulas perigosas.',
    date: '2026-09-28',
    grid: [],
    likes: 95,
  },
];

const ALL_TAGS = ['dragão', 'masmorra', 'fantasia', 'taverna', 'urbano', 'social', 'templo', 'aquático', 'puzzle', 'castelo', 'gelo', 'medieval', 'floresta', 'natureza', 'fada', 'laboratório'];

interface ShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadMap: (grid: (string | null)[][]) => void;
}

export default function ShowcaseModal({ isOpen, onClose, onLoadMap }: ShowcaseModalProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredMaps = SAMPLE_MAPS.filter(map => {
    const matchesTag = !selectedTag || map.tags.includes(selectedTag);
    const matchesSearch = !searchQuery ||
      map.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      map.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      map.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] rounded-xl max-w-4xl w-full mx-4 border border-[#2a2a4a] shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a4a]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🖼️ Galeria de Mapas
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Tags */}
          <div className="w-48 p-3 border-r border-[#2a2a4a] overflow-y-auto">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
              Categorias
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedTag(null)}
                className={`w-full text-left px-2 py-1 rounded text-sm transition-all ${
                  !selectedTag ? 'bg-indigo-600/30 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Todos
              </button>
              {ALL_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`w-full text-left px-2 py-1 rounded text-sm transition-all ${
                    selectedTag === tag ? 'bg-indigo-600/30 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-[#2a2a4a]">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="🔍 Buscar mapas..."
                className="w-full px-3 py-2 bg-[#0f0f1a] rounded-lg text-white text-sm border border-[#2a2a4a] focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Map Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMaps.map(map => (
                  <div
                    key={map.id}
                    className="bg-[#0f0f1a] rounded-lg border border-[#2a2a4a] overflow-hidden hover:border-indigo-500/50 transition-all group"
                  >
                    {/* Preview */}
                    <div className="h-32 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 flex items-center justify-center relative">
                      <span className="text-4xl opacity-50">🗺️</span>
                      <div className="absolute top-2 right-2 bg-black/50 text-amber-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        ❤️ {map.likes}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h4 className="text-white font-medium text-sm truncate">{map.title}</h4>
                      <p className="text-gray-500 text-xs mt-0.5">por {map.author}</p>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{map.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {map.tags.map(tag => (
                          <span key={tag} className="text-xs bg-indigo-600/20 text-indigo-300 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          // Generate a simple map for demo
                          const grid = Array.from({ length: 20 }, () => Array(20).fill(null));
                          for (let y = 2; y < 18; y++) {
                            for (let x = 2; x < 18; x++) {
                              if (y === 2 || y === 17 || x === 2 || x === 17) {
                                grid[y][x] = 'wall';
                              } else {
                                grid[y][x] = 'floor';
                              }
                            }
                          }
                          onLoadMap(grid);
                          onClose();
                        }}
                        className="mt-2 w-full px-3 py-1.5 bg-indigo-600/20 text-indigo-300 text-xs rounded hover:bg-indigo-600/40 transition-all"
                      >
                        📥 Baixar Mapa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMaps.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-4xl">🔍</span>
                  <p className="text-gray-400 mt-2">Nenhum mapa encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
