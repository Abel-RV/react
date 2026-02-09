import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function PartidasView({ onNavigateDetails }) {
  const [partidas, setPartidas] = useState([]);
  const [form, setForm] = useState({ tipoJuego: 'NORMAL', estadoJugador: 'EN_PROGRESO', jugadorId: '', personajeId: '' });
  
  const [jugadores, setJugadores] = useState([]);
  const [personajes, setPersonajes] = useState([]);

  useEffect(() => {
    loadData();
    loadSelects();
  }, []);

  const loadData = async () => {
    const data = await api.get('/partidas');
    if (data && data.content) setPartidas(data.content);
  };

  const loadSelects = async () => {
    const j = await api.get('/jugadores');
    const p = await api.get('/personajes');
    if (j) setJugadores(j.content || []);
    if (p) setPersonajes(p.content || []);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar partida?')) {
      await api.delete(`/partidas/${id}`);
      loadData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      tipoJuego: form.tipoJuego,
      estadoJugador: form.estadoJugador,
      jugador: { id: form.jugadorId },
      personaje: { id: form.personajeId }
    };
    await api.save('/partidas', payload);
    loadData();
    setForm({ ...form, estadoJugador: 'EN_PROGRESO' });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-isaac-flesh border-b border-border-gray pb-2 mb-4 text-xl font-bold">Runs (Partidas)</h2>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="bg-panel-bg p-5 rounded-lg border border-dashed border-border-gray mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-[10px] text-gray-400 font-bold mb-1 uppercase">Jugador</label>
          <select 
            className="bg-black border border-border-gray text-white p-2 rounded text-sm focus:border-accent-red outline-none"
            value={form.jugadorId}
            onChange={e => setForm({...form, jugadorId: e.target.value})}
            required
          >
            <option value="">Selecciona...</option>
            {jugadores.map(j => <option key={j.id} value={j.id}>{j.nombre}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] text-gray-400 font-bold mb-1 uppercase">Personaje</label>
          <select 
            className="bg-black border border-border-gray text-white p-2 rounded text-sm focus:border-accent-red outline-none"
            value={form.personajeId}
            onChange={e => setForm({...form, personajeId: e.target.value})}
            required
          >
            <option value="">Selecciona...</option>
            {personajes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] text-gray-400 font-bold mb-1 uppercase">Estado</label>
          <select 
            className="bg-black border border-border-gray text-white p-2 rounded text-sm focus:border-accent-red outline-none"
            value={form.estadoJugador}
            onChange={e => setForm({...form, estadoJugador: e.target.value})}
          >
            <option value="EN_PROGRESO">En Progreso</option>
            <option value="VICTORIA">Victoria</option>
            <option value="MUERTO">Muerto</option>
          </select>
        </div>

        <button type="submit" className="bg-accent-green hover:brightness-110 text-white font-bold py-2 px-4 rounded text-xs uppercase h-10 transition-all">
          GUARDAR RUN
        </button>
      </form>

      {/* TABLA */}
      <div className="bg-panel-bg rounded-lg overflow-hidden shadow-lg border border-border-gray">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-[#2a2a2a] text-isaac-flesh text-[10px] uppercase">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Jugador</th>
              <th className="p-3">Personaje</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-gray">
            {partidas.map((p) => (
              <tr key={p.id} className="hover:bg-[#333] transition-colors">
                <td className="p-3 text-sm">{p.id}</td>
                <td className="p-3 text-sm">{p.jugador?.nombre}</td>
                <td className="p-3 text-sm">{p.personaje?.nombre}</td>
                <td className="p-3 text-sm font-bold">
                  <span className={
                    p.estadoJugador === 'VICTORIA' ? 'text-green-500' : 
                    p.estadoJugador === 'MUERTO' ? 'text-red-500' : 'text-white'
                  }>
                    {p.estadoJugador}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => onNavigateDetails('partidas', p.id)} className="bg-accent-purple px-2 py-1 rounded text-[10px] font-bold text-white hover:brightness-110">ITEMS</button>
                  <button onClick={() => handleDelete(p.id)} className="bg-accent-red px-2 py-1 rounded text-[10px] font-bold text-white hover:brightness-110">X</button>
                </td>
              </tr>
            ))}
            {partidas.length === 0 && (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">No hay partidas registradas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}