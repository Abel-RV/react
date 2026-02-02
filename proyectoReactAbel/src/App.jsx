import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import PartidasManager from './pages/PartidasManager.jsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [section, setSection] = useState('partidas');

  return (
    <div className="flex h-screen w-full bg-isaac-dark text-gray-200 font-roboto overflow-hidden">
      <Sidebar currentSection={section} setSection={setSection} />
      
      <main className="flex-1 p-8 overflow-y-auto relative bg-isaac-dark">
        {section === 'partidas' && <PartidasManager />}
        
        {section === 'mapas' && (
            <div className="text-center mt-20 text-gray-500">
                <h2 className="text-xl">Gestor de Mapas (Próximamente)</h2>
            </div>
        )}
        
        {/* Agrega el resto de condicionales aquí */}
      </main>
    </div>
  );
}

export default App;
