import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

// Configuración de metadatos (igual que en el HTML original)
const SCHEMAS = {
  personajes: {
    fields: [
      { name: 'nombre', type: 'text', label: 'Nombre' },
      { name: 'numCorazones', type: 'number', label: 'HP', step: 1 },
      { name: 'tipoCorazon', type: 'select', label: 'Tipo', options: ['CORAZON_ROJO','CORAZON_AZUL','CORAZON_OSCURO','CORAZON_HUESO'] },
      { name: 'ataque', type: 'number', label: 'Daño', step: 0.1 },
      { name: 'velocidad', type: 'number', label: 'Velocidad', step: 0.1 },
      { name: 'velocidadLagrimas', type: 'number', label: 'Cadencia', step: 0.1 },
      { name: 'rango', type: 'number', label: 'Rango', step: 0.1 },
      { name: 'suerte', type: 'number', label: 'Suerte', step: 0.1 }
    ]
  },
  jugadores: {
    fields: [
      { name: 'nombre', type: 'text', label: 'Nombre' },
      { name: 'email', type: 'email', label: 'Email' }
    ]
  },
  objetos: {
    fields: [
      { name: 'nombre', type: 'text', label: 'Nombre' },
      { name: 'descripcion', type: 'text', label: 'Descripción' },
      { name: 'categoria', type: 'relation', label: 'Categoría', endpoint: '/categorias', displayKey: 'nombreCategoria' }
    ]
  },
  enemigos: {
    fields: [
      { name: 'nombreEnemigo', type: 'text', label: 'Nombre' },
      { name: 'vida', type: 'number', label: 'Vida', step: 1 },
      { name: 'tipo', type: 'select', label: 'Tipo', options: ['NORMAL','JEFE','MINI_JEFE'] } // Asumiendo estos valores
    ]
  },
  categorias: {
    fields: [
      { name: 'nombreCategoria', type: 'text', label: 'Nombre Categoría' }
    ]
  }
};

export default function GenericCrudView({ section }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({});
  const [relations, setRelations] = useState({}); // Para guardar datos de selects (ej: categorias)
  const { showToast } = useToast();
  
  const config = SCHEMAS[section];

  useEffect(() => {
    loadData();
    setForm({}); // Reset form al cambiar sección
    loadRelations();
  }, [section]);

  const loadData = async () => {
    // Ajuste de paginación para objetos/categorias como en el original
    let url = `/${section}`;
    if (['objetos', 'categorias'].includes(section)) url += '?page=0&size=50';
    const res = await api.get(url);
    if (res?.content) setData(res.content);
  };

  const loadRelations = async () => {
    if (!config) return;
    const rels = {};
    for (const field of config.fields) {
      if (field.type === 'relation') {
        const res = await api.get(field.endpoint);
        if (res?.content) rels[field.name] = res.content;
      }
    }
    setRelations(rels);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Procesar datos antes de enviar (ej: objetos anidados para relaciones)
      const payload = { ...form };
      config.fields.forEach(f => {
        if (f.type === 'relation' && payload[f.name]) {
          payload[f.name] = { id: payload[f.name] }; // Backend espera { id: X }
        }
      });

      await api.save(`/${section}`, payload, form.id);
      showToast(`${section.slice(0,-1)} guardado`); // Truco para singular
      setForm({});
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar elemento?")) {
      await api.delete(`/${section}/${id}`);
      loadData();
    }
  };

  const handleEdit = (item) => {
    // Aplanar objeto para el formulario
    const newForm = { id: item.id };
    config.fields.forEach(f => {
        if (f.type === 'relation') {
            newForm[f.name] = item[f.name]?.id || '';
        } else {
            newForm[f.name] = item[f.name];
        }
    });
    setForm(newForm);
  };

  if (!config) return <div className="text-red-500">Configuración no encontrada para {section}</div>;

  return (
    <div className="animate-fade-in">
      <h2 className="text-isaac-flesh border-b border-border-gray pb-2 mb-4 text-xl font-bold uppercase">Gestión de {section}</h2>

      {/* FORMULARIO DINÁMICO */}
      <form onSubmit={handleSubmit} className="bg-panel-bg p-4 rounded mb-6 border border-dashed border-border-gray grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
        {config.fields.map(field => (
          <div key={field.name} className="flex flex-col">
            <label className="text-[10px] text-gray-400 font-bold mb-1 uppercase">{field.label}</label>
            
            {field.type === 'select' && (
               <select 
                 className="bg-black border border-border-gray text-white p-2 rounded text-sm focus:border-accent-red outline-none"
                 value={form[field.name] || ''}
                 onChange={e => setForm({...form, [field.name]: e.target.value})}
               >
                 <option value="">Selecciona</option>
                 {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
               </select>
            )}

            {field.type === 'relation' && (
                <select
                    className="bg-black border border-border-gray text-white p-2 rounded text-sm focus:border-accent-red outline-none"
                    value={form[field.name] || ''}
                    onChange={e => setForm({...form, [field.name]: e.target.value})}
                >
                    <option value="">Selecciona</option>
                    {relations[field.name]?.map(r => (
                        <option key={r.id} value={r.id}>{r[field.displayKey]}</option>
                    ))}
                </select>
            )}

            {(field.type === 'text' || field.type === 'number' || field.type === 'email') && (
                <input 
                    type={field.type}
                    step={field.step}
                    className="bg-black border border-border-gray text-white p-2 rounded text-sm focus:border-accent-red outline-none w-full"
                    value={form[field.name] || ''}
                    onChange={e => setForm({...form, [field.name]: e.target.value})}
                />
            )}
          </div>
        ))}
        
        <div className="flex gap-2">
            <button type="submit" className="bg-accent-green hover:brightness-110 text-white font-bold py-2 px-4 rounded text-xs uppercase h-10">Guardar</button>
            {form.id && <button type="button" onClick={() => setForm({})} className="bg-gray-600 px-3 rounded text-white text-xs font-bold">Cancelar</button>}
        </div>
      </form>

      {/* TABLA GENÉRICA */}
      <div className="bg-panel-bg rounded border border-border-gray overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-[#2a2a2a] text-isaac-flesh text-[10px] uppercase">
                <tr>
                    <th className="p-3">ID</th>
                    {config.fields.map(f => <th key={f.name} className="p-3">{f.label}</th>)}
                    <th className="p-3">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border-gray text-sm">
                {data.map(item => (
                    <tr key={item.id} className="hover:bg-[#333]">
                        <td className="p-3 text-gray-500">{item.id}</td>
                        {config.fields.map(f => {
                            let val = item[f.name];
                            if(f.type === 'relation') val = item[f.name]?.[f.displayKey] || '-';
                            return <td key={f.name} className="p-3">{val}</td>
                        })}
                        <td className="p-3 flex gap-2">
                            <button onClick={() => handleEdit(item)} className="bg-accent-blue px-2 py-1 rounded text-[10px] font-bold text-white">E</button>
                            <button onClick={() => handleDelete(item.id)} className="bg-accent-red px-2 py-1 rounded text-[10px] font-bold text-white">X</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}