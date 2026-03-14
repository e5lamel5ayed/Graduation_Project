/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui';
import { Upload, X } from 'lucide-react';
import { useCategories } from '@/src/hooks/useCategories';
import { SubCategoryFormData } from '@/src/types/category';

interface SubCategoryFormProps {
  initialData?: SubCategoryFormData | null;
  onSubmit: (data: SubCategoryFormData) => void;
  isLoading?: boolean;
}

export function CategoryForm({ initialData, onSubmit, isLoading = false }: SubCategoryFormProps) {

  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const [formData, setFormData] = useState<SubCategoryFormData>({
    nameAr: '',
    nameEn: '',
    iconFile: null,
    existingIconUrl: null,
    categoryId: '',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        nameAr: initialData.nameAr || '',
        nameEn: initialData.nameEn || '',
        iconFile: null,
        existingIconUrl: initialData.existingIconUrl || null,
        categoryId: initialData.categoryId || '',
      });
      if (initialData.existingIconUrl) {
        setPreviewUrl(initialData.existingIconUrl);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        iconFile: file,
      }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      iconFile: null,
    }));
    setPreviewUrl(initialData?.existingIconUrl || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
    });
  };

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      iconFile: null,
      existingIconUrl: null,
      categoryId: '',
    });
    setPreviewUrl(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nameAr" className="block text-sm font-semibold text-gray-700 text-left mb-1">
          Arabic Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="nameAr"
          name="nameAr"
          value={formData.nameAr}
          onChange={handleChange}
          placeholder="e.g.school assignments"
          required
        />
      </div>

      <div>
        <label htmlFor="nameEn" className="block text-sm font-semibold text-gray-700 text-left mb-1">
          English Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="nameEn"
          name="nameEn"
          value={formData.nameEn}
          onChange={handleChange}
          placeholder="e.g. Academic Tasks"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 text-left">
          Category <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
        >
          <SelectTrigger className="h-14 rounded-2xl border-gray-200">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingCategories ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : (
              categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.nameEn}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Icon Image
        </label>
        
        {previewUrl && (
          <div className="mb-3 relative inline-block">
            <img 
              src={previewUrl} 
              alt="Icon preview" 
              className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
            />
            {formData.iconFile && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <label
            htmlFor="iconFile"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Upload className="w-4 h-4 mr-2" />
            {formData.iconFile ? 'Change Image' : 'Upload Image'}
          </label>
          <input
            id="iconFile"
            name="iconFile"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {formData.iconFile && (
            <span className="text-sm text-gray-600">{formData.iconFile.name}</span>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, GIF up to 2MB
        </p>
      </div>



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
          {initialData ? 'Update' : 'Create'} SubCategory
        </Button>
      </div>
    </form>
  );
}
