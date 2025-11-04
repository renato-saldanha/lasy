'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '@/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface LeadCardProps {
  lead: Lead;
  onUpdate?: () => void;
}

export default function LeadCard({ lead }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-md p-4 mb-2 cursor-move hover:shadow-lg transition-shadow"
    >
      <Link href={`/dashboard/leads/${lead.id}`}>
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

