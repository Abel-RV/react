import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

// Configuración de metadatos
const SCHEMAS = {
  personajes: {
    fields: [
      { name: 'nombre', type: 'text', label: 'Nombre', required: true },
      { name: 'numCorazones', type: 'number', label: 'HP', step: 1, min: 0, max: 12 },
      { name: 'tipoCorazon', type: 'select', label: 'Tipo Corazón', options: ['CORAZON_ROJO','CORAZON_AZUL','CORAZON_OSCURO','CORAZON_HUESO'] },
      { name: 'ataque', type: 'number', label: 'Daño', step: 0.1, min: 0 },
      { name: 'velocidad', type: 'number', label: 'Velocidad', step: 0.1, min: 0 },
      { name: 'velocidadLagrimas', type: 'number', label: 'Cadencia', step: 0.1, min: 0 },
      { name: 'rango', type: 'number', label: 'Rango', step: 0.1, min: 0 },
      { name: 'suerte', type: 'number', label: 'Suerte', step: 0.1 }
    ]
  },
  jugadores: {
    fields: [
      { name: 'nombre', type: 'text', label: 'Nombre', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true }
    ]
  },
  objetos: {
    fields: [
      { name: 'nombre', type: 'text', label: 'Nombre', required: true },
      { name: 'descripcion', type: 'text', label: 'Descripción' },
      { name: 'categoria', type: 'relation', label: 'Categoría', endpoint: '/categorias', displayKey: 'nombreCategoria' }
    ]
  },
  enemigos: {
    fields: [
      { name: 'nombreEnemigo', type: 'text', label: 'Nombre', required: true },
      { name: 'vida', type: 'number', label: 'Vida', step: 1, min: 1 },
      { name: 'tipo', type: 'select', label: 'Tipo', options: ['NORMAL','MINI_JEFE','JEFE_PISO','JEFE_FINAL'] }
    ]
  },
  categorias: {
    fields: [
      { name: 'nombreCategoria', type: 'text', label: 'Nombre Categoría', required: true }
    ]
  }
};

export default function GenericCrudView({ section }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({});
  const [relations, setRelations] = useState({});
  const { showToast } = useToast();
  
  const config = SCHEMAS[section];

  useEffect(() => {
    loadData();
    setForm({});
    loadRelations();
  }, [section]);

  const loadData = async () => {
    let url = `/${section}`;
    if (['objetos', 'categorias'].includes(section)) url += '?page=0&size=50';
    
    const res = await api.get(url);
    if (res) {
      setData(res.content || res || []);
    }
  };

  const loadRelations = async () => {
    if (!config) return;
    const rels = {};
    for (const field of config.fields) {
      if (field.type === 'relation') {
        const res = await api.get(field.endpoint);
        if (res) {
          rels[field.name] = res.content || res || [];
        }
      }
    }
    setRelations(rels);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      
      // Procesar relaciones
      config.fields.forEach(f => {
        if (f.type === 'relation' && payload[f.name]) {
          payload[f.name] = { id: parseInt(payload[f.name]) };
        }
        // Convertir números
        if (f.type === 'number' && payload[f.name] !== '') {
          payload[f.name] = parseFloat(payload[f.name]);
        }
      });

      await api.save(`/${section}`, payload, form.id || null);
      showToast(form.id ? 'Actualizado correctamente' : 'Creado correctamente');
      setForm({});
      loadData();
    } catch (err) {
      showToast(err.message || 'Error al guardar', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar elemento?")) {
      const success = await api.delete(`/${section}/${id}`);
      if (success) {
        showToast('Eliminado correctamente');
        loadData();
      } else {
        showToast('Error al eliminar', 'error');
      }
    }
  };

  const handleEdit = (item) => {
    const newForm = { id: item.id };
    config.fields.forEach(f => {
      if (f.type === 'relation') {
        newForm[f.name] = item[f.name]?.id || '';
      } else {
        newForm[f.name] = item[f.name] ?? '';
      }
    });
    setForm(newForm);
  };

  const renderField = (field) => {
    const commonClasses = "bg-black border border-border-gray text-white p-2 rounded text-sm focus:border-accent-red outline-none w-full";
    
    if (field.type === 'select') {
      return (
        <select 
          className={commonClasses}
          value={form[field.name] || ''}
          onChange={e => setForm({...form, [field.name]: e.target.value})}
          required={field.required}
        >
          <option value="">Selecciona</option>
          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }

    if (field.type === 'relation') {
      return (
        <select
          className={commonClasses}
          value={form[field.name] || ''}
          onChange={e => setForm({...form, [field.name]: e.target.value})}
          required={field.required}
        >
          <option value="">Selecciona</option>
          {(relations[field.name] || []).map(r => (
            <option key={r.id} value={r.id}>{r[field.displayKey]}</option>
          ))}
        </select>
      );
    }

    return (
      <input 
        type={field.type}
        step={field.step}
        min={field.min}
        max={field.max}
        className={commonClasses}
        value={form[field.name] || ''}
        onChange={e => setForm({...form, [field.name]: e.target.value})}
        required={field.required}
      />
    );
  };

  const renderCellValue = (item, field) => {
    if (field.type === 'relation') {
      return item[field.name]?.[field.displayKey] || '—';
    }
    return item[field.name] ?? '—';
  };

  if (!config) return <div className="text-red-500">Configuración no encontrada para {section}</div>;

  return (
    <div className="animate-fade-in">
      <h2 className="text-isaac-flesh border-b border-border-gray pb-2 mb-4 text-xl font-bold uppercase">
        Gestión de {section}
      </h2>

      {/* FORMULARIO DINÁMICO */}
      <form onSubmit={handleSubmit} className="bg-panel-bg p-4 rounded mb-6 border border-dashed border-border-gray grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
        {config.fields.map(field => (
          <div key={field.name} className="flex flex-col">
            <label className="text-[10px] text-gray-400 font-bold mb-1 uppercase">
              {field.label} {field.required && <span className="text-accent-red">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
        
        <div className="flex gap-2">
          <button type="submit" className="bg-accent-green hover:brightness-110 text-white font-bold py-2 px-4 rounded text-xs uppercase h-10">
            {form.id ? 'ACTUALIZAR' : 'GUARDAR'}
          </button>
          {form.id && (
            <button 
              type="button" 
              onClick={() => setForm({})} 
              className="bg-gray-600 hover:bg-gray-500 px-3 rounded text-white text-xs font-bold h-10"
            >
              CANCELAR
            </button>
          )}
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
                {config.fields.map(f => (
                  <td key={f.name} className="p-3">{renderCellValue(item, f)}</td>
                ))}
                <td className="p-3 flex gap-2">
                  <button 
                    onClick={() => handleEdit(item)} 
                    className="bg-accent-blue px-2 py-1 rounded text-[10px] font-bold text-white hover:brightness-110"
                  >
                    E
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="bg-accent-red px-2 py-1 rounded text-[10px] font-bold text-white hover:brightness-110"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={config.fields.length + 2} className="p-4 text-center text-gray-500">No hay elementos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}