'use client';

import React from 'react';
import { Search, Filter, AlertCircle, X } from 'lucide-react';
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
  recommendedAgeFilter: string;
  onRecommendedAgeChange: (val: string) => void;
}

export const TaskLibrary = ({
  tasks,
  filteredTasks,
  searchQuery,
  setSearchQuery,
  isLoading,
  isFetchingMore,
  onLoadMore,
  hasMore,
  recommendedAgeFilter,
  onRecommendedAgeChange,
}: TaskLibraryProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const filterRef = React.useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const hasActiveFilter = Boolean(recommendedAgeFilter);

  const handleScroll = () => {
    if (!scrollRef.current || isFetchingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Trigger when user is within 50px of the bottom
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      onLoadMore();
    }
  };

  // Close the filter popover when clicking outside of it
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        <div className="flex gap-2 relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
              hasActiveFilter
                ? 'bg-purple-50 border-purple-200 text-purple-700'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-100'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {hasActiveFilter && (
              <span className="ml-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-purple-600 text-white text-[10px] font-bold">
                1
              </span>
            )}
          </button>

          {isFilterOpen && (
            <div className="absolute z-20 top-full mt-2 left-0 w-full sm:w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
              <label
                htmlFor="recommendedAgeFilter"
                className="flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wide mb-2"
              >
                <Filter className="h-3.5 w-3.5" />
                Filter by Recommended Age
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="recommendedAgeFilter"
                  type="number"
                  min={0}
                  value={recommendedAgeFilter}
                  onChange={(e) => onRecommendedAgeChange(e.target.value)}
                  placeholder="e.g. 5"
                  autoFocus
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
                />
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={() => onRecommendedAgeChange('')}
                    title="Clear filter"
                    className="flex-shrink-0 w-10 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
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
