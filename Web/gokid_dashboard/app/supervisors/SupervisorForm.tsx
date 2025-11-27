/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';

export interface SupervisorFormData {
  id?: string;
  name: string;
  email: string;
  phoneNumber: number | string;

}

interface SupervisorFormProps {
  initialData?: SupervisorFormData | null;
  onSubmit: (data: SupervisorFormData) => void;
  isLoading?: boolean;
}

export function SupervisorForm({ initialData, onSubmit, isLoading = false }: SupervisorFormProps) {
  const [formData, setFormData] = useState<SupervisorFormData>({
    name: '',
    email: '',
    phoneNumber: '',

  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
   
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxStudents' ? (value ? parseInt(value) : '') : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      phoneNumber: formData.phoneNumber === '' ? 0 : Number(formData.phoneNumber),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Supervisor Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. john.doe@example.com"
          required
        />
      </div>

      <div className=" ">
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="number"
           
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="e.g. 1234567890"
          />
        </div>

     
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData({
            name: '',
            email: '',
            phoneNumber: '',
           
          })}
          disabled={isLoading}
        >
          Reset
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update' : 'Create'} Supervisor
        </Button>
      </div>
    </form>
  );
}
