/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button, ConfirmDeleteDialog } from '@/src/components/ui';
import { HeadlessDialog } from '@/src/components/ui/HeadlessDialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { CategoryForm, CategoryFormData } from './CategoryForm';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useCategory } from '@/src/hooks/useCategories';
import type { Category } from '@/src/types/category';

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFormData | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Track selected id and fetch single category when editing
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: selectedFullCategory, isLoading: isLoadingSelectedCategory } = useCategory(selectedId || '');

  const handleAddNew = () => {
    setSelectedCategory(null);
    setSelectedId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    // Store only the id and open dialog; data will be fetched via useCategory
    setSelectedId(category.id);
    setIsDialogOpen(true);
  };

  // Build initialData from fetched single category when available
  const initialDataFromSelected: CategoryFormData | undefined = selectedFullCategory
    ? {
      id: selectedFullCategory.id,
      nameAr: selectedFullCategory.nameAr,
      nameEn: selectedFullCategory.nameEn,
      iconFile: null,
      existingIconUrl: selectedFullCategory.icon?.url,
      colorHex: selectedFullCategory.colorHex,
    }
    : selectedCategory || undefined;

  const handleDeleteClick = (category: { id: string; nameEn: string }) => {
    setCategoryToDelete({ id: category.id, name: category.nameEn });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await deleteMutation.mutateAsync(categoryToDelete.id);
    }
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleSubmit = async (formData: CategoryFormData) => {
    try {
      if (formData.id) {
        // Update existing category
        await updateMutation.mutateAsync({
          id: formData.id,
          data: {
            nameAr: formData.nameAr,
            nameEn: formData.nameEn,
            iconFile: formData.iconFile,
            colorHex: formData.colorHex,
          },
        });
      } else {
        // Add new category
        await createMutation.mutateAsync({
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
          iconFile: formData.iconFile,
          colorHex: formData.colorHex,
        });
      }
      setIsDialogOpen(false);
      setSelectedId(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading categories: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
           New Category
        </Button>
      </div>

      <div className="py-6">
        {!categories || categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No categories found. Click the button above to add a new category.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col justify-between rounded-lg border border-gray-200 bg-linear-to-b from-purple-50/70 to-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-150 relative"
                style={{ borderTopColor: category.colorHex, borderTopWidth: '4px' }}
              >
                {category.icon?.url && (
                    <img
                      src={category.icon.url}
                      alt={`${category.nameEn} icon`}
                    className="absolute top-2 right-2 w-10 h-10 rounded-full border border-gray-200 object-cover bg-white"
                    />
                  )}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-900 truncate" title={category.nameEn}>
                      {category.nameEn}
                    </h2>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.colorHex }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-1" dir="rtl">{category.nameAr}</p>
                  <p className="text-xs text-gray-500">
                    {category.subCategoriesCount} subcategories
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="flex items-center space-x-1"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(category)}
                    className="flex items-center space-x-1 text-red-600 border-red-200 hover:bg-red-50"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => !createMutation.isPending && !updateMutation.isPending && setIsDialogOpen(false)}
        title={selectedId ? 'Edit Category' : 'Add New Category'}
        maxWidth="lg"
      >
        {selectedId && isLoadingSelectedCategory ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          </div>
        ) : (
          <CategoryForm
            initialData={initialDataFromSelected}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </HeadlessDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={categoryToDelete?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}