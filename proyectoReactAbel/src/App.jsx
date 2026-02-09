import { useState } from 'react';
import Sidebar from './components/Sidebar';
import PartidasView from './views/PartidasView';
import MapasView from './views/MapasView';
import GenericCrudView from './views/GenericCrudView';
import DetallesView from './views/DetallesView';
import LoginView from './views/LoginView'; // [!code ++]
import { ToastProvider } from './components/Toast';
import { AuthProvider, useAuth } from './context/AuthContext'; // [!code ++]

// Creamos un componente interno para separar la lógica de renderizado
function MainLayout() {
  const { isAuthenticated, logout } = useAuth(); // [!code ++]
  
  const [viewState, setViewState] = useState({ 
    section: 'partidas', 
    mode: 'list',
    detailId: null 
  });

  // Si no está logueado, mostramos el Login
  if (!isAuthenticated) { // [!code ++]
    return <LoginView />; // [!code ++]
  }

  // --- LÓGICA DE NAVEGACIÓN NORMAL ---
  const navigateToSection = (sectionId) => {
    setViewState({ section: sectionId, mode: 'list', detailId: null });
  };

  const navigateToDetails = (context, id) => {
    setViewState({ section: context, mode: 'details', detailId: id });
  };

  const renderContent = () => {
    if (viewState.mode === 'details') {
      return (
        <DetallesView 
          context={viewState.section} 
          parentId={viewState.detailId} 
          onBack={() => setViewState({ ...viewState, mode: 'list' })} 
        />
      );
    }

    switch (viewState.section) {
      case 'partidas':
        return <PartidasView onNavigateDetails={(ctx, id) => navigateToDetails(ctx, id)} />;
      case 'mapas':
        return <MapasView onNavigateDetails={(ctx, id) => navigateToDetails(ctx, id)} />;
      default:
        return <GenericCrudView section={viewState.section} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-bg-dark text-text-main font-roboto overflow-hidden">
      <Sidebar activeSection={viewState.section} setSection={navigateToSection} />
      
      <main className="flex-1 p-8 overflow-y-auto relative flex flex-col">
        {/* Botón de Logout flotante arriba a la derecha */}
        <div className="absolute top-4 right-8 z-10">
            <button onClick={logout} className="text-xs text-red-500 hover:text-white font-bold uppercase border border-red-900 bg-black px-3 py-1 rounded">
                Cerrar Sesión
            </button>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}

// App principal envuelta en los Providers
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainLayout />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;