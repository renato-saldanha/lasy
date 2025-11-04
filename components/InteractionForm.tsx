'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface InteractionFormProps {
  leadId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function InteractionForm({ leadId, onSuccess, onCancel }: InteractionFormProps) {
  const [formData, setFormData] = useState({
    tipo: 'observacao' as 'email' | 'telefone' | 'reuniao' | 'observacao' | 'outro',
    descricao: '',
    data: new Date().toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('interactions')
        .insert([{
          lead_id: leadId,
          tipo: formData.tipo,
          descricao: formData.descricao,
          data: new Date(formData.data).toISOString(),
          user_id: user.id,
        }]);

      if (error) throw error;
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Erro ao salvar interação');
      } else {
        setError('Erro ao salvar interação');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="font-semibold text-[#222651] mb-4">Nova Interação</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo *
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as typeof formData.tipo })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078b7] focus:border-transparent outline-none"
            >
              <option value="observacao">Observação</option>
              <option value="email">E-mail</option>
              <option value="telefone">Telefone</option>
              <option value="reuniao">Reunião</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data/Hora *
            </label>
            <input
              type="datetime-local"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078b7] focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <textarea
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078b7] focus:border-transparent outline-none"
            placeholder="Descreva a interação..."
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#00b4d8] text-white rounded-lg hover:bg-[#0088a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar Interação'}
          </button>
        </div>
      </form>
    </div>
  );
}

