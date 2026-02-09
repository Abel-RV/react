import React from 'react';

const menuItems = [
  { id: 'partidas', label: 'PARTIDAS' },
  { id: 'mapas', label: 'MAPAS' },
  { id: 'personajes', label: 'PERSONAJES' },
  { id: 'enemigos', label: 'ENEMIGOS' },
  { id: 'objetos', label: 'OBJETOS' },
  { id: 'categorias', label: 'CATEGORÍAS' },
  { id: 'jugadores', label: 'JUGADORES' },
];

export default function Sidebar({ activeSection, setSection }) {
  return (
    <aside className="w-64 bg-black border-r-4 border-accent-red flex flex-col p-5 overflow-y-auto shrink-0">
      <h1 className="font-pixel text-accent-red text-sm text-center mb-8 leading-relaxed drop-shadow-[2px_2px_0_#fff]">
        THE BINDING<br />OF API
      </h1>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            className={`
              font-pixel text-[10px] text-left p-4 transition-all duration-200 border-l-4
              ${activeSection === item.id 
                ? 'text-white bg-neutral-800 border-accent-red pl-6' 
                : 'text-gray-500 border-transparent hover:text-white hover:bg-neutral-900'}
            `}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}