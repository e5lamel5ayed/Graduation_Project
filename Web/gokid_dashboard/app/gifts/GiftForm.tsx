/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Upload, X } from 'lucide-react';
import { GiftFormData } from '@/src/types/gift';

interface GiftFormProps {
  initialData?: GiftFormData | null;
  onSubmit: (data: GiftFormData) => void;
  isLoading?: boolean;
}

const GIFT_TYPES = ['Badge', 'Sticker', 'Trophy', 'Medal', 'Reward', 'Certificate'];

export function GiftForm({ initialData, onSubmit, isLoading = false }: GiftFormProps) {
  const [formData, setFormData] = useState<GiftFormData>({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    pointsCost: 0,
    type: 'Badge',
    imageFile: null,
    existingImageUrl: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        nameAr: initialData.nameAr || '',
        nameEn: initialData.nameEn || '',
        descriptionAr: initialData.descriptionAr || '',
        descriptionEn: initialData.descriptionEn || '',
        pointsCost: initialData.pointsCost || 0,
        type: initialData.type || 'Badge',
        imageFile: null,
        existingImageUrl: initialData.existingImageUrl || null,
      });
      if (initialData.existingImageUrl) {
        setPreviewUrl(initialData.existingImageUrl);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pointsCost' ? parseInt(value, 10) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
      }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: null,
    }));
    setPreviewUrl(initialData?.existingImageUrl || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700 mb-1">
            Arabic Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="nameAr"
            name="nameAr"
            value={formData.nameAr}
            onChange={handleChange}
            placeholder="اسم الجائزة"
            required
            dir="rtl"
            className="text-right"
          />
        </div>

        <div>
          <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-1">
            English Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="nameEn"
            name="nameEn"
            value={formData.nameEn}
            onChange={handleChange}
            placeholder="Gift name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="descriptionAr" className="block text-sm font-medium text-gray-700 mb-1">
            Arabic Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="descriptionAr"
            name="descriptionAr"
            value={formData.descriptionAr}
            onChange={handleChange}
            placeholder="وصف الجائزة"
            required
            dir="rtl"
            className="text-right w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700 mb-1">
            English Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            value={formData.descriptionEn}
            onChange={handleChange}
            placeholder="Gift description"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="pointsCost" className="block text-sm font-medium text-gray-700 mb-1">
            Points Cost <span className="text-red-500">*</span>
          </label>
          <Input
            id="pointsCost"
            name="pointsCost"
            type="number"
            value={formData.pointsCost}
            onChange={handleChange}
            placeholder="0"
            required
            min="0"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Gift Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {GIFT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Gift Image
        </label>
        <div className="space-y-4">
          {previewUrl && (
            <div className="relative w-full h-64 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {!formData.imageFile && !previewUrl && (
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="text-gray-400" size={32} />
                <span className="text-sm text-gray-600">Click or drag image here</span>
              </div>
            </label>
          )}

          {formData.imageFile && (
            <label className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 bg-purple-50">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="text-purple-500" size={32} />
                <span className="text-sm text-purple-600">Click to change image</span>
              </div>
            </label>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isLoading ? 'Saving...' : 'Save Gift'}
        </Button>
      </div>
    </form>
  );
}
