'use client';

import { Adventure } from '@/src/types/adventure';
import { 
  BookOpen, 
  Calendar, 
  Trash2,
  ChevronRight,
  Target,
  School,
} from 'lucide-react';
import Link from 'next/link';

interface AdventureCardProps {
  adventure: Adventure;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  onToggleStatus?: (adventure: Adventure) => void;
  isStatusUpdating?: boolean;
  onAssign?: (adventure: Adventure) => void;
  isAssigning?: boolean;
}

export const AdventureCard = ({
  adventure,
  onDelete,
  isDeleting = false,
  onToggleStatus,
  isStatusUpdating = false,
  onAssign,
  isAssigning = false,
}: AdventureCardProps) => {
  const isActive = adventure.status === 'Active';

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-purple-200 flex flex-col h-full">
      {/* Top Section */}
      <div className="p-5 pb-0 flex items-start justify-between mb-4">
        <Link 
          href={`/adventures/${adventure.id}/story`}
          className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200 text-white group-hover:scale-110 transition-transform duration-300 hover:from-purple-600 hover:to-purple-700"
        >
          <BookOpen className="h-6 w-6" />
        </Link>
        
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-end gap-1.5">
            <button
              type="button"
              disabled={isStatusUpdating}
              onClick={() => onToggleStatus?.(adventure)}
              className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all duration-200 hover:scale-[1.03] disabled:opacity-50 ${
                isActive
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
            >
              {isStatusUpdating ? 'Updating...' : adventure.status || adventure.category}
            </button>

            <button
              type="button"
              disabled={isAssigning}
              onClick={() => onAssign?.(adventure)}
              className="px-2 py-1 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 text-[10px] font-black uppercase tracking-wider transition-all duration-200 hover:scale-[1.03] disabled:opacity-50"
            >
              {isAssigning ? 'Assigning...' : (
                <span className="inline-flex items-center gap-1">
                  <School className="h-3 w-3" /> Assign
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 gap-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {adventure.title}
          </h3>
          
          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
            {adventure.description}
          </p>
        </div>

        {/* Goal Section */}
        <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100/50 group-hover:border-purple-100 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-white rounded-lg shadow-sm text-purple-600 mt-0.5">
                <Target className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block mb-1">Adventure Goal</span>
                <p className="text-xs font-bold text-gray-700 line-clamp-2 leading-relaxed">
                  {adventure.goal}
                </p>
              </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-500 transition-colors">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold">
              {new Date(adventure.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete?.(adventure.id)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
              aria-label="Delete adventure"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <Link 
              href={`/adventures/builder?id=${adventure.id}`}
              className="flex items-center gap-1.5 text-white font-bold text-xs bg-gray-900 hover:bg-purple-600 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-purple-200"
            >
              Edit <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
