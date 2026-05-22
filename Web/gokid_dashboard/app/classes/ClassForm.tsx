/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';

export interface ClassFormData {
  id?: string;
  name: string;
}

interface ClassFormProps {
  initialData?: ClassFormData | null;
  onSubmit: (data: ClassFormData) => void;
  isLoading?: boolean;
}

export function ClassForm({ initialData, onSubmit, isLoading = false }: ClassFormProps) {
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    teacher: '',
    maxStudents: '',
    schedule: '',
    activeAdventuresCount: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name || '',
        teacher: initialData.teacher || '',
        maxStudents: initialData.maxStudents || '',
        schedule: initialData.schedule || '',
          activeAdventuresCount: initialData.activeAdventuresCount || 0,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Class Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Math 101"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData({
            name: '',
            teacher: '',
            maxStudents: '',
            schedule: '',
            activeAdventuresCount: 0,
          })}
          disabled={isLoading}
        >
          Reset
        </Button>
        <Button type="submit" isLoading={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
          {initialData ? 'Update' : 'Create'} Class
        </Button>
      </div>
    </form>
  );
}
