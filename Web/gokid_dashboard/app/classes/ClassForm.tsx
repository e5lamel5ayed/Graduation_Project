/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { ClassFormData } from '@/src/types/class';

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
    adventuresCount: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name || '',
        teacher: initialData.teacher || '',
        maxStudents: initialData.maxStudents || '',
        schedule: initialData.schedule || '',
        adventuresCount: initialData.adventuresCount || 0,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'maxStudents' || name === 'adventuresCount') ? (value ? parseInt(value) : '') : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      maxStudents: formData.maxStudents === '' ? 0 : Number(formData.maxStudents),
      adventuresCount: (formData.adventuresCount as any) === '' ? 0 : Number(formData.adventuresCount),
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

      <div>
        <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">
          Teacher <span className="text-red-500">*</span>
        </label>
        <Input
          id="teacher"
          name="teacher"
          value={formData.teacher}
          onChange={handleChange}
          placeholder="Teacher's name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Students
          </label>
          <Input
            id="maxStudents"
            name="maxStudents"
            type="number"
            min="1"
            value={formData.maxStudents}
            onChange={handleChange}
            placeholder="30"
          />
        </div>

        <div>
          <label htmlFor="adventuresCount" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Adventures
          </label>
          <Input
            id="adventuresCount"
            name="adventuresCount"
            type="number"
            min="0"
            value={formData.adventuresCount}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
          Schedule
        </label>
        <Input
          id="schedule"
          name="schedule"
          value={formData.schedule}
          onChange={handleChange}
          placeholder="e.g. Mon, Wed, Fri 9:00 AM"
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
            adventuresCount: 0,
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
