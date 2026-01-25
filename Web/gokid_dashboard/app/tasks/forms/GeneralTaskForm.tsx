'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';

export interface GeneralTaskFormData {
  id?: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface GeneralTaskFormProps {
  initialData?: GeneralTaskFormData | null;
  onSubmit: (data: GeneralTaskFormData) => void;
  isLoading?: boolean;
}

export default function GeneralTaskForm({ initialData, onSubmit, isLoading = false }: GeneralTaskFormProps) {
  const [formData, setFormData] = useState<GeneralTaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    assignee: initialData?.assignee || '',
    dueDate: initialData?.dueDate || '',
    priority: initialData?.priority || 'medium',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: initialData?.id,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'medium',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Task Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title..."
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          placeholder="Describe the task..."
          rows={3}
        />
      </div>

      {/* Assignee & Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
            Assignee
          </label>
          <Input
            id="assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            placeholder="Assign to..."
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority
        </label>
        <div className="flex gap-3">
          {(['low', 'medium', 'high'] as const).map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => setFormData({ ...formData, priority })}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                formData.priority === priority
                  ? priority === 'low'
                    ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                    : priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500'
                    : 'bg-red-100 text-red-700 ring-2 ring-red-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={isLoading}
        >
          Reset
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData?.id ? 'Update' : 'Create'} Task
        </Button>
      </div>
    </form>
  );
}
