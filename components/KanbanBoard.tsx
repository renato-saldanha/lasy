'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Lead } from '@/types';
import KanbanColumn from './KanbanColumn';
import { supabase } from '@/lib/supabase';
import { getErrorMessage } from '@/lib/errors';

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
  onUpdate: () => void | Promise<void>;
}

export default function KanbanBoard({ leads, onUpdate }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, Lead['status']>>({});
  const [error, setError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const displayLeads = leads.map((lead) =>
    pending[lead.id] ? { ...lead, status: pending[lead.id] } : lead
  );

  const handleDragStart = (event: DragStartEvent) => {
    setError('');
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as Lead['status'];
    const current = displayLeads.find((lead) => lead.id === leadId);

    if (!current || !statuses.includes(newStatus) || current.status === newStatus) return;

    // Move o card na hora; a gravacao acontece em segundo plano
    setPending((prev) => ({ ...prev, [leadId]: newStatus }));

    try {
      const { error: updateError } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (updateError) throw updateError;
      await onUpdate();
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao mover o lead'));
    } finally {
      setPending((prev) => {
        const next = { ...prev };
        delete next[leadId];
        return next;
      });
    }
  };

  const activeLead = displayLeads.find((lead) => lead.id === activeId);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActiveId(null)}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Não foi possível mover o lead: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            id={status}
            title={statusLabels[status]}
            leads={displayLeads.filter((lead) => lead.status === status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="bg-white rounded-lg shadow-xl p-4 border-2 border-[#0078b7] rotate-2 cursor-grabbing">
            <h3 className="font-semibold text-[#222651]">{activeLead.nome}</h3>
            <p className="text-sm text-gray-600">{activeLead.email}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
