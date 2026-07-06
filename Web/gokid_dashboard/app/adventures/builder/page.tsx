/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { adventureService } from '@/src/services/adventureService';
import { Difficulty, TaskTemplate, TemplateType } from '@/src/types/task';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const adventureId = searchParams.get('id');
  const isEditMode = Boolean(adventureId);

  // --- State ---
  const [tasks, setTasks] = useState<TaskTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAdventure, setIsLoadingAdventure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskTemplate | null>(null);

  // Adventure Details State
  const [adventureTitleEn, setAdventureTitleEn] = useState('');
  const [adventureTitleAr, setAdventureTitleAr] = useState('');
  const [adventureDescriptionEn, setAdventureDescriptionEn] = useState('');
  const [adventureDescriptionAr, setAdventureDescriptionAr] = useState('');
  const [adventureGoalEn, setAdventureGoalEn] = useState('');
  const [adventureGoalAr, setAdventureGoalAr] = useState('');
  const [weekDuration, setWeekDuration] = useState(7);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [descriptionVoiceFile, setDescriptionVoiceFile] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

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

  const normalizeTemplateType = (value?: string): TemplateType => {
    if (value === 'TextQuestion' || value === 'VoiceQuestion' || value === 'InstantReward' || value === 'EvidenceSubmission') {
      return value;
    }
    return 'TextQuestion';
  };

  const createEmptyDays = (length: number): AdventureDay[] =>
    Array.from({ length }, (_, i) => ({
      id: `day-${i + 1}`,
      dayNumber: i + 1,
      task: null,
    }));

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

      const textItems = text?.items ?? text?.data ?? [];
      const voiceItems = voice?.items ?? voice?.data ?? [];
      const rewardItems = rewards?.items ?? rewards?.data ?? [];
      const evidenceItems = evidence?.items ?? evidence?.data ?? [];

      const newTasks = [
        ...textItems,
        ...voiceItems,
        ...rewardItems,
        ...evidenceItems,
      ];

      if (isInitial) {
        setTasks(newTasks);
      } else {
        setTasks((prev) => [...prev, ...newTasks]);
      }

      // Determine if any of the paginated responses indicates more pages
      const checkHasMore = (resp: { pageNumber?: number; totalPages?: number; pageSize?: number; totalCount?: number } | undefined) => {
        if (!resp) return false;
        const pageNum = resp.pageNumber ?? 1;
        const totalPages = resp.totalPages ?? 1;
        if (pageNum < totalPages) return true;
        const pageSize = resp.pageSize ?? PAGE_SIZE;
        const totalCount = resp.totalCount ?? 0;
        return pageNum * pageSize < totalCount;
      };

      const hasAnyMore = checkHasMore(text) || checkHasMore(voice) || checkHasMore(rewards) || checkHasMore(evidence);
      setHasMore(hasAnyMore);
    } catch {
      toast.error('Failed to load tasks library');
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchTasks(1, true);
  }, []);

  useEffect(() => {
    if (!adventureId) return;

    const fetchAdventureDetails = async () => {
      try {
        setIsLoadingAdventure(true);
        const adventure = await adventureService.getById(adventureId);

        setAdventureTitleEn(adventure.title);
        setAdventureTitleAr(adventure.titleAr);
        setAdventureDescriptionEn(adventure.description);
        setAdventureDescriptionAr(adventure.descriptionAr);
        setAdventureGoalEn(adventure.goalEn);
        setAdventureGoalAr(adventure.goalAr);
        setWeekDuration(Math.max(1, adventure.weekDuration));
        setBonusPoints(adventure.bonusPoints);

        setDays(
          Array.from({ length: Math.max(1, adventure.weekDuration) }, (_, i) => {
            const dayNumber = i + 1;
            const assignedTask = adventure.tasks.find((task) => task.dayNumber === dayNumber);

            const fallbackTask = adventure.rawTasks.find((task) => {
              const taskTemplateId =
                task.taskTemplateId ||
                task.taskTemplateID ||
                task.templateId ||
                task.taskId ||
                task.id;
              return taskTemplateId === assignedTask?.taskTemplateId;
            });

            const mappedFallbackTask = assignedTask && fallbackTask
              ? {
                id: assignedTask.taskTemplateId,
                titleEn: fallbackTask.titleEn || fallbackTask.title || 'Assigned Task',
                titleAr: fallbackTask.titleAr || '',
                descriptionEn: fallbackTask.descriptionEn || '',
                descriptionAr: fallbackTask.descriptionAr || '',
                iconUrl: fallbackTask.iconUrl || '',
                subCategoryId: '',
                subCategoryNameEn: '',
                difficulty: 'Easy' as Difficulty,
                basePoints: fallbackTask.basePoints ?? 0,
                templateType: normalizeTemplateType(fallbackTask.templateType),
                createdAt: '',
                pageNumber: 0,
                totalCount: 0,
                totalPages: 0,
              }
              : null;

            return {
              id: `day-${dayNumber}`,
              dayNumber,
              task: mappedFallbackTask,
            };
          })
        );
      } catch {
        toast.error('Failed to load adventure details');
      } finally {
        setIsLoadingAdventure(false);
      }
    };

    fetchAdventureDetails();
  }, [adventureId]);

  useEffect(() => {
    const normalizedDuration = Math.max(1, weekDuration);
    setDays((prev) => {
      const previousByDay = new Map(prev.map((day) => [day.dayNumber, day.task]));
      return Array.from({ length: normalizedDuration }, (_, i) => {
        const dayNumber = i + 1;
        return {
          id: `day-${dayNumber}`,
          dayNumber,
          task: previousByDay.get(dayNumber) ?? null,
        };
      });
    });
  }, [weekDuration]);

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
  const isComplete = completedCount === days.length;

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

  const submitAdventure = async (mode: 'publish') => {
    const title = (adventureTitleEn || adventureTitleAr).trim();
    const titleEn = adventureTitleEn.trim();
    const titleAr = adventureTitleAr.trim();
    const description = (adventureDescriptionEn || adventureDescriptionAr).trim();
    const descriptionEn = adventureDescriptionEn.trim();
    const descriptionAr = adventureDescriptionAr.trim();
    const goalEn = adventureGoalEn.trim();
    const goalAr = adventureGoalAr.trim();
    const selectedTasks = days
      .filter((day) => day.task)
      .map((day) => ({
        dayNumber: day.dayNumber,
        taskTemplateId: day.task!.id,
      }));

    if (!title) {
      toast.error('Adventure title is required');
      return;
    }

    if (!description) {
      toast.error('Adventure description is required');
      return;
    }

    if (!goalEn && !goalAr) {
      toast.error('Adventure goal is required');
      return;
    }

    if (selectedTasks.length === 0) {
      toast.error('Please assign at least one task before submitting');
      return;
    }

    const calculatedBonusPoints = selectedTasks.reduce((sum, task) => {
      const matchedDay = days.find((day) => day.dayNumber === task.dayNumber);
      return sum + (matchedDay?.task?.basePoints ?? 0);
    }, 0);

    try {
      setIsSubmitting(true);
      const payload = {
        title,
        titleEn,
        titleAr,
        description,
        descriptionEn,
        descriptionAr,
        goalEn,
        goalAr,
        bannerImage,
        weekDuration,
        bonusPoints: bonusPoints > 0 ? bonusPoints : calculatedBonusPoints,
        descriptionVoiceFile,
        tasks: selectedTasks,
      };

      let createdAdventureId: string | undefined;

      if (isEditMode && adventureId) {
        await adventureService.update(adventureId, payload);
      } else {
        const createdAdventure = await adventureService.create(payload);
        console.log('Created adventure object:', createdAdventure);
        console.log('Adventure keys:', Object.keys(createdAdventure || {}));
        console.log('Adventure entire response:', JSON.stringify(createdAdventure));

        // Try multiple ways to get the ID
        createdAdventureId = createdAdventure?.id ||
          (createdAdventure as any)?.ID ||
          (createdAdventure as any)?.adventureId ||
          (createdAdventure as any)?.AdventureId;

        console.log('Extracted adventure ID:', createdAdventureId);

        if (createdAdventureId) {
          // Call generate-story endpoint immediately after successful creation
          try {
            console.log('Calling generateStory with ID:', createdAdventureId);
            await adventureService.generateStory(createdAdventureId);
            toast.success('Story generated successfully');
          } catch (storyError) {
            console.error('Failed to generate story:', storyError);
            // Don't throw - the adventure was created successfully, story generation failed
          }
        } else {
          console.warn('Warning: Created adventure has no ID, skipping story generation');
          console.warn('Full response:', createdAdventure);
        }
      }

      if (isEditMode) {
        toast.success('Adventure updated successfully');
      } else {
        toast.success(mode === 'publish' ? 'Adventure published successfully' : 'Adventure saved successfully');
      }
      router.push('/adventures');
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to submit adventure';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAdventure = () => {
    toast('Reset Adventure?', {
      description: 'All adventure data will be cleared.',
      action: {
        label: 'Reset',
        onClick: () => {
          setAdventureTitleEn('');
          setAdventureTitleAr('');
          setAdventureDescriptionEn('');
          setAdventureDescriptionAr('');
          setAdventureGoalEn('');
          setAdventureGoalAr('');
          setSearchQuery('');
          setBonusPoints(0);
          setDescriptionVoiceFile(null);
          setBannerImage(null);
          setWeekDuration(7);
          setDays(createEmptyDays(7));
          toast.success('Adventure reset successfully');
        }
      },
      cancel: {
        label: 'Cancel',
        onClick: () => { },
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
            isEditMode={isEditMode}
            titleEn={adventureTitleEn} setTitleEn={setAdventureTitleEn}
            titleAr={adventureTitleAr} setTitleAr={setAdventureTitleAr}
            descriptionEn={adventureDescriptionEn} setDescriptionEn={setAdventureDescriptionEn}
            descriptionAr={adventureDescriptionAr} setDescriptionAr={setAdventureDescriptionAr}
            goalEn={adventureGoalEn} setGoalEn={setAdventureGoalEn}
            goalAr={adventureGoalAr} setGoalAr={setAdventureGoalAr}
            weekDuration={weekDuration} setWeekDuration={setWeekDuration}
            bonusPoints={bonusPoints} setBonusPoints={setBonusPoints}
            descriptionVoiceFile={descriptionVoiceFile} setDescriptionVoiceFile={setDescriptionVoiceFile}
            bannerImage={bannerImage} setBannerImage={setBannerImage}
            completedCount={completedCount}
            totalDays={days.length}
            isComplete={isComplete}
            onReset={resetAdventure}
            onPublish={() => submitAdventure('publish')}
            isSubmitting={isSubmitting || isLoadingAdventure}
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
