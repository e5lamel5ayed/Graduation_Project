import * as React from 'react';
import { Button } from './Button';
import { cn } from '@/src/lib/utils';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { HeadlessDialog, HeadlessDialogActions } from './HeadlessDialog';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  cell?: (value: unknown, item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
  pageSize?: number;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  isLoading = false,
  pageSize = 10,
  className,
  emptyMessage = 'No data available',
  deleteConfirmationMessage = 'Are you sure you want to delete this item?',
}: DataTableProps<T> & { deleteConfirmationMessage?: string }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemToDelete, setItemToDelete] = React.useState<T | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteClick = (item: T) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete);
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const renderCell = (item: T, column: Column<T>) => {
    const rawValue =
      typeof column.accessor === 'function'
        ? column.accessor(item)
        : item[column.accessor];

    const value =
      rawValue === null || rawValue === undefined
        ? ''
        : (typeof rawValue === 'object'
          ? JSON.stringify(rawValue)
          : String(rawValue));

    return column.cell ? column.cell(value, item) : value;
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg shadow overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                      column.className
                    )}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, data.length)}
                </span>{' '}
                of <span className="font-medium">{data.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="rounded-r-none"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="flex items-center px-4 border-t border-b border-gray-300 bg-gray-50 text-sm font-medium text-gray-700">
                  {currentPage} / {totalPages}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="rounded-l-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}

      <HeadlessDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        title="Confirm Delete"
        maxWidth="sm"
      >
        <div className="mt-4">
          <p className="text-gray-700">{deleteConfirmationMessage}</p>
          <HeadlessDialogActions>
            <Button
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="ml-2"
            >
              Cancel
            </Button>
          </HeadlessDialogActions>
        </div>
      </HeadlessDialog>
    </div>
  );
}
