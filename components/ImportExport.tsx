'use client';

import { useState, useRef } from 'react';
import { Lead } from '@/types';
import { supabase } from '@/lib/supabase';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface ImportExportProps {
  leads: Lead[];
  onImport: () => void;
}

export default function ImportExport({ leads, onImport }: ImportExportProps) {
  const [showImport, setShowImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    const headers = ['nome', 'email', 'telefone', 'empresa', 'status', 'origem', 'observacoes', 'created_at'];
    const csvContent = [
      headers.join(','),
      ...leads.map((lead) =>
        headers.map((header) => {
          const value = lead[header as keyof Lead];
          return typeof value === 'string' && value.includes(',')
            ? `"${value.replace(/"/g, '""')}"`
            : value || '';
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(leads);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, `leads_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleFileImport = async (file: File) => {
    setImporting(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          complete: async (results) => {
            try {
              // Accept each row as a Record<string, unknown> to avoid use of 'any'
              const leadsToInsert = (results.data as Record<string, unknown>[]).map((row) => ({
                nome: typeof row.nome === 'string' && row.nome
                  ? row.nome
                  : typeof row.Nome === 'string' && row.Nome
                    ? row.Nome
                    : '',
                email: typeof row.email === 'string' && row.email
                  ? row.email
                  : typeof row.Email === 'string' && row.Email
                    ? row.Email
                    : '',
                telefone: typeof row.telefone === 'string' && row.telefone
                  ? row.telefone
                  : typeof row.Telefone === 'string' && row.Telefone
                    ? row.Telefone
                    : '',
                empresa: typeof row.empresa === 'string' && row.empresa
                  ? row.empresa
                  : typeof row.Empresa === 'string' && row.Empresa
                    ? row.Empresa
                    : null,
                observacoes: row.observacoes || row.Observacoes || null,
                status: typeof row.status === 'string' && row.status
                  ? row.status.toLowerCase()
                  : typeof row.Status === 'string' && row.Status
                    ? row.Status.toLowerCase()
                    : 'novo',
                origem: row.origem || row.Origem || null,
                user_id: user.id,
              })).filter(
                (lead) => lead.nome && lead.email
              );

              if (leadsToInsert.length === 0) {
                throw new Error('Nenhum lead válido encontrado no arquivo');
              }

              const { error } = await supabase.from('leads').insert(leadsToInsert);
              if (error) throw error;

              onImport();
              setShowImport(false);
              if (fileInputRef.current) fileInputRef.current.value = '';
            } catch (err: unknown) {
              if (err instanceof Error) {
                setError(err.message || 'Erro ao importar leads');
              } else {
                setError('Erro ao importar leads');
              }
            } finally {
              setImporting(false);
            }
          },
          error: (error) => {
            setError('Erro ao processar arquivo CSV: ' + error.message);
            setImporting(false);
          },
        });
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const leadsToInsert = (jsonData as Record<string, unknown>[]).map((row) => ({
              nome: typeof row.nome === 'string' && row.nome
                ? row.nome
                : typeof row.Nome === 'string' && row.Nome
                  ? row.Nome
                  : '',
              email: typeof row.email === 'string' && row.email
                ? row.email
                : typeof row.Email === 'string' && row.Email
                  ? row.Email
                  : '',
              telefone: typeof row.telefone === 'string' && row.telefone
                ? row.telefone
                : typeof row.Telefone === 'string' && row.Telefone
                  ? row.Telefone
                  : '',
              empresa: typeof row.empresa === 'string' && row.empresa
                ? row.empresa
                : typeof row.Empresa === 'string' && row.Empresa
                ? row.Empresa
                : null,
              observacoes: typeof row.observacoes === 'string' && row.observacoes
                ? row.observacoes
                : typeof row.Observacoes === 'string' && row.Observacoes
                  ? row.Observacoes
                  : null,
              status: typeof row.status === 'string' && row.status
                ? row.status.toLowerCase()
                : typeof row.Status === 'string' && row.Status
                  ? row.Status.toLowerCase()
                  : 'novo',
              origem: typeof row.origem === 'string' && row.origem
                ? row.origem
                : typeof row.Origem === 'string' && row.Origem
                  ? row.Origem
                  : null,
              user_id: user.id,
            })).filter((lead) => lead.nome && lead.email);

            if (leadsToInsert.length === 0) {
              throw new Error('Nenhum lead válido encontrado no arquivo');
            }

            const { error } = await supabase.from('leads').insert(leadsToInsert);
            if (error) throw error;

            onImport();
            setShowImport(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
          } catch (err: unknown) {
            if (err instanceof Error) {
              setError(err.message || 'Erro ao processar arquivo Excel');
            } else {
              setError('Erro ao processar arquivo Excel');
            }
          } finally {
            setImporting(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        throw new Error('Formato de arquivo não suportado. Use CSV ou XLSX.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Erro ao importar arquivo');
      } else {
        setError('Erro ao importar arquivo');
      }
      setImporting(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <button
          onClick={() => setShowImport(!showImport)}
          className="px-4 py-2 bg-[#00b4d8] text-white rounded-lg hover:bg-[#0088a8] transition-colors"
        >
          Importar
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#97d4e5] text-[#222651] rounded-lg hover:bg-[#7fc4d5] transition-colors"
          >
            Exportar CSV
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-[#cc39f3] text-white rounded-lg hover:bg-[#b028d1] transition-colors"
          >
            Exportar Excel
          </button>
        </div>
      </div>

      {showImport && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl p-4 z-10 min-w-[300px]">
          <h3 className="font-semibold text-[#222651] mb-4">Importar Leads</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileImport(file);
            }}
            disabled={importing}
            className="w-full mb-4"
          />

          <p className="text-xs text-gray-600 mb-2">
            Formatos aceitos: CSV, XLSX
          </p>
          <p className="text-xs text-gray-500">
            Colunas esperadas: nome, email, telefone, empresa, status, origem, observacoes
          </p>

          <button
            onClick={() => {
              setShowImport(false);
              setError('');
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="mt-4 w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}

