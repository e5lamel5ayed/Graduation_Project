'use client';

import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AdventureDay } from '@/src/types/adventure';
import { DaySlot } from './DaySlot';

interface TimelineListProps {
  days: AdventureDay[];
  onRemoveTask: (dayId: string) => void;
}

export const TimelineList = ({
  days,
  onRemoveTask
}: TimelineListProps) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="w-full flex flex-col">
        <div className="pr-2">
          <div className="flex flex-col gap-3">
            <SortableContext 
              items={days.map(d => d.id)}
              strategy={verticalListSortingStrategy}
            >
              {days.map((day) => (
                <div key={day.id}>
                  <DaySlot 
                    day={day} 
                    onRemove={onRemoveTask}
                  />
                </div>
              ))}
            </SortableContext>
          </div>
        </div>
      </div>
    </div>
  );
};
