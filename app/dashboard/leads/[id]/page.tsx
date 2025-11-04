'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lead, Interaction } from '@/types';
import Header from '@/components/Header';
import LeadForm from '@/components/LeadForm';
import InteractionForm from '@/components/InteractionForm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import Link from 'next/link';

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);

  useEffect(() => {
    fetchLead();
    fetchInteractions();
  }, [params.id]);

  const fetchLead = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setLead(data);
    } catch (error) {
      console.error('Erro ao buscar lead:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchInteractions = async () => {
    try {
      const { data, error } = await supabase
        .from('interactions')
        .select('*')
        .eq('lead_id', params.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInteractions(data || []);
    } catch (error) {
      console.error('Erro ao buscar interações:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      alert('Erro ao excluir lead');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0078b7]"></div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <p>Lead não encontrado</p>
        </div>
      </div>
    );
  }

  const statusLabels: Record<Lead['status'], string> = {
    novo: 'Novo',
    contato: 'Em Contato',
    qualificado: 'Qualificado',
    proposta: 'Proposta',
    fechado: 'Fechado',
    perdido: 'Perdido',
  };

  const interactionTypes: Record<Interaction['tipo'], string> = {
    email: 'E-mail',
    telefone: 'Telefone',
    reuniao: 'Reunião',
    observacao: 'Observação',
    outro: 'Outro',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-[#0078b7] hover:underline mb-4 inline-block"
          >
            ← Voltar ao Dashboard
          </Link>
        </div>

        {!editing ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#222651] mb-2">{lead.nome}</h1>
                <span className={`px-3 py-1 rounded-full text-sm text-white ${
                  lead.status === 'fechado' ? 'bg-green-500' :
                  lead.status === 'perdido' ? 'bg-red-500' :
                  lead.status === 'proposta' ? 'bg-[#cc39f3]' :
                  lead.status === 'qualificado' ? 'bg-[#0078b7]' :
                  lead.status === 'contato' ? 'bg-[#00b4d8]' :
                  'bg-[#97d4e5]'
                }`}>
                  {statusLabels[lead.status]}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-[#0078b7] text-white rounded-lg hover:bg-[#005a87] transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <p className="text-gray-900">{lead.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <p className="text-gray-900">{lead.telefone || 'Não informado'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa
                </label>
                <p className="text-gray-900">{lead.empresa || 'Não informado'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origem
                </label>
                <p className="text-gray-900">{lead.origem || 'Não informado'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Criação
                </label>
                <p className="text-gray-900">
                  {format(new Date(lead.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Última Atualização
                </label>
                <p className="text-gray-900">
                  {format(new Date(lead.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>

              {lead.observacoes && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">{lead.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <LeadForm
              lead={lead}
              onSuccess={() => {
                fetchLead();
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#222651]">Histórico de Interações</h2>
            <button
              onClick={() => setShowInteractionForm(!showInteractionForm)}
              className="px-4 py-2 bg-[#00b4d8] text-white rounded-lg hover:bg-[#0088a8] transition-colors"
            >
              {showInteractionForm ? 'Cancelar' : '+ Nova Interação'}
            </button>
          </div>

          {showInteractionForm && (
            <div className="mb-6">
              <InteractionForm
                leadId={lead.id}
                onSuccess={() => {
                  fetchInteractions();
                  setShowInteractionForm(false);
                }}
                onCancel={() => setShowInteractionForm(false)}
              />
            </div>
          )}

          {interactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhuma interação registrada ainda.
            </p>
          ) : (
            <div className="space-y-4">
              {interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="border-l-4 border-[#0078b7] pl-4 py-2 bg-gray-50 rounded-r-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-[#222651]">
                        {interactionTypes[interaction.tipo]}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {format(new Date(interaction.data || interaction.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{interaction.descricao}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

