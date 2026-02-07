'use client';

import { Compass } from 'lucide-react';
import { Button } from '@/src/components/ui';
import Link from 'next/link';

export const EmptyState = () => {
  return (
    <div className="text-center py-24 bg-white rounded-[1rem] border-4 border-dashed border-gray-100">
      <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <Compass className="h-10 w-10 text-gray-200" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2">No Adventures Yet</h3>
      <p className="text-gray-500 max-w-sm mx-auto font-medium mb-8">
        Start creating your first 7-day challenge to engage kids with fun and educational tasks.
      </p>
      <Link href="/adventures/builder">
        <Button className="px-8 py-4 h-auto rounded-2xl font-bold shadow-lg shadow-purple-100">
          Build Your First Adventure
        </Button>
      </Link>
    </div>
  );
};
