import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

export default function MapasView({ onNavigateDetails }) {
  const [mapas, setMapas] = useState([]);
  const [form, setForm] = useState({ id: '', nombre: '', tipoSala: 'SOTANO' });
  const { showToast } = useToast();

  useEffect(() => { loadMapas(); }, []);

  const loadMapas = async () => {
    const data = await api.get('/mapas');
    if (data?.content) setMapas(data.content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.save('/mapas', { nombre: form.nombre, tipoSala: form.tipoSala }, form.id);
      showToast("Sala guardada correctamente");
      setForm({ id: '', nombre: '', tipoSala: 'SOTANO' });
      loadMapas();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleEdit = (m) => setForm({ id: m.id, nombre: m.nombre, tipoSala: m.tipoSala });
  
  const handleDelete = async (id) => {
    if (confirm("¿Borrar sala?")) {
      await api.delete(`/mapas/${id}`);
      loadMapas();
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-isaac-flesh border-b border-border-gray pb-2 mb-4 text-xl font-bold">Gestión de Salas</h2>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-panel-bg p-4 rounded mb-6 border border-dashed border-border-gray flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-[10px] text-gray-400 font-bold block mb-1">NOMBRE SALA</label>
          <input 
            className="w-full bg-black border border-border-gray text-white p-2 rounded text-sm focus:border-accent-red outline-none"
            value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej: Sala del Tesoro" required 
          />
        </div>
        <div className="w-40">
          <label className="text-[10px] text-gray-400 font-bold block mb-1">TIPO PISO</label>
          <select 
            className="w-full bg-black border border-border-gray text-white p-2 rounded text-sm outline-none"
            value={form.tipoSala} onChange={e => setForm({...form, tipoSala: e.target.value})}
          >
            <option value="SOTANO">Sótano</option><option value="CUEVAS">Cuevas</option>
            <option value="PROFUNDIDADES">Profundidades</option><option value="WOMB">Womb</option>
            <option value="SHEOL">Sheol</option><option value="CATEDRAL">Catedral</option>
          </select>
        </div>
        <div className="flex gap-2">
            <button type="submit" className="bg-accent-green hover:brightness-110 text-white font-bold py-2 px-4 rounded text-xs">GUARDAR</button>
            {form.id && <button type="button" onClick={() => setForm({id:'', nombre:'', tipoSala:'SOTANO'})} className="bg-gray-600 text-white font-bold py-2 px-4 rounded text-xs">CANCELAR</button>}
        </div>
      </form>

      {/* Tabla */}
      <div className="bg-panel-bg rounded border border-border-gray overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#2a2a2a] text-isaac-flesh text-[10px] uppercase">
            <tr><th className="p-3">ID</th><th className="p-3">Nombre</th><th className="p-3">Tipo</th><th className="p-3">Acciones</th></tr>
          </thead>
          <tbody className="divide-y divide-border-gray text-sm">
            {mapas.map(m => (
              <tr key={m.id} className="hover:bg-[#333]">
                <td className="p-3">{m.id}</td>
                <td className="p-3">{m.nombre}</td>
                <td className="p-3">{m.tipoSala}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => onNavigateDetails('mapas', m.id)} className="bg-accent-purple px-2 py-1 rounded text-[10px] font-bold text-white">🗺️ ITEMS</button>
                  <button onClick={() => handleEdit(m)} className="bg-accent-blue px-2 py-1 rounded text-[10px] font-bold text-white">E</button>
                  <button onClick={() => handleDelete(m.id)} className="bg-accent-red px-2 py-1 rounded text-[10px] font-bold text-white">X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}