'use client';

import { useState } from 'react';
import { CheckSquare, Plus, Calendar, User, Tag, FileText, Mic } from 'lucide-react';
import Tabs from './taps';
import { Btn } from '@/src/components/ui';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'voice';
  assignee: string;
  dueDate: string;
  tags: string[];
}

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Arabic Vocabulary Test',
      description: 'Review common Arabic words and their meanings',
      type: 'text',
      assignee: 'Ahmed Ali',
      dueDate: '2024-01-20',
      tags: ['arabic', 'vocabulary']
    },
    {
      id: '2',
      title: 'Pronunciation Exercise',
      description: 'Record yourself pronouncing the alphabet',
      type: 'voice',
      assignee: 'Sara Khalid',
      dueDate: '2024-01-25',
      tags: ['pronunciation', 'basics']
    },
    {
      id: '3',
      title: 'Short Story Writing',
      description: 'Write a 100-word story about your day',
      type: 'text',
      assignee: 'Omar Hassan',
      dueDate: '2024-01-15',
      tags: ['writing', 'creative']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const getTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'text':
        return 'bg-blue-100 text-blue-800';
      case 'voice':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesTab = activeTab === 'all' || task.type === activeTab;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAddNew = () => {
    // Logic for adding new task
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">Manage and track your student tasks</p>
        </div>
        <Btn onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Btn>
      </div>

      <div className=" overflow-x-auto pb-2">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

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
                    {task.type === 'text' ? (
                      <FileText className="h-3.5 w-3.5" />
                    ) : (
                      <Mic className="h-3.5 w-3.5" />
                    )}
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
            We couldn't find any tasks matching your current filters or search terms.
          </p>
          <button 
            onClick={() => {setActiveTab('all'); setSearchTerm('');}}
            className="mt-6 text-purple-600 font-medium hover:text-purple-700 underline underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
