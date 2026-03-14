'use client';

import { Trash2 } from 'lucide-react';
import { Button } from './Button';
import { HeadlessDialog } from './HeadlessDialog';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  description = 'Are you sure you want to delete this item? This action cannot be undone and may affect associated items.',
  itemName,
  isLoading = false,
}: ConfirmDeleteDialogProps) {
  return (
    <HeadlessDialog
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="sm"
    >
      <div className="flex flex-col items-center justify-center text-center py-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300">
          <Trash2 className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8">
          {itemName ? (
            <>
              Are you sure you want to delete <span className="font-bold text-gray-900">"{itemName}"</span>? {description}
            </>
          ) : (
            description
          )}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto min-w-[300px]">
          <Button
            onClick={onConfirm}
            isLoading={isLoading}
            className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-100 flex-1 py-6 rounded-xl text-md font-bold"
          >
            Yes, Delete
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-6 rounded-xl text-md font-bold border-gray-200"
          >
            Cancel
          </Button>
        </div>
      </div>
    </HeadlessDialog>
  );
}
