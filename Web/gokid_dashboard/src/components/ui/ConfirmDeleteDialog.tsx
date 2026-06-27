import React from 'react';
import { Button } from './Button';
import { HeadlessDialog } from './HeadlessDialog';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  title = "Confirm Delete",         // default value
  description,
  isLoading = false,
}: ConfirmDeleteDialogProps) {
  return (
    <HeadlessDialog isOpen={isOpen} onClose={onClose} title="Confirm Delete" maxWidth="sm">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Are you sure you want to delete <span className="font-semibold">{itemName || 'this item'}</span>?
        </p>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} isLoading={isLoading} className="bg-rose-600 hover:bg-rose-700">
            Delete
          </Button>
        </div>
      </div>
    </HeadlessDialog>
  );
}

export default ConfirmDeleteDialog;
