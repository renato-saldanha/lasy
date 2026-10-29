'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { getErrorMessage } from '@/lib/errors';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
  const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;
  const hasDemo = Boolean(demoEmail && demoPassword);

  const signIn = async (emailValue: string, passwordValue: string) => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailValue,
        password: passwordValue,
      });

      if (error) throw error;

      if (data.user) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao fazer login'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#222651] to-[#0078b7] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#222651] mb-2">CRM</h1>
            <p className="text-gray-600">Sistema de Gestão de Leads</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {hasDemo && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
              <p className="font-semibold text-[#222651] mb-1">Modo demonstração</p>
              <p>
                Conta de teste: <strong>{demoEmail}</strong> / <strong>{demoPassword}</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Dados fictícios, compartilhados por todos os visitantes.
              </p>
              <button
                type="button"
                onClick={() => signIn(demoEmail!, demoPassword!)}
                disabled={loading}
                className="mt-3 w-full border border-[#0078b7] text-[#0078b7] py-2 rounded-lg font-semibold hover:bg-[#0078b7] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Entrar com a conta de demonstração
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078b7] focus:border-transparent outline-none"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078b7] focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0078b7] text-white py-3 rounded-lg font-semibold hover:bg-[#005a87] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-[#0078b7] font-semibold hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

