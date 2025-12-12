'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  // Estados para los inputs y el manejo de errores
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulación de una pequeña espera para dar sensación de procesamiento
    setTimeout(() => {
      // Lógica de autenticación local
      if (username === 'pepito' && password === '1234') {
        router.push('/dashboard');
      } else {
        setError('Usuario o contraseña incorrectos.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#FF9A35] via-[#FF4D22] to-[#FF2E56]">
      {/* Contenedor principal (Card) */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01]">
        
        {/* Encabezado / Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            La<span className='text-primary'>Carta!</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Bienvenido de nuevo
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input Usuario */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF4D22] focus:border-transparent outline-none transition-all"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          {/* Input Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF4D22] focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Mensaje de Error Elegante */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          {/* Botón de Ingresar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF4D22] hover:bg-[#E03E15] text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4D22] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Footer pequeño */}
        <div className="mt-6 text-center text-xs text-gray-400">
          © 2025 LaCarta App
        </div>
      </div>
    </div>
  );
}