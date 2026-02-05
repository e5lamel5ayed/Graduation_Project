'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  List,
} from 'lucide-react';
import { Button } from '@/src/components/ui';
import Link from 'next/link';
import { DUMMY_ADVENTURES } from './data';
import { AdventureCard, EmptyState } from '@/src/components/adventures';
import { Adventure } from '@/src/types/adventure';

export default function AdventuresPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [adventures, setAdventures] = useState<Adventure[]>(DUMMY_ADVENTURES);

  useEffect(() => {
    // Load adventures from local storage only on client side
    const storedAdventures = localStorage.getItem('adventures');
    if (storedAdventures) {
      try {
        const parsed = JSON.parse(storedAdventures);
        if (Array.isArray(parsed)) {
          // Combine stored adventures with dummy data, avoiding duplicates if any
          // For now, simpler: just prepend new ones to dummy ones
          setAdventures([...parsed, ...DUMMY_ADVENTURES]);
        }
      } catch (e) {
        console.error('Failed to parse stored adventures', e);
      }
    }
  }, []);

  return (
    <div className="p-3 sm:p-8 bg-gray-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-5">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-none mb-2">My Adventures</h1>
            <p className="text-gray-500 font-medium">Manage and monitor all your 7-day challenges</p>
          </div>
        </div>

        <Link href="/adventures/builder">
          <Button className="px-5 py-3 rounded-lg shadow-xl shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3 h-auto">
            <span className="text-base font-bold">Build Adventure</span>
          </Button>
        </Link>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex items-center gap-3 mb-5 w-full lg:w-auto">
        <div className="flex bg-gray-100 p-1 rounded-xl flex-1 lg:flex-none">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex-1 lg:px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="text-xs font-bold">Grid</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex-1 lg:px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="h-4 w-4" />
            <span className="text-xs font-bold">List</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {adventures.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {adventures.map(adventure => (
            <AdventureCard key={adventure.id} adventure={adventure} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
