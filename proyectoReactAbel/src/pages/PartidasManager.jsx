import React from "react";
export default function PartidasManager(){
    const partidas = [];
    return (
        <div className="animate-fade-in w-full max-w-6xl mx-auto">
            <h2 className="text-isaac-flesh border-b border-isaac-border pb-2 mb-6 text-xl font-bold mt-0">
                Runs (Partidas)
            </h2>

            {/* FORMULARIO */}
            <div className="bg-isaac-panel p-5 rounded-lg mb-6 border border-dashed border-isaac-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end shadow-lg">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Jugador</label>
                    <select className="bg-black border border-isaac-border text-white p-2 rounded text-sm focus:outline-none focus:border-isaac-red transition-colors">
                        <option>Cargando...</option>
                    </select>
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estado</label>
                    <select className="bg-black border border-isaac-border text-white p-2 rounded text-sm focus:outline-none focus:border-isaac-red transition-colors">
                        <option value="EN_PROGRESO">En Progreso</option>
                        <option value="VICTORIA">Victoria</option>
                        <option value="MUERTO">Muerto</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button className="bg-isaac-green hover:brightness-110 text-white font-bold py-2 px-4 rounded text-xs uppercase transition shadow-md cursor-pointer">
                        Guardar
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded text-xs uppercase transition shadow-md cursor-pointer">
                        Limpiar
                    </button>
                </div>
            </div>

            {/* TABLA */}
            <div className="bg-isaac-panel rounded-lg overflow-hidden shadow-xl border border-isaac-border">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                {['ID', 'Jugador', 'Personaje', 'Modo', 'Estado', 'Items', 'Acciones'].map(h => (
                                    <th key={h} className="bg-[#2a2a2a] text-isaac-flesh text-[10px] uppercase p-4 border-b border-isaac-border font-bold tracking-wider whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {partidas.map((p) => (
                                <tr key={p.id} className="hover:bg-[#333] transition-colors border-b border-[#333] last:border-0">
                                    <td className="p-4">{p.id}</td>
                                    <td className="p-4">{p.jugador}</td>
                                    <td className="p-4">{p.personaje}</td>
                                    <td className="p-4 text-xs font-mono">{p.modo}</td>
                                    <td className="p-4 font-bold text-xs">
                                        <span className={`px-2 py-1 rounded ${
                                            p.estado === 'VICTORIA' ? 'bg-green-900/30 text-green-400 border border-green-800' : 
                                            p.estado === 'MUERTO' ? 'bg-red-900/30 text-red-400 border border-red-800' : 'text-white'
                                        }`}>
                                            {p.estado}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="bg-isaac-purple hover:bg-purple-600 text-white text-[10px] py-1.5 px-3 rounded font-bold uppercase transition shadow-sm cursor-pointer">
                                            🎒 Items
                                        </button>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <button className="bg-isaac-blue hover:bg-blue-600 text-white text-[10px] py-1.5 px-3 rounded font-bold transition shadow-sm cursor-pointer">EDITAR</button>
                                        <button className="bg-isaac-red hover:bg-red-600 text-white text-[10px] py-1.5 px-3 rounded font-bold transition shadow-sm cursor-pointer">X</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}