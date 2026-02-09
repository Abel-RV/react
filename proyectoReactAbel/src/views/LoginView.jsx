import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-bg-dark w-screen">
      <div className="w-full max-w-md bg-panel-bg p-8 rounded-lg border-2 border-accent-red shadow-[0_0_20px_rgba(211,47,47,0.3)]">
        
        <h1 className="text-center font-pixel text-accent-red text-xl mb-8 leading-relaxed drop-shadow-[2px_2px_0_#fff]">
          THE BINDING<br />OF API
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
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs p-3 rounded text-center font-bold animate-pulse">
              💀 {error}
            </div>
          )}

          <button
            type="submit"
            className="bg-accent-red hover:brightness-110 text-white font-bold py-3 px-4 rounded text-sm uppercase transition-all mt-2 font-pixel"
          >
            START RUN
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-500 text-xs">
          ¿Problemas? Contacta con administración.
        </p>
      </div>
    </div>
  );
}