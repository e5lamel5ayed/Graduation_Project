'use client';

import React from 'react';
import { Calendar, FileText, Target, RotateCcw, Save, Send, Upload } from 'lucide-react';
import { Button } from '@/src/components/ui';

interface AdventureDetailsProps {
  isEditMode?: boolean;
  titleEn: string;
  setTitleEn: (val: string) => void;
  titleAr: string;
  setTitleAr: (val: string) => void;
  descriptionEn: string;
  setDescriptionEn: (val: string) => void;
  descriptionAr: string;
  setDescriptionAr: (val: string) => void;
  goalEn: string;
  setGoalEn: (val: string) => void;
  goalAr: string;
  setGoalAr: (val: string) => void;
  weekDuration: number;
  setWeekDuration: (val: number) => void;
  bonusPoints: number;
  setBonusPoints: (val: number) => void;
  descriptionVoiceFile: File | null;
  setDescriptionVoiceFile: (file: File | null) => void;
  bannerImage: File | null;
  setBannerImage: (file: File | null) => void;
  completedCount: number;
  totalDays: number;
  isComplete: boolean;
  onReset: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
}

export const AdventureDetails = ({
  isEditMode = false,
  titleEn, setTitleEn,
  titleAr, setTitleAr,
  descriptionEn, setDescriptionEn,
  descriptionAr, setDescriptionAr,
  goalEn, setGoalEn,
  goalAr, setGoalAr,
  weekDuration,
  setWeekDuration,
  bonusPoints,
  setBonusPoints,
  descriptionVoiceFile,
  setDescriptionVoiceFile,
  bannerImage,
  setBannerImage,
  completedCount,
  totalDays,
  isComplete,
  onReset,
  onPublish,
  isSubmitting
}: AdventureDetailsProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 shrink-0">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-purple-500 ml-1">Name (English)</label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="text-lg font-bold text-gray-900 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 w-full outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all"
                  placeholder="Adventure Name (EN)"
                />
              </div>
              <div className="space-y-1 text-right">
                <label className="text-[10px] font-black uppercase tracking-widest text-purple-500 mr-1">الاسم (عربي)</label>
                <input
                  type="text"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="text-lg font-bold text-gray-900 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 w-full outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all text-right"
                  placeholder="اسم المغامرة"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-purple-600 font-bold text-sm bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100/50">
                <Calendar className="h-4 w-4" /> {totalDays}-Day Challenge
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="weekDuration" className="text-[10px] font-black uppercase tracking-widest text-purple-500 ml-1">Week Duration</label>
                <input
                  id="weekDuration"
                  type="number"
                  min={1}
                  placeholder="7"
                  value={weekDuration}
                  onChange={(e) => setWeekDuration(Number(e.target.value) || 1)}
                  className="text-sm font-bold text-gray-900 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 w-full outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="bonusPoints" className="text-[10px] font-black uppercase tracking-widest text-purple-500 ml-1">Bonus Points</label>
                <input
                  id="bonusPoints"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={bonusPoints}
                  onChange={(e) => setBonusPoints(Number(e.target.value) || 0)}
                  className="text-sm font-bold text-gray-900 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 w-full outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="space-y-1 max-w-sm flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-purple-500 ml-1">Description Voice File</label>
                <label className="h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600 flex items-center gap-2 cursor-pointer hover:bg-white transition-all">
                  <Upload className="h-4 w-4 text-purple-500" />
                  <span className="truncate">{descriptionVoiceFile ? descriptionVoiceFile.name : 'Upload voice file (optional)'}</span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setDescriptionVoiceFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <div className="space-y-1 max-w-sm flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-purple-500 ml-1">Banner Image</label>
                <label className="h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600 flex items-center gap-2 cursor-pointer hover:bg-white transition-all">
                  <Upload className="h-4 w-4 text-purple-500" />
                  <span className="truncate">{bannerImage ? bannerImage.name : 'Upload banner image (optional)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setBannerImage(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col items-center md:items-end shrink-0 gap-4">
            <div className="flex flex-col items-center md:items-end w-full">
              <div className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em] hidden md:block">Adventure Progress</div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <progress
                  className="flex-1 md:w-48 h-2 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-purple-600 [&::-moz-progress-bar]:bg-purple-600"
                  value={completedCount}
                  max={totalDays || 1}
                />
                <span className="text-xl font-black text-purple-600 whitespace-nowrap">{completedCount}<span className="text-gray-300 mx-0.5">/</span>{totalDays}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" onClick={onReset} className="flex-1 md:flex-none text-gray-500 gap-1.5 text-[11px] font-bold px-3 h-9 rounded-lg border-gray-200 hover:bg-gray-50">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </Button>

             <Button
                disabled={!isComplete}
                onClick={onPublish}
                isLoading={isSubmitting}
                className={`
                  flex-1 md:flex-none gap-2 px-5 h-9 rounded-lg transition-all duration-300 text-[11px] font-black uppercase tracking-wider
                  ${isComplete ? 'shadow-lg shadow-purple-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                `}
              >
                <Send className="h-3.5 w-3.5" /> {isEditMode ? 'Publish Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">
              <FileText className="h-3.5 w-3.5 text-purple-500" /> Description / الوصف
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <textarea
                placeholder="English Description..."
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:bg-white transition-all resize-none h-20"
              />
              <textarea
                placeholder="الوصف بالعربي..."
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:bg-white transition-all resize-none h-20 text-right"
                dir="rtl"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">
              <Target className="h-3.5 w-3.5 text-purple-500" /> Adventure Goal / الهدف
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <textarea
                placeholder="English Goal..."
                value={goalEn}
                onChange={(e) => setGoalEn(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:bg-white transition-all resize-none h-20"
              />
              <textarea
                placeholder="الهدف بالعربي..."
                value={goalAr}
                onChange={(e) => setGoalAr(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:bg-white transition-all resize-none h-20 text-right"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
