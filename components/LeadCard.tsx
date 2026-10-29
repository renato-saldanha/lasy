'use client';

import { useDraggable } from '@dnd-kit/core';
import { Lead } from '@/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface LeadCardProps {
  lead: Lead;
}

export default function LeadCard({ lead }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow-md p-4 mb-2 cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow ${isDragging ? 'opacity-30' : ''}`}
    >
      <Link href={`/dashboard/leads/${lead.id}`} draggable={false}>
        <h3 className="font-semibold text-[#222651] mb-1">{lead.nome}</h3>
        <p className="text-sm text-gray-600 mb-1">{lead.email}</p>
        {lead.empresa && (
          <p className="text-xs text-gray-500 mb-2">{lead.empresa}</p>
        )}
        <p className="text-xs text-gray-400">
          {format(new Date(lead.created_at), "dd/MM/yyyy", { locale: ptBR })}
        </p>
      </Link>
    </div>
  );
}
