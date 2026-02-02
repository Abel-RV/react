import React from "react";

export default function Sidebar({currentSection, setSection}) {
    const menuItems=[
        {id:'partidas',label:'PARTIDAS'},
        {id:'mapas',label:'MAPAS'},
        {id:'personajes',label:'PERSONAJES'},
        {id:'enemigos',label:'ENEMIGOS'},
        {id:'objetos',label:'OBJETOS'},
        {id:'categorias',label:'CATEGORIAS'},
        {id:'jugadores',label:'JUGADORES'},
    ];
    
    return (
        <aside className="w-64 bg-black border-r-4 border-isaac-red flex flex-col p-5 overflow-y-auto shrink-0 h-full">
            <h1 className="font-pixel text-isaac-red text-xs text-center mb-8 leading-relaxed drop-shadow-md mt-4">
                THE BINDING<br />OF API
            </h1>

            <nav className="flex flex-col gap-1 w-full">
                {menuItems.map((item)=>(
                    <button
                        key={item.id}
                        onClick={()=> setSection(item.id)}
                        lassName={`
                            w-full text-left p-4 font-pixel text-[10px] transition-all duration-200 border-l-4
                            ${currentSection === item.id 
                                ? 'bg-[#222] text-white border-isaac-red pl-6' 
                                : 'bg-transparent text-gray-500 border-transparent hover:bg-[#111] hover:text-gray-100 hover:pl-5'
                            }
                        `}
                    >{item.label}</button>
                ))}
            </nav>
        </aside>
    );
}