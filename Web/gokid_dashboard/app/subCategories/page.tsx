/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button, Pagination } from '@/src/components/ui';
import { HeadlessDialog } from '@/src/components/ui/HeadlessDialog';
import { Plus, Pencil, Trash2, Loader2, FolderOpen, Tag, Layers } from 'lucide-react';
import { CategoryForm, CategoryFormData } from './SubCategoryForm';
import {
  useSubCategories,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
  useSubCategory,
} from '@/src/hooks/useSubCategories';
import { useCategories } from '@/src/hooks/useCategories';
import type { SubCategory, Category } from '@/src/types/category';

export default function CategoriesPage() {
  const { data: subCategories, isLoading: isLoadingSub, error: subError } = useSubCategories();
  const { data: categories, isLoading: isLoadingCats } = useCategories();
  
  const createMutation = useCreateSubCategory();
  const updateMutation = useUpdateSubCategory();
  const deleteMutation = useDeleteSubCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFormData | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Track selected id and fetch single category when editing
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: selectedFullCategory, isLoading: isLoadingSelectedCategory } = useSubCategory(selectedId || '');

  const handleAddNew = () => {
    setSelectedCategory(null);
    setSelectedId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: SubCategory) => {
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
      categoryId: selectedFullCategory.categoryId || '',
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
        // Update existing subcategory
        await updateMutation.mutateAsync({  
            id: formData.id,
            data: {
              nameAr: formData.nameAr,
              nameEn: formData.nameEn,
              iconFile: formData.iconFile,
              categoryId: formData.categoryId,
            },
          });
        } else {
          // Add new subcategory
          await createMutation.mutateAsync({
            nameAr: formData.nameAr,
            nameEn: formData.nameEn,
            iconFile: formData.iconFile,
            categoryId: formData.categoryId,
          });
        }
      setIsDialogOpen(false);
      setSelectedId(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoadingSub || isLoadingCats) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (subError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading subcategories: {(subError as Error).message}
        </div>
      </div>
    );
  }

  const ITEMS_PER_PAGE = 8;
  const totalPages = subCategories ? Math.ceil(subCategories.length / ITEMS_PER_PAGE) : 0;
  
  const currentSubCategories = subCategories?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-10">
        <div className="group cursor-default">
          <div className="flex items-center gap-3">
          
            <div>
         <h1 className="text-2xl font-bold text-gray-800">
                SubCategories
              </h1>
            </div>
          </div>
        </div>
        <Button 
          onClick={handleAddNew}
          className="h-12 px-6 rounded-2xl shadow-lg shadow-purple-100 hover:shadow-purple-200 transition-all duration-300"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span className="font-bold">Add New SubCategory</span>
        </Button>
      </div>

      <div className="py-6">
        {!subCategories || subCategories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No subcategories found. Click the button above to add a new subcategory.
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentSubCategories?.map((subCategory) => {
                // Find matching parent category to get its color
                const parentCategory = categories?.find(cat => cat.id === subCategory.categoryId);
                const categoryColor = parentCategory?.colorHex || '#9333ea';
                const categoryName = subCategory.categoryNameEn || parentCategory?.nameEn || 'General';

                return (
                  <div
                    key={subCategory.id}
                    className="group flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                    style={{ 
                      borderTopColor: categoryColor, 
                      borderTopWidth: '4px',
                      // @ts-ignore
                      '--category-color': categoryColor
                    }}
                  >
                    {/* Decorative Gradient Background */}
                    <div 
                      className="absolute -right-4 -top-4 w-40 h-40 blur-[80px] opacity-0 transition-opacity duration-700 group-hover:opacity-30"
                      style={{ backgroundColor: 'var(--category-color)' }}
                    />

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div 
                              className="w-1.5 h-5 rounded-full"
                              style={{ backgroundColor: 'var(--category-color)' }}
                            />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              SubCategory
                            </span>
                          </div>
                          <h2 
                            className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-[var(--category-color)] transition-colors duration-300" 
                            title={subCategory.nameEn}
                          >
                            {subCategory.nameEn}
                          </h2>
                        </div>

                        <div className="ml-4 shrink-0">
                          {subCategory.icon?.url ? (
                            <img
                              src={subCategory.icon.url}
                              alt={subCategory.nameEn}
                              className="w-14 h-14 rounded-2xl border border-gray-100 object-cover bg-white shadow-md ring-4 ring-gray-50/50 transform group-hover:rotate-6 transition-transform duration-300"
                            />
                          ) : (
                            <div 
                              className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 border border-gray-100 shadow-inner group-hover:bg-white transition-colors duration-300"
                              style={{ color: 'var(--category-color)' }}
                            >
                              <FolderOpen className="w-7 h-7 opacity-40 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-gray-400 bg-gray-50/50 px-4 py-2 rounded-2xl border border-gray-50 w-full text-right" dir="rtl">
                          {subCategory.nameAr || 'لا يوجد اسم'}
                        </p>

                        <div 
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-transparent bg-gray-50/30 group-hover:bg-white group-hover:border-gray-100 transition-all duration-300 shadow-sm"
                        >
                          <Tag className="w-4 h-4" style={{ color: 'var(--category-color)' }} />
                          <span className="text-xs font-bold text-gray-600 truncate">
                            {categoryName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3 relative z-10 border-t border-gray-50 pt-5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(subCategory)}
                        className="h-10 px-5 rounded-2xl border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-600 hover:border-gray-100 hover:scale-105 transition-all duration-200"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        <span className="font-bold">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(subCategory)}
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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-10"
            />
          </>
        )}
      </div>

      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => !createMutation.isPending && !updateMutation.isPending && setIsDialogOpen(false)}
        title={selectedId ? 'Edit SubCategory' : 'Add New SubCategory'}
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