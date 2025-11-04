'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lead } from '@/types';
import LeadCard from './LeadCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  leads: Lead[];
  onUpdate?: () => void;
}

export default function KanbanColumn({ id, title, leads }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  const statusColors: Record<string, string> = {
    novo: 'bg-[#97d4e5]',
    contato: 'bg-[#00b4d8]',
    qualificado: 'bg-[#0078b7]',
    proposta: 'bg-[#cc39f3]',
    fechado: 'bg-green-500',
    perdido: 'bg-red-500',
  };

  return (
    <div className="flex flex-col min-w-[250px]">
      <div
        ref={setNodeRef}
        className={`${statusColors[id] || 'bg-gray-200'} text-white px-4 py-2 rounded-t-lg font-semibold`}
      >
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <span className="bg-white/20 px-2 py-1 rounded text-xs">{leads.length}</span>
        </div>
      </div>
      <div className="bg-gray-100 rounded-b-lg p-2 min-h-[400px] max-h-[600px] overflow-y-auto">
        <SortableContext items={leads.map((lead) => lead.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

