'use client';

import { useDroppable } from '@dnd-kit/core';
import { Lead } from '@/types';
import LeadCard from './LeadCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  leads: Lead[];
}

export default function KanbanColumn({ id, title, leads }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const statusColors: Record<string, string> = {
    novo: 'bg-[#97d4e5]',
    contato: 'bg-[#00b4d8]',
    qualificado: 'bg-[#0078b7]',
    proposta: 'bg-[#cc39f3]',
    fechado: 'bg-green-500',
    perdido: 'bg-red-500',
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[250px] rounded-lg transition-shadow ${isOver ? 'ring-2 ring-[#0078b7] shadow-lg' : ''}`}
    >
      <div className={`${statusColors[id] || 'bg-gray-200'} text-white px-4 py-2 rounded-t-lg font-semibold`}>
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <span className="bg-white/20 px-2 py-1 rounded text-xs">{leads.length}</span>
        </div>
      </div>
      <div className={`${isOver ? 'bg-blue-50' : 'bg-gray-100'} rounded-b-lg p-2 min-h-[400px] max-h-[600px] overflow-y-auto transition-colors flex-1`}>
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
