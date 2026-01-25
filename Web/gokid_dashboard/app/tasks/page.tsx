/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { CheckSquare, Plus, Calendar, User, Tag, Mic, Gift, FileCheck, LayoutGrid } from 'lucide-react';
import { Tabs } from './taps';
import { Button } from '@/src/components/ui';
import { HeadlessDialog } from '@/src/components/ui/HeadlessDialog';
import { GeneralTaskForm, VoiceTaskForm, InstantRewardForm, EvidenceSubmissionForm } from './forms';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'general' | 'voice' | 'instantReward' | 'evidenceSubmission';
  assignee: string;
  dueDate: string;
  tags: string[];
}

// تكوين العناوين والأوصاف الديناميكية لكل تاب
const tabConfig = {
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
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks] = useState<Task[]>([
    {
      id: '0',
      title: 'Complete Project Setup',
      description: 'Set up the initial project configuration',
      type: 'general',
      assignee: 'Admin User',
      dueDate: '2024-01-22',
      tags: ['setup', 'general']
    },
    {
      id: '1',
      title: 'Voice Recording Practice',
      description: 'Practice pronunciation and speaking skills',
      type: 'voice',
      assignee: 'Ahmed Ali',
      dueDate: '2024-01-20',
      tags: ['voice', 'pronunciation']
    },
    {
      id: '2',
      title: 'Instant Reward Quiz',
      description: 'Complete quick quiz for instant rewards',
      type: 'instantReward',
      assignee: 'Sara Khalid',
      dueDate: '2024-01-25',
      tags: ['quiz', 'reward']
    },
    {
      id: '3',
      title: 'Evidence Submission',
      description: 'Submit completed work evidence',
      type: 'evidenceSubmission',
      assignee: 'Omar Hassan',
      dueDate: '2024-01-15',
      tags: ['evidence', 'submission']
    },
    {
      id: '4',
      title: 'Voice Assessment',
      description: 'Record and submit voice assessment',
      type: 'voice',
      assignee: 'Fatima Ahmed',
      dueDate: '2024-01-18',
      tags: ['voice', 'assessment']
    }
  ]);

  const getTypeColor = (type: Task['type']) => {
    return 'bg-purple-100 text-purple-800';
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'general':
        return <LayoutGrid className="h-3.5 w-3.5" />;
      case 'voice':
        return <Mic className="h-3.5 w-3.5" />;
      case 'instantReward':
        return <Gift className="h-3.5 w-3.5" />;
      case 'evidenceSubmission':
        return <FileCheck className="h-3.5 w-3.5" />;
    }
  };

  const filteredTasks = tasks.filter(task => task.type === activeTab);

  const taskCounts = {
    general: tasks.filter(task => task.type === 'general').length,
    voice: tasks.filter(task => task.type === 'voice').length,
    instantReward: tasks.filter(task => task.type === 'instantReward').length,
    evidenceSubmission: tasks.filter(task => task.type === 'evidenceSubmission').length,
  };

  const handleAddNew = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    if (!isLoading) {
      setIsFormOpen(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      // TODO: Implement API call to create task
      console.log('Creating task:', { ...formData, type: activeTab });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentTabConfig = tabConfig[activeTab as keyof typeof tabConfig];
  const CurrentIcon = currentTabConfig.icon;

  // رندر الفورم المناسب بناءً على التاب النشط
  const renderForm = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTaskForm onSubmit={handleSubmit} isLoading={isLoading} />;
      case 'voice':
        return <VoiceTaskForm onSubmit={handleSubmit} isLoading={isLoading} />;
      case 'instantReward':
        return <InstantRewardForm onSubmit={handleSubmit} isLoading={isLoading} />;
      case 'evidenceSubmission':
        return <EvidenceSubmissionForm onSubmit={handleSubmit} isLoading={isLoading} />;
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
        <Button onClick={handleAddNew} className={`bg-gradient-to-r ${currentTabConfig.gradient} hover:shadow-lg transition-all`}>
          <Plus className="h-4 w-4 mr-2" />
          New {currentTabConfig.title.replace(' Tasks', '')} Task
        </Button>
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

      {filteredTasks.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getTypeColor(task.type)}`}>
                    {getTypeIcon(task.type)}
                    {task.type}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
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
            onClick={() => setActiveTab('general')}
            className="mt-6 text-indigo-600 font-medium hover:text-indigo-700 underline underline-offset-4"
          >
            Go to General Tasks
          </button>
        </div>
      )}
    </div>
  );
}
