'use client';

import { useState } from 'react';
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui';
import { Upload, Star, Image as ImageIcon, Sparkles, X, FileCheck, Eye, ShieldCheck, UserCheck } from 'lucide-react';

export interface EvidenceSubmissionFormData {
  id?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  instructionsText: string;
  evidenceType: 'Image' | 'Video';
  reviewBy: 'Parent' | 'PlatformAdmin' | 'AI';
  subCategoryId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  basePoints: number;
  taskImageFile: File | null;
  iconFile: File | null;
}

interface EvidenceSubmissionFormProps {
  initialData?: EvidenceSubmissionFormData | null;
  onSubmit: (data: EvidenceSubmissionFormData) => void;
  isLoading?: boolean;
}

export default function EvidenceSubmissionForm({ initialData, onSubmit, isLoading = false }: EvidenceSubmissionFormProps) {
  const [formData, setFormData] = useState<EvidenceSubmissionFormData>({
    titleAr: initialData?.titleAr || '',
    titleEn: initialData?.titleEn || '',
    descriptionAr: initialData?.descriptionAr || '',
    descriptionEn: initialData?.descriptionEn || '',
    instructionsText: initialData?.instructionsText || '',
    evidenceType: initialData?.evidenceType || 'Image',
    reviewBy: initialData?.reviewBy || 'Parent',
    subCategoryId: initialData?.subCategoryId || '',
    difficulty: initialData?.difficulty || 'Medium',
    basePoints: initialData?.basePoints || 30,
    taskImageFile: null,
    iconFile: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = ['basePoints'].includes(name);
    setFormData(prev => ({
      ...prev,
      [name]: isNumber ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'taskImageFile' | 'iconFile') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: e.target.files![0],
      }));
    }
  };

  const clearFile = (fieldName: 'taskImageFile' | 'iconFile') => {
    setFormData(prev => ({ ...prev, [fieldName]: null }));
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
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      instructionsText: '',
      evidenceType: 'Image',
      reviewBy: 'Parent',
      subCategoryId: '',
      difficulty: 'Medium',
      basePoints: 30,
      taskImageFile: null,
      iconFile: null,
    });
  };

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];
  const evidenceTypes = ['Image', 'Video'];
  const reviewByOptions = [
    { value: 'Parent', label: 'Parent', icon: UserCheck },
    { value: 'PlatformAdmin', label: 'Admin', icon: ShieldCheck },
    { value: 'AI', label: 'AI Validation', icon: Sparkles },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-4xl mx-auto">
      
      {/* Section 1: Task Information (Bilingual) */}
      <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
          Task Information
        </h3>
        
        {/* Titles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="titleEn" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              English Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="titleEn"
              name="titleEn"
              value={formData.titleEn}
              onChange={handleChange}
              placeholder="e.g. Clean your room"
              required
              dir="ltr"
              className="bg-white rounded-lg shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="titleAr" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Arabic Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="titleAr"
              name="titleAr"
              value={formData.titleAr}
              onChange={handleChange}
              placeholder="مثال: نظف غرفتك"
              required
              dir="rtl"
              className="bg-white rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="descriptionEn" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              English Description
            </label>
            <textarea
              id="descriptionEn"
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none min-h-[80px] text-sm"
              placeholder="Describe the task..."
              rows={3}
              dir="ltr"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="descriptionAr" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Arabic Description
            </label>
            <textarea
              id="descriptionAr"
              name="descriptionAr"
              value={formData.descriptionAr}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none min-h-[80px] text-sm"
              placeholder="وصف المهمة..."
              rows={3}
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Submission Requirements */}
      <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1 h-4 bg-green-500 rounded-full"></span>
          Submission Requirements
        </h3>
        
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="instructionsText" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Submission Instructions (Step by step)
            </label>
            <textarea
              id="instructionsText"
              name="instructionsText"
              value={formData.instructionsText}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none min-h-[80px] text-sm"
              placeholder="e.g. Take a photo of your room after cleaning..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="evidenceType" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Required Evidence Type
              </label>
            <Select
              value={formData.evidenceType}
              onValueChange={(value: 'Image' | 'Video') => setFormData(prev => ({ ...prev, evidenceType: value }))}
            >
              <SelectTrigger className="h-[52px] rounded-xl border-gray-200 bg-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {evidenceTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Reviewed By
              </label>
              <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm h-[42px]">
                {reviewByOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, reviewBy: opt.value as EvidenceSubmissionFormData['reviewBy'] }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 rounded-md text-xs font-medium transition-all ${
                      formData.reviewBy === opt.value 
                        ? 'bg-purple-100 text-purple-700 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <opt.icon className="h-3 w-3" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Configuration */}
      <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1 h-4 bg-yellow-500 rounded-full"></span>
          General Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="basePoints" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Base Points
            </label>
            <div className="relative group">
              <Input
                id="basePoints"
                name="basePoints"
                type="number"
                value={formData.basePoints}
                onChange={handleChange}
                min={1}
                className="pl-9 bg-white transition-all group-hover:border-yellow-400 rounded-lg shadow-sm"
              />
              <Star className="absolute left-3 top-2.5 h-4 w-4 text-yellow-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="difficulty" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Difficulty
            </label>
            <Select
              value={formData.difficulty}
              onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setFormData(prev => ({ ...prev, difficulty: value }))}
            >
              <SelectTrigger className="h-[52px] rounded-xl border-gray-200 bg-white">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="subCategoryId" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Sub Category ID
            </label>
            <Input
              id="subCategoryId"
              name="subCategoryId"
              value={formData.subCategoryId}
              onChange={handleChange}
              placeholder="Enter ID"
              className="bg-white rounded-lg shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Visual Assets */}
      <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1 h-4 bg-pink-500 rounded-full"></span>
          Visual Assets
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-white hover:border-purple-400 transition-all group bg-white/50 shadow-sm">
            <label htmlFor="taskImageFile" className="cursor-pointer w-full flex flex-col items-center">
              <div className="bg-purple-50 text-purple-600 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform shadow-sm">
                <ImageIcon className="h-6 w-6" />
              </div>
              {formData.taskImageFile ? (
                  <div className="flex items-center gap-2 text-sm text-purple-700 font-medium bg-purple-50 px-4 py-2 rounded-full max-w-full">
                    <span className="truncate max-w-[150px]">{formData.taskImageFile.name}</span>
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); clearFile('taskImageFile'); }}
                      className="p-1 hover:bg-purple-200 rounded-full shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
              ) : (
                <>
                  <span className="block text-sm font-semibold text-gray-900">Upload Task Image</span>
                  <span className="block text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                </>
              )}
              <input
                id="taskImageFile"
                name="taskImageFile"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'taskImageFile')}
              />
            </label>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-white hover:border-pink-400 transition-all group bg-white/50 shadow-sm">
            <label htmlFor="iconFile" className="cursor-pointer w-full flex flex-col items-center">
              <div className="bg-pink-50 text-pink-600 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              {formData.iconFile ? (
                  <div className="flex items-center gap-2 text-sm text-pink-700 font-medium bg-pink-50 px-4 py-2 rounded-full max-w-full">
                    <span className="truncate max-w-[150px]">{formData.iconFile.name}</span>
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); clearFile('iconFile'); }}
                      className="p-1 hover:bg-pink-200 rounded-full shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
              ) : (
                <>
                  <span className="block text-sm font-semibold text-gray-900">Upload SVG/PNG Icon</span>
                  <span className="block text-xs text-gray-500 mt-1">Preferred 1:1, max 2MB</span>
                </>
              )}
              <input
                id="iconFile"
                name="iconFile"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'iconFile')}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={resetForm}
          disabled={isLoading}
          className="px-6 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all"
        >
          Reset
        </button>
        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] px-8"
        >
          {initialData?.id ? 'Update' : 'Create'} Evidence Task
        </Button>
      </div>
    </form>
  );
}
