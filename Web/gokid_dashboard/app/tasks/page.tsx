/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Calendar, User, Tag, Mic, Gift, FileCheck, LayoutGrid, Award, Star } from 'lucide-react';
import { Tabs } from './taps';
import { Button } from '@/src/components/ui';
import { HeadlessDialog } from '@/src/components/ui/HeadlessDialog';
import { VoiceTaskForm, InstantRewardForm, EvidenceSubmissionForm } from './forms';
import { taskService } from '@/src/services/taskService';
import { TaskTemplate, TemplateType, Difficulty } from '@/src/types/task';
import Image from 'next/image';
import { toast } from 'sonner';

// Mapping between tab IDs and API TemplateType
const tabToTemplateTypeMap: Record<string, TemplateType | 'all'> = {
  all: 'all',
  voice: 'VoiceQuestion',
  instantReward: 'InstantReward',
  evidenceSubmission: 'EvidenceSubmission',
};

// تكوين العناوين والأوصاف الديناميكية لكل تاب
const tabConfig = {
  all: {
    title: 'All Tasks',
    description: 'View and manage all task types',
    icon: LayoutGrid,
    gradient: 'from-blue-600 to-indigo-600',
    dialogTitle: 'New Task',
  },
  general: {
    title: 'General Tasks',
    description: 'Manage all general tasks and assignments',
    icon: LayoutGrid,
    gradient: 'from-purple-600 to-pink-600',
    dialogTitle: 'New General Task',
  },
  voice: {
    title: 'Voice Tasks',
    description: 'Voice recording and pronunciation practice tasks',
    icon: Mic,
    gradient: 'from-purple-600 to-pink-600',
    dialogTitle: 'New Voice Task',
  },
  instantReward: {
    title: 'Instant Reward Tasks',
    description: 'Quick tasks with instant rewards upon completion',
    icon: Gift,
    gradient: 'from-purple-600 to-pink-600',
    dialogTitle: 'New Instant Reward Task',
  },
  evidenceSubmission: {
    title: 'Evidence Submission Tasks',
    description: 'Tasks requiring evidence and documentation',
    icon: FileCheck,
    gradient: 'from-purple-600 to-pink-600',
    dialogTitle: 'New Evidence Submission Task',
  },
};

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tasks, setTasks] = useState<TaskTemplate[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [taskCounts, setTaskCounts] = useState({
    all: 0,
    voice: 0,
    instantReward: 0,
    evidenceSubmission: 0,
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const templateType = tabToTemplateTypeMap[activeTab];

      if (templateType === 'all') {
        // Fetch all task types
        const [textQuestions, voiceQuestions, instantRewards, evidenceSubmissions] = await Promise.all([
          taskService.getTaskTemplates({ templateType: 'TextQuestion', pageNumber: 1, pageSize: 50 }),
          taskService.getTaskTemplates({ templateType: 'VoiceQuestion', pageNumber: 1, pageSize: 50 }),
          taskService.getTaskTemplates({ templateType: 'InstantReward', pageNumber: 1, pageSize: 50 }),
          taskService.getTaskTemplates({ templateType: 'EvidenceSubmission', pageNumber: 1, pageSize: 50 }),
        ]);

        const allTasks = [
          ...textQuestions.items,
          ...voiceQuestions.items,
          ...instantRewards.items,
          ...evidenceSubmissions.items,
        ];

        setTasks(allTasks);
        setTaskCounts({
          all: allTasks.length,
          voice: voiceQuestions.totalCount,
          instantReward: instantRewards.totalCount,
          evidenceSubmission: evidenceSubmissions.totalCount,
        });
      } else {
        const response = await taskService.getTaskTemplates({
          templateType: templateType as TemplateType,
          pageNumber: 1,
          pageSize: 50,
        });
        setTasks(response.items);

        setTaskCounts(prev => ({
          ...prev,
          [activeTab]: response.totalCount,
        }));
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tasks when active tab changes
  useEffect(() => {
    fetchTasks();
  }, [activeTab]);

  const getTypeColor = (type: TemplateType) => {
    switch (type) {
      case 'TextQuestion':
        return 'bg-blue-100 text-blue-800';
      case 'VoiceQuestion':
        return 'bg-purple-100 text-purple-800';
      case 'InstantReward':
        return 'bg-green-100 text-green-800';
      case 'EvidenceSubmission':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: TemplateType) => {
    switch (type) {
      case 'TextQuestion':
        return <LayoutGrid className="h-3.5 w-3.5" />;
      case 'VoiceQuestion':
        return <Mic className="h-3.5 w-3.5" />;
      case 'InstantReward':
        return <Gift className="h-3.5 w-3.5" />;
      case 'EvidenceSubmission':
        return <FileCheck className="h-3.5 w-3.5" />;
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-100 text-emerald-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800';
      case 'Hard':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddNew = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    if (!isLoading) {
      setIsFormOpen(false);
    }
  };

  const handleImageError = (taskId: string) => {
    setImageErrors(prev => ({ ...prev, [taskId]: true }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);

      // Additional validation beyond HTML required attributes
      if (!formData.subCategoryId) {
        toast.error('Please select a sub category');
        return;
      }

      if (!formData.taskImageFile && !formData.iconFile) {
        toast.error('Please upload either a task image or an icon');
        return;
      }

      if (activeTab === 'instantReward') {
        await taskService.createInstantReward({
          titleAr: formData.titleAr,
          titleEn: formData.titleEn,
          descriptionAr: formData.descriptionAr,
          descriptionEn: formData.descriptionEn,
          taskImageFile: formData.taskImageFile,
          iconFile: formData.iconFile,
          subCategoryId: formData.subCategoryId,
          difficulty: formData.difficulty,
          basePoints: formData.basePoints,
        });

        toast.success('Instant Reward task created successfully!');
        setIsFormOpen(false);
        fetchTasks();
      } else if (activeTab === 'evidenceSubmission') {
        await taskService.createEvidenceSubmission({
          titleAr: formData.titleAr,
          titleEn: formData.titleEn,
          descriptionAr: formData.descriptionAr,
          descriptionEn: formData.descriptionEn,
          taskImageFile: formData.taskImageFile,
          iconFile: formData.iconFile,
          subCategoryId: formData.subCategoryId,
          difficulty: formData.difficulty,
          basePoints: formData.basePoints,
          instructionsText: formData.instructionsText,
          evidenceType: formData.evidenceType,
          reviewBy: formData.reviewBy,
        });

        toast.success('Evidence Submission task created successfully!');
        setIsFormOpen(false);
        fetchTasks();
      } else if (activeTab === 'voice') {
        await taskService.createVoiceQuestion({
          titleAr: formData.titleAr,
          titleEn: formData.titleEn,
          descriptionAr: formData.descriptionAr,
          descriptionEn: formData.descriptionEn,
          questionText: formData.questionText,
          expectedCorrectAnswer: formData.expectedCorrectAnswer,
          voicePrompt: formData.voicePrompt,
          maxVoiceAttempts: formData.maxVoiceAttempts,
          maxVoiceDurationSeconds: formData.maxVoiceDurationSeconds,
          subCategoryId: formData.subCategoryId,
          difficulty: formData.difficulty,
          basePoints: formData.basePoints,
          taskImageFile: formData.taskImageFile,
          iconFile: formData.iconFile,
        });
        toast.success('Voice Question task created successfully!');
        setIsFormOpen(false);
        fetchTasks();
      } else {
        toast.error('Invalid task type selected');
      }
    } catch (error: any) {
      console.error('Error creating task:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to create task';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTabConfig = tabConfig[activeTab as keyof typeof tabConfig];
  const CurrentIcon = currentTabConfig.icon;

  const renderForm = () => {
    if (activeTab === 'all') return null;

    switch (activeTab) {
      case 'voice':
        return <VoiceTaskForm onSubmit={handleSubmit} isLoading={isSubmitting} />;
      case 'instantReward':
        return <InstantRewardForm onSubmit={handleSubmit} isLoading={isSubmitting} />;
      case 'evidenceSubmission':
        return <EvidenceSubmissionForm onSubmit={handleSubmit} isLoading={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} counts={taskCounts} />

      {/* Dynamic Title Section */}
      <div className="flex justify-between items-center mb-6 mt-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${currentTabConfig.gradient} shadow-lg`}>
            <CurrentIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentTabConfig.title}</h1>
            <p className="text-gray-500 mt-1">{currentTabConfig.description}</p>
          </div>
        </div>
        {activeTab !== 'all' && (
          <Button onClick={handleAddNew} className={`bg-gradient-to-r ${currentTabConfig.gradient} hover:shadow-lg transition-all`}>
            <Plus className="h-4 w-4 mr-2" />
            New {currentTabConfig.title.replace(' Tasks', '')} Task
          </Button>
        )}
      </div>

      {/* Dialog for Forms */}
      <HeadlessDialog
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={currentTabConfig.dialogTitle}
        maxWidth="4xl"
      >
        {renderForm()}
      </HeadlessDialog>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-500">Loading tasks...</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-indigo-200">
              {/* Header with Icon and Type Badge */}
              <div className="flex items-start gap-3 mb-3">
                {/* Task Icon */}
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200">
                  {task.iconUrl && !imageErrors[task.id] ? (
                    <Image
                      src={task.iconUrl}
                      alt={task.titleEn}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(task.id)}
                      unoptimized
                    />
                  ) : (
                    <CheckSquare className="h-7 w-7 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-gray-900 text-base line-clamp-1">{task.titleEn}</h3>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex-shrink-0 ${getTypeColor(task.templateType)}`}>
                      {getTypeIcon(task.templateType)}
                      <span className="hidden sm:inline">{task.templateType}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-1 mb-2">{task.descriptionEn}</p>
                </div>
              </div>

              {/* Task Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3 p-2.5 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-xs font-medium text-gray-900 truncate">{task.subCategoryNameEn || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${getDifficultyColor(task.difficulty).replace('text-', 'bg-').replace('-800', '-100')}`}>
                    <Award className={`h-3.5 w-3.5 ${getDifficultyColor(task.difficulty).split(' ')[1].replace('text-', 'text-').replace('-800', '-600')}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Difficulty</p>
                    <p className={`text-xs font-bold truncate ${getDifficultyColor(task.difficulty).split(' ')[1]}`}>
                      {task.difficulty}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Star className="h-3.5 w-3.5 text-amber-600 fill-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Points</p>
                    <p className="text-xs font-bold text-amber-700 truncate">{task.basePoints} pts</p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getDifficultyColor(task.difficulty)}`}>
                    <Tag className="h-3 w-3 inline mr-1" />
                    {task.difficulty}
                  </span>
                </div>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:underline">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckSquare className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            No tasks available in this category yet.
          </p>
          <button
            onClick={() => setActiveTab('all')}
            className="mt-6 text-indigo-600 font-medium hover:text-indigo-700 underline underline-offset-4"
          >
            View All Tasks
          </button>
        </div>
      )}
    </div>
  );
}
