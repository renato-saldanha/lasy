'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types';
import Header from '@/components/Header';
import KanbanBoard from '@/components/KanbanBoard';
import LeadForm from '@/components/LeadForm';
import SearchAndFilters from '@/components/SearchAndFilters';
import ImportExport from '@/components/ImportExport';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const query = supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm);

    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;

    const matchesDate = !filterDate || lead.created_at.startsWith(filterDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleLeadCreated = () => {
    fetchLeads();
    setShowForm(false);
  };

  const handleLeadUpdated = () => {
    fetchLeads();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-3xl font-bold text-[#222651]">Dashboard</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-[#0078b7] text-white rounded-lg hover:bg-[#005a87] transition-colors"
            >
              {showForm ? 'Cancelar' : '+ Novo Lead'}
            </button>
            <ImportExport leads={leads} onImport={fetchLeads} />
          </div>
        </div>

        {showForm && (
          <div className="mb-6">
            <LeadForm onSuccess={handleLeadCreated} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          filterDate={filterDate}
          onDateChange={setFilterDate}
        />

        <KanbanBoard leads={filteredLeads} onUpdate={handleLeadUpdated} />
      </div>
    </div>
  );
}

