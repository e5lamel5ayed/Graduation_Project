'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Trash2, LayoutGrid, CheckCircle2, Star } from 'lucide-react';
import Image from 'next/image';
import { AdventureDay } from '@/src/types/adventure';

interface DaySlotProps {
  day: AdventureDay;
  onRemove: (dayId: string) => void;
}

export const DaySlot = ({ day, onRemove }: DaySlotProps) => {
  const {
    setNodeRef,
    isOver,
  } = useSortable({
    id: day.id,
    data: {
      type: 'Day',
      day
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative flex flex-col gap-1.5 p-2 rounded-lg border-2 transition-all duration-300
        ${day.task 
          ? 'bg-white border-purple-100 shadow-sm' 
          : isOver 
            ? 'bg-purple-50 border-purple-400 border-dashed scale-[1.01]' 
            : 'bg-gray-50/50 border-gray-200 border-dashed'
        }
      `}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`
            flex items-center justify-center w-5 h-5 rounded-lg text-sm font-bold
            ${day.task ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}
          `}>
            {day.dayNumber}
          </div>
          <span className={`font-bold ${day.task ? 'text-gray-900' : 'text-gray-400'}`}>
            Day {day.dayNumber}
          </span>
        </div>
        {day.task && (
          <button 
            onClick={() => onRemove(day.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {day.task ? (
        <div className="flex items-center gap-3 p-2 bg-purple-50/50 rounded-lg border border-purple-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="relative h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden border border-purple-200">
            {day.task.iconUrl ? (
              <Image src={day.task.iconUrl} alt="" fill className="object-cover" unoptimized />
            ) : (
              <LayoutGrid className="h-4 w-4 text-purple-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
             <h4 className="text-[11px] font-bold text-gray-900 truncate">{day.task.titleEn}</h4>
             <div className="flex items-center gap-2">
                <span className="text-[9px] text-purple-600 font-bold bg-white px-1.5 py-0.5 rounded border border-purple-100">
                  {day.task.templateType.replace('Question', '')}
                </span>
                <span className="text-[9px] text-gray-500 flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                  {day.task.basePoints}
                </span>
             </div>
          </div>
          <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
        </div>
      ) : (
        <div className={`
          flex items-center justify-center py-2 px-4 text-center border border-dashed rounded-lg
          ${isOver ? 'text-purple-500 border-purple-200 bg-purple-50/30' : 'text-gray-300 border-gray-100'}
        `}>
          <p className="text-[9px] font-bold uppercase tracking-tighter">
            {isOver ? 'Drop here' : 'Drop task'}
          </p>
        </div>
      )}
    </div>
  );
};
