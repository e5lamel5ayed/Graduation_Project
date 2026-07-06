/* eslint-disable */
'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
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
    } catch (err) {
      console.error(err);
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => {
              const color = category.colorHex || '#9333ea';
              const cardStyle: Record<string, string> = {
                borderTopColor: color,
                borderTopWidth: '4px',
                '--category-color': color,
              };

              return (
                <div
                  key={category.id}
                  className="group flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                  style={cardStyle as React.CSSProperties}
                >
                  {/* Decorative Gradient Blob */}
                  <div
                    className="absolute -right-4 -top-4 w-40 h-40 blur-[80px] opacity-0 transition-opacity duration-700 group-hover:opacity-30"
                    style={{ backgroundColor: 'var(--category-color)' }}
                  />

                  <div className="relative z-10">
                    {/* Header: title + icon */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div
                            className="w-1.5 h-5 rounded-full"
                            style={{ backgroundColor: 'var(--category-color)' }}
                          />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Category
                          </span>
                        </div>
                        <h2
                          className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-[var(--category-color)] transition-colors duration-300"
                          title={category.nameEn}
                        >
                          {category.nameEn}
                        </h2>
                      </div>

                      <div className="ml-4 shrink-0">
                        {category.icon?.url ? (
                          <img
                            src={category.icon.url}
                            alt={category.nameEn}
                            className="w-14 h-14 rounded-2xl border border-gray-100 object-cover bg-white shadow-md ring-4 ring-gray-50/50 transform group-hover:rotate-6 transition-transform duration-300"
                          />
                        ) : (
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 border border-gray-100 shadow-inner group-hover:bg-white transition-colors duration-300"
                            style={{ color: 'var(--category-color)' }}
                          >
                            <div
                              className="w-6 h-6 rounded-full opacity-40 group-hover:opacity-100 transition-opacity"
                              style={{ backgroundColor: 'var(--category-color)' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arabic name + subcategory count */}
                    <div className="flex flex-col gap-3">
                      <p
                        className="text-sm font-semibold text-gray-400 bg-gray-50/50 px-4 py-2 rounded-2xl border border-gray-50 w-full text-right"
                        dir="rtl"
                      >
                        {category.nameAr || 'لا يوجد اسم'}
                      </p>

                      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-transparent bg-gray-50/30 group-hover:bg-white group-hover:border-gray-100 transition-all duration-300 shadow-sm">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: 'var(--category-color)' }}
                        />
                        <span className="text-xs font-bold text-gray-600">
                          {category.subCategoriesCount ?? 0} subcategories
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex items-center justify-end gap-3 relative z-10 border-t border-gray-50 pt-5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="h-10 px-5 rounded-2xl border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-600 hover:border-gray-100 hover:scale-105 transition-all duration-200"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      <span className="font-bold">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(category)}
                      className="h-10 px-5 rounded-2xl text-red-500 border-gray-100 hover:bg-red-50 hover:border-red-200 hover:scale-105 transition-all duration-200"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span className="font-bold">Delete</span>
                    </Button>
                  </div>
                </div>
              );
            })}
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

      <HeadlessDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        title="Confirm Delete"
        maxWidth="sm"
      >
        <div className="mt-4">
          <p className="text-gray-700">
            {categoryToDelete
              ? `Are you sure you want to delete "${categoryToDelete.name}"?`
              : 'Are you sure you want to delete this category?'}
          </p>
          <div className="mt-6 flex justify-end space-x-2">
            <Button
              onClick={handleConfirmDelete}
              isLoading={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </HeadlessDialog>
    </div>
  );
}
