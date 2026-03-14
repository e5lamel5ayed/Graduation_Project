import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from './Button';

import { PaginationProps } from '@/src/types/ui';


export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
}: PaginationProps) {
  // Helper to generate page range
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 5; // siblingCount + first + last + current + 2 dots

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, 'DOTS', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, 'DOTS', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, 'DOTS', ...middleRange, 'DOTS', totalPages];
    }

    return [];
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('flex w-full justify-center items-center gap-2 py-8', className)}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-xl border-gray-100 bg-white hover:bg-gray-50 hover:border-purple-200 transition-all duration-200 disabled:opacity-40"
      >
        <span className="sr-only">Previous page</span>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1.5 px-2">
        {pages.map((page, index) => {
          if (page === 'DOTS') {
            return (
              <div
                key={`dots-${index}`}
                className="flex h-10 w-10 items-center justify-center text-gray-400"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                'min-w-[40px] h-10 px-2 rounded-xl text-sm font-bold transition-all duration-300',
                isCurrent
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-110'
                  : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600 border border-transparent hover:border-purple-100'
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-xl border-gray-100 bg-white hover:bg-gray-50 hover:border-purple-200 transition-all duration-200 disabled:opacity-40"
      >
        <span className="sr-only">Next page</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
