'use client';

import { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  sortableKeyboardCoordinates, 
} from '@dnd-kit/sortable';
import { taskService } from '@/src/services/taskService';
import { TaskTemplate } from '@/src/types/task';
import { toast } from 'sonner';

// Import local components and types
import { AdventureDay } from '@/src/types/adventure';
import { 
  DraggableTaskCard, 
  AdventureDetails, 
  TaskLibrary, 
  TimelineList 
} from '@/src/components/adventures/builder';

export default function AdventureBuilderPage() {
  // --- State ---
  const [tasks, setTasks] = useState<TaskTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<TaskTemplate | null>(null);
  
  // Adventure Details State
  const [adventureTitleEn, setAdventureTitleEn] = useState('');
  const [adventureTitleAr, setAdventureTitleAr] = useState('');
  const [adventureDescriptionEn, setAdventureDescriptionEn] = useState('');
  const [adventureDescriptionAr, setAdventureDescriptionAr] = useState('');
  const [adventureGoalEn, setAdventureGoalEn] = useState('');
  const [adventureGoalAr, setAdventureGoalAr] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const PAGE_SIZE = 12; // Tasks per type per page
  
  // Timeline State
  const [days, setDays] = useState<AdventureDay[]>(
    Array.from({ length: 7 }, (_, i) => ({
      id: `day-${i + 1}`,
      dayNumber: i + 1,
      task: null
    }))
  );

  // --- DND Sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Fetch Tasks ---
  const fetchTasks = async (pageNumber: number, isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);
      else setIsFetchingMore(true);

      const [text, voice, rewards, evidence] = await Promise.all([
        taskService.getTaskTemplates({ templateType: 'TextQuestion', pageNumber, pageSize: PAGE_SIZE }),
        taskService.getTaskTemplates({ templateType: 'VoiceQuestion', pageNumber, pageSize: PAGE_SIZE }),
        taskService.getTaskTemplates({ templateType: 'InstantReward', pageNumber, pageSize: PAGE_SIZE }),
        taskService.getTaskTemplates({ templateType: 'EvidenceSubmission', pageNumber, pageSize: PAGE_SIZE }),
      ]);
      
      const newTasks = [
        ...text.items,
        ...voice.items,
        ...rewards.items,
        ...evidence.items
      ];

      if (isInitial) {
        setTasks(newTasks);
      } else {
        setTasks(prev => [...prev, ...newTasks]);
      }

      // Check if any category still has more items
      const hasAnyMore = text.hasNextPage || voice.hasNextPage || rewards.hasNextPage || evidence.hasNextPage;
      setHasMore(hasAnyMore);
    } catch (error) {
      toast.error('Failed to load tasks library');
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchTasks(1, true);
  }, []);

  const loadMoreTasks = () => {
    if (!isFetchingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTasks(nextPage);
    }
  };

  // --- Helpers ---
  const filteredTasks = tasks.filter(task => 
    task.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.titleAr.includes(searchQuery)
  );

  const completedCount = days.filter(d => d.task).length;
  const isComplete = completedCount === 7;

  // --- Handlers ---
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id.toString().startsWith('day-')) {
      const dayId = over.id.toString();
      const task = tasks.find(t => t.id === active.id);
      
      if (task) {
        setDays(prev => prev.map(day => {
          if (day.id === dayId) return { ...day, task };
          return day;
        }));
        toast.success(`Task assigned to Day ${dayId.split('-')[1]}`);
      }
    }
    setActiveTask(null);
  };

  const removeTaskFromDay = (dayId: string) => {
    setDays(prev => prev.map(day => 
      day.id === dayId ? { ...day, task: null } : day
    ));
  };

  const resetAdventure = () => {
    toast('Reset Adventure?', {
      description: 'All assigned tasks will be cleared.',
      action: {
        label: 'Reset',
        onClick: () => {
          setDays(prev => prev.map(day => ({ ...day, task: null })));
          toast.success('Adventure reset successfully');
        }
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-gray-50/50">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col flex-1 p-4 sm:p-6 gap-6 max-w-full mx-auto w-full">
          
          {/* Top Section - Adventure Details */}
          <AdventureDetails 
            titleEn={adventureTitleEn} setTitleEn={setAdventureTitleEn}
            titleAr={adventureTitleAr} setTitleAr={setAdventureTitleAr}
            descriptionEn={adventureDescriptionEn} setDescriptionEn={setAdventureDescriptionEn}
            descriptionAr={adventureDescriptionAr} setDescriptionAr={setAdventureDescriptionAr}
            goalEn={adventureGoalEn} setGoalEn={setAdventureGoalEn}
            goalAr={adventureGoalAr} setGoalAr={setAdventureGoalAr}
            completedCount={completedCount}
            isComplete={isComplete}
            onReset={resetAdventure}
          />

          <div className="flex flex-col xl:flex-row gap-6 flex-1">
            {/* Left Column - Task Library */}
            <TaskLibrary 
              tasks={tasks}
              filteredTasks={filteredTasks}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isLoading={isLoading}
              isFetchingMore={isFetchingMore}
              onLoadMore={loadMoreTasks}
              hasMore={hasMore}
            />

            {/* Right Column - Adventure Timeline */}
            <TimelineList 
              days={days}
              onRemoveTask={removeTaskFromDay}
            />
          </div>
        </div>

        {/* Drag Overlay Wrapper */}
        <DragOverlay adjustScale={true} dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.5' } },
          }),
        }}>
          {activeTask ? (
            <div className="w-[340px]">
              <DraggableTaskCard task={activeTask} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
