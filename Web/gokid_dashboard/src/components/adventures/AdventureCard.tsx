'use client';

import { Adventure } from '@/src/types/adventure';
import { 
  MoreVertical, 
  Compass, 
  Calendar, 
  CheckCircle2, 
  ChevronRight,
  Clock,
  Target
} from 'lucide-react';
import Link from 'next/link';

interface AdventureCardProps {
  adventure: Adventure;
}

export const AdventureCard = ({ adventure }: AdventureCardProps) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-purple-200 flex flex-col h-full">
      {/* Top Section */}
      <div className="p-5 pb-0 flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200 text-white group-hover:scale-110 transition-transform duration-300">
          <Compass className="h-6 w-6" />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-500">
            {adventure.category}
          </span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
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

        {/* Action Button */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-500 transition-colors">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold">
              {new Date(adventure.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <Link 
            href={`/adventures/builder?id=${adventure.id}`}
            className="flex items-center gap-1.5 text-white font-bold text-xs bg-gray-900 hover:bg-purple-600 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-purple-200"
          >
            Edit <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
