import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginView() {
  const { login, register } = useAuth(); // Importamos register
  const [isRegistering, setIsRegistering] = useState(false); // Estado para cambiar de modo
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); // Mensaje de éxito al registrarse

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isRegistering) {
      // Lógica de REGISTRO
      const result = await register(email, password);
      if (result.success) {
        setSuccessMsg('¡Cuenta creada! Ahora puedes iniciar sesión.');
        setIsRegistering(false); // Volvemos al login
        setPassword(''); // Limpiamos pass
      } else {
        setError(result.error || 'Error al crear cuenta');
      }
    } else {
      // Lógica de LOGIN
      const result = await login(email, password);
      if (!result.success) {
        setError('Credenciales incorrectas');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-bg-dark">
      <div className="w-full max-w-md bg-panel-bg p-8 rounded-lg border-2 border-accent-red shadow-[0_0_20px_rgba(211,47,47,0.3)]">
        
        <h1 className="text-center font-pixel text-accent-red text-xl mb-6 leading-relaxed drop-shadow-[2px_2px_0_#fff]">
          {isRegistering ? 'NEW GAME' : 'CONTINUE'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-isaac-flesh text-xs font-bold mb-2 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-border-gray text-white p-3 rounded text-sm focus:border-accent-red outline-none focus:ring-1 focus:ring-accent-red"
              placeholder="usuario@isaac.com"
              required
            />
          </div>

          <div>
            <label className="block text-isaac-flesh text-xs font-bold mb-2 uppercase">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-border-gray text-white p-3 rounded text-sm focus:border-accent-red outline-none focus:ring-1 focus:ring-accent-red"
              placeholder="••••••"
              required
              minLength={isRegistering ? 6 : 1} // Validación básica frontend
            />
            {isRegistering && <span className="text-[10px] text-gray-500 mt-1 block">*Mínimo 6 caracteres</span>}
          </div>

          {/* Mensajes de error y éxito */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs p-3 rounded text-center font-bold animate-pulse">
              💀 {error}
            </div>
          )}
          
          {successMsg && (
            <div className="bg-green-900/50 border border-green-500 text-green-200 text-xs p-3 rounded text-center font-bold">
              ✨ {successMsg}
            </div>
          )}

          <button
            type="submit"
            className={`
              font-bold py-3 px-4 rounded text-sm uppercase transition-all mt-2 font-pixel text-white
              ${isRegistering ? 'bg-accent-blue hover:brightness-110' : 'bg-accent-red hover:brightness-110'}
            `}
          >
            {isRegistering ? 'CREATE SAVE FILE' : 'START RUN'}
          </button>
        </form>
        
        {/* Toggle Login/Registro */}
        <div className="mt-6 text-center pt-4 border-t border-border-gray">
          <p className="text-gray-400 text-xs mb-2">
            {isRegistering ? '¿Ya tienes partida?' : '¿Primera vez aquí?'}
          </p>
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setSuccessMsg('');
            }}
            className="text-isaac-flesh hover:text-white text-xs font-bold uppercase underline"
          >
            {isRegistering ? '-> Ir a Login' : '-> Crear Cuenta'}
          </button>
        </div>

      </div>
    </div>
  );
}