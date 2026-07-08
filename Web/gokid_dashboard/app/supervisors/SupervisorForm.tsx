/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { User, X } from 'lucide-react';

export interface SupervisorFormData {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatarFile?: File;
  avatarUrl?: string;
}

interface SupervisorFormProps {
  initialData?: SupervisorFormData | null;
  onSubmit: (data: SupervisorFormData) => void;
  isLoading?: boolean;
}

export function SupervisorForm({ initialData, onSubmit, isLoading = false }: SupervisorFormProps) {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState<SupervisorFormData>({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        password: '',
        phoneNumber: initialData.phoneNumber || '',
        avatarUrl: initialData.avatarUrl,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        avatarFile: e.target.files![0],
      }));
    }
  };

  const clearFile = () => {
    setFormData(prev => ({ ...prev, avatarFile: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
          {isEditMode && <span className="text-xs text-gray-400 font-normal ml-1">(cannot be changed)</span>}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. john.doe@example.com"
          required
          disabled={isEditMode}
          className={isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password {!initialData && <span className="text-red-500">*</span>}
          {isEditMode && <span className="text-xs text-gray-400 font-normal ml-1">(cannot be changed here)</span>}
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={isEditMode ? '••••••••' : 'Enter password'}
          required={!initialData}
          disabled={isEditMode}
          className={isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="e.g. 01234567890"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar Image
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-purple-400 transition-all group bg-white shadow-sm">
          <label htmlFor="avatarFile" className="cursor-pointer w-full flex flex-col items-center">
            <div className="bg-purple-50 text-purple-600 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <User className="h-6 w-6" />
            </div>
            {formData.avatarFile ? (
              <div className="flex items-center gap-2 text-sm text-purple-700 font-medium bg-purple-50 px-4 py-2 rounded-full max-w-full">
                <span className="truncate max-w-[200px]">{formData.avatarFile.name}</span>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); clearFile(); }}
                  className="p-1 hover:bg-purple-200 rounded-full shrink-0"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : formData.avatarUrl ? (
              <div className="space-y-2">
                <img 
                  src={formData.avatarUrl} 
                  alt="Current avatar" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-200"
                />
                <span className="block text-xs text-gray-500">Click to change image</span>
              </div>
            ) : (
              <>
                <span className="block text-sm font-semibold text-gray-900">Upload Avatar Image</span>
                <span className="block text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
              </>
            )}
            <input
              id="avatarFile"
              name="avatarFile"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData({
            fullName: '',
            email: '',
            password: '',
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