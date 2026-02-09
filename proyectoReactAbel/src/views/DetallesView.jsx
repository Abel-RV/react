import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

export default function DetallesView({ context, parentId, onBack }) {
  const [data, setData] = useState(null);
  const [allObjetos, setAllObjetos] = useState([]);
  const [allEnemigos, setAllEnemigos] = useState([]);
  
  // Selects
  const [selectedObj, setSelectedObj] = useState('');
  const [selectedEne, setSelectedEne] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    loadDetails();
    loadSelects();
  }, [context, parentId]);

  const loadDetails = async () => {
    const res = await api.get(`/${context}/${parentId}`);
    if (res) setData(res);
  };

  const loadSelects = async () => {
    const objs = await api.get('/objetos?page=0&size=100');
    if (objs?.content) setAllObjetos(objs.content);

    if (context === 'partidas') {
      const enes = await api.get('/enemigos');
      if (enes?.content) setAllEnemigos(enes.content);
    }
  };

  const handleAddRelation = async (type) => {
    const itemId = type === 'objetos' ? selectedObj : selectedEne;
    if (!itemId) return showToast('Selecciona un elemento', 'error');

    try {
      await api.save(`/${context}/${parentId}/${type}/${itemId}`, {}, null); // Usamos save como POST a endpoint especial
      showToast('Añadido correctamente');
      loadDetails();
    } catch (e) {
      showToast('Error al añadir', 'error');
    }
  };

  if (!data) return <div>Cargando detalles...</div>;

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-gray">
        <h2 className="text-xl font-bold text-white">
          {context === 'partidas' ? `🎒 Inventario Run #${parentId}` : `🗺️ Contenido Sala #${parentId}`}
        </h2>
        <button onClick={onBack} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded text-xs uppercase">
          🔙 Volver
        </button>
      </div>

      <div className={`grid gap-6 ${context === 'partidas' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* PANEL OBJETOS */}
        <div className="bg-neutral-900 border border-border-gray rounded-lg p-5">
          <h3 className="text-isaac-flesh text-sm uppercase font-bold mb-4 border-b border-gray-700 pb-2">💎 Objetos</h3>
          
          <div className="flex gap-2 mb-4">
            <select 
              className="flex-1 bg-black border border-border-gray text-white p-2 rounded text-sm"
              value={selectedObj} onChange={e => setSelectedObj(e.target.value)}
            >
              <option value="">Añadir Objeto...</option>
              {allObjetos.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
            </select>
            <button onClick={() => handleAddRelation('objetos')} className="bg-accent-green px-4 py-2 rounded font-bold text-white text-xs">AÑADIR</button>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.objetos && data.objetos.length > 0 ? (
                data.objetos.map(o => (
                    <span key={o.id} className="bg-black border border-gray-700 text-gray-300 px-3 py-1 rounded text-xs flex items-center gap-2">
                        🔹 {o.nombre}
                    </span>
                ))
            ) : <span className="text-gray-600 text-xs italic">Vacío</span>}
          </div>
        </div>

        {/* PANEL ENEMIGOS (Solo para partidas) */}
        {context === 'partidas' && (
          <div className="bg-neutral-900 border border-border-gray rounded-lg p-5">
            <h3 className="text-accent-red text-sm uppercase font-bold mb-4 border-b border-gray-700 pb-2">💀 Enemigos Derrotados</h3>
            
            <div className="flex gap-2 mb-4">
              <select 
                className="flex-1 bg-black border border-border-gray text-white p-2 rounded text-sm"
                value={selectedEne} onChange={e => setSelectedEne(e.target.value)}
              >
                <option value="">Añadir Enemigo...</option>
                {allEnemigos.map(e => <option key={e.id} value={e.id}>{e.nombreEnemigo}</option>)}
              </select>
              <button onClick={() => handleAddRelation('enemigos')} className="bg-accent-red px-4 py-2 rounded font-bold text-white text-xs">AÑADIR</button>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.enemigos && data.enemigos.length > 0 ? (
                  data.enemigos.map(e => (
                      <span key={e.id} className="bg-black border border-gray-700 text-gray-300 px-3 py-1 rounded text-xs flex items-center gap-2">
                          👹 {e.nombreEnemigo}
                      </span>
                  ))
              ) : <span className="text-gray-600 text-xs italic">Vacío</span>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}