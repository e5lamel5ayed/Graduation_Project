'use client';

import React from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskTemplate } from '@/src/types/task';
import { DraggableTaskCard } from './DraggableTaskCard';

interface TaskLibraryProps {
  tasks: TaskTemplate[];
  filteredTasks: TaskTemplate[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isLoading: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export const TaskLibrary = ({
  tasks,
  filteredTasks,
  searchQuery,
  setSearchQuery,
  isLoading,
  isFetchingMore,
  onLoadMore,
  hasMore
}: TaskLibraryProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current || isFetchingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Trigger when user is within 50px of the bottom
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      onLoadMore();
    }
  };

  return (
    <div className="w-full xl:w-[380px] flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-[640px]">
      <div className="p-5 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          Task Library
          <span className="bg-gray-100 text-gray-500 text-xs py-0.5 px-2 rounded-full font-bold">
            {tasks.length}
          </span>
        </h3>
        
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-600 border border-gray-100 transition-colors">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-r-transparent"></div>
            <p className="text-sm text-gray-500 animate-pulse">Loading library...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          <>
            <SortableContext 
              items={filteredTasks.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                {filteredTasks.map(task => (
                  <DraggableTaskCard key={task.id} task={task} />
                ))}
              </div>
            </SortableContext>
            
            {isFetchingMore && (
              <div className="flex justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-r-transparent"></div>
              </div>
            )}
            
            {!hasMore && filteredTasks.length > 0 && (
              <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">
                No more tasks to load
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
};
