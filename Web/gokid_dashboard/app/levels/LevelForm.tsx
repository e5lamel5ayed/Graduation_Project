/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Award, Hash, ImagePlus, X } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import type { Level } from '@/src/types/level';

export interface LevelFormData {
  id?: string;
  name: string;
  order: number;
  minPoints: number;
  badgeFile?: File | null;
  badgeUrl?: string;
}

interface LevelFormProps {
  initialData?: Level | null;
  onSubmit: (data: LevelFormData) => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const normalizeInitialData = (initialData?: Level | null): LevelFormData | null => {
  if (!initialData) {
    return null;
  }

  return {
    id: initialData.id,
    name: initialData.name || '',
    order: initialData.order,
    minPoints: initialData.minPoints,
    badgeUrl: initialData.badgeUrl,
  };
};

const emptyLevelForm: LevelFormData = {
  name: '',
  order: 1,
  minPoints: 0,
};

export function LevelForm({ initialData, onSubmit, isLoading = false, mode }: LevelFormProps) {
  const [formData, setFormData] = useState<LevelFormData>(() => normalizeInitialData(initialData) || emptyLevelForm);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'order' || name === 'minPoints') {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBadgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        badgeFile: e.target.files?.[0],
      }));
    }
  };

  const clearBadge = () => {
    setFormData((prev) => ({
      ...prev,
      badgeFile: undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Level Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g. Explorer"
          leftIcon={<Award />}
          required
        />

        <Input
          label="Order"
          name="order"
          type="number"
          min={1}
          value={formData.order}
          onChange={handleInputChange}
          placeholder="e.g. 1"
          required
        />
      </div>

      <Input
        label="Minimum Points"
        name="minPoints"
        type="number"
        min={0}
        value={formData.minPoints}
        onChange={handleInputChange}
        placeholder="e.g. 100"
        required
      />

      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <ImagePlus className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Badge Image</h4>
            <p className="text-xs text-gray-500">PNG or JPG up to 5MB</p>
          </div>
        </div>

        <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-gray-200 bg-white px-4 py-5 text-center transition hover:border-purple-300 hover:bg-purple-50/30">
          <input type="file" accept="image/*" className="hidden" onChange={handleBadgeChange} />

          {formData.badgeFile ? (
            <div className="flex items-center justify-center gap-3 text-sm font-medium text-purple-700">
              <span className="max-w-[240px] truncate">{formData.badgeFile.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  clearBadge();
                }}
                className="rounded-full p-1 hover:bg-purple-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : formData.badgeUrl ? (
            <div className="space-y-3">
              <img src={formData.badgeUrl} alt="Level badge" className="mx-auto h-20 w-20 rounded-2xl border border-gray-100 object-cover shadow-sm" />
              <span className="block text-xs text-gray-500">Click to replace current badge</span>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="block text-sm font-semibold text-gray-900">Upload badge image</span>
              <span className="block text-xs text-gray-500">Drag and drop or click to browse</span>
            </div>
          )}
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData(emptyLevelForm)}
          disabled={isLoading}
        >
          Reset
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === 'create' ? 'Create Level' : 'Update Level'}
        </Button>
      </div>
    </form>
  );
}
