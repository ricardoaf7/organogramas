import React, { useState } from 'react';
import { supabaseEnabled, supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const upsertProfile = async (userId: string, email: string) => {
    if (!supabaseEnabled || !supabase) return;
    await supabase.from('profiles').upsert({ user_id: userId, email }, { onConflict: 'user_id' });
  };

  const signIn = async () => {
    if (!supabaseEnabled || !supabase) {
      setMessage('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
      return;
    }
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    const user = data.user;
    if (user) await upsertProfile(user.id, user.email || email);
    navigate('/');
  };

  const signUp = async () => {
    if (!supabaseEnabled || !supabase) {
      setMessage('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
      return;
    }
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    const user = data.user;
    if (user) await upsertProfile(user.id, user.email || email);
    setMessage('Conta criada! Faça login para continuar.');
  };

  const magicLink = async () => {
    if (!supabaseEnabled || !supabase) {
      setMessage('Supabase não configurado.');
      return;
    }
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage('Email enviado! Verifique sua caixa de entrada.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Entrar</h1>
        {message && <div className="mb-3 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2">{message}</div>}
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={signIn}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm"
          >
            Entrar
          </button>
          <button
            onClick={signUp}
            disabled={loading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded px-3 py-2 text-sm"
          >
            Criar conta
          </button>
          <button
            onClick={magicLink}
            disabled={loading}
            className="w-full bg-purple-100 hover:bg-purple-200 text-purple-800 rounded px-3 py-2 text-sm"
          >
            Magic Link
          </button>
        </div>
      </div>
    </div>
  );
}

