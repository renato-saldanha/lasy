'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Lead } from '@/types';
import KanbanColumn from './KanbanColumn';
import { supabase } from '@/lib/supabase';

const statuses: Lead['status'][] = ['novo', 'contato', 'qualificado', 'proposta', 'fechado', 'perdido'];
const statusLabels: Record<Lead['status'], string> = {
  novo: 'Novo',
  contato: 'Em Contato',
  qualificado: 'Qualificado',
  proposta: 'Proposta',
  fechado: 'Fechado',
  perdido: 'Perdido',
};

interface KanbanBoardProps {
  leads: Lead[];
  onUpdate: () => void;
}

export default function KanbanBoard({ leads, onUpdate }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const leadId = active.id as string;
    const newStatus = over.id as Lead['status'];

    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const activeLead = leads.find((lead) => lead.id === activeId);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => {
          const statusLeads = leads.filter((lead) => lead.status === status);
          return (
            <KanbanColumn
              key={status}
              id={status}
              title={statusLabels[status]}
              leads={statusLeads}
              onUpdate={onUpdate}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-[#0078b7]">
            <h3 className="font-semibold text-[#222651]">{activeLead.nome}</h3>
            <p className="text-sm text-gray-600">{activeLead.email}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

