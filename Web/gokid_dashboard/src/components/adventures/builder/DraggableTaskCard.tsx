'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, LayoutGrid, Mic, Gift, FileCheck, Cake } from 'lucide-react';
import { TaskTemplate, TemplateType } from '@/src/types/task';

interface DraggableTaskCardProps {
  task: TaskTemplate;
  isOverlay?: boolean;
}

export const DraggableTaskCard = ({ task, isOverlay = false }: DraggableTaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const getTypeIcon = (type: TemplateType) => {
    switch (type) {
      case 'TextQuestion': return <LayoutGrid className="h-3.5 w-3.5" />;
      case 'VoiceQuestion': return <Mic className="h-3.5 w-3.5" />;
      case 'InstantReward': return <Gift className="h-3.5 w-3.5" />;
      case 'EvidenceSubmission': return <FileCheck className="h-3.5 w-3.5" />;
      default: return null;
    }
  };

  const getTypeColor = (type: TemplateType) => {
    switch (type) {
      case 'TextQuestion': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'VoiceQuestion': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'InstantReward': return 'bg-green-50 text-green-600 border-green-100';
      case 'EvidenceSubmission': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group flex items-center gap-2 p-2 mb-1.5 bg-white border border-gray-200 rounded-lg 
        hover:border-purple-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing
        ${isOverlay ? 'shadow-2xl border-purple-400 rotate-2' : ''}
      `}
    >
      <div className="flex-shrink-0 text-gray-400 group-hover:text-purple-500 transition-colors">
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center group-hover:border-purple-200 transition-colors relative">
        {task.iconUrl ? (
          <img 
            src={task.iconUrl} 
            alt={task.titleEn} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + task.titleEn + '&background=f3f4f6&color=a855f7';
            }}
          />
        ) : (
          <div className="text-gray-400 group-hover:text-purple-500">
            {getTypeIcon(task.templateType)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1.5">
          <h4 className="text-[13px] font-bold text-gray-900 truncate leading-tight transition-colors group-hover:text-purple-700">{task.titleEn}</h4>
          <span className="flex-shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-sm">
            {task.recommendedAgeFrom}-{task.recommendedAgeTo} years
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase border transition-colors ${getTypeColor(task.templateType)}`}>
            {task.templateType.replace('Question', '')}
          </span>
          <span className="text-[9px] text-gray-500 font-bold">
            {task.basePoints} PTS
          </span>
        </div>
      </div>
    </div>
  );
};
