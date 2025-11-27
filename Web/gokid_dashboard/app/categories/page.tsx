'use client';

import { useState } from 'react';
import { DataTable } from '@/src/components/ui';
import { Button } from '@/src/components/ui/Button';
import { HeadlessDialog } from '@/src/components/ui/HeadlessDialog';
import { Plus } from 'lucide-react';
import { CategoryForm, CategoryFormData } from './CategoryForm';

interface Category extends CategoryFormData {
  id: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Toys', description: 'Educational and fun toys for kids' },
    { id: '2', name: 'Books', description: 'Story and learning books' },
    { id: '3', name: 'Snacks', description: 'Healthy snacks for kids' },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNew = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    // if (confirm(`Are you sure you want to delete ${category.name}?`)) {
      setCategories(categories.filter(c => c.id !== category.id));
    // }
  };

  const handleSubmit = async (formData: CategoryFormData) => {
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API

    if (formData.id) {
      // Update existing category
      setCategories(categories.map(c =>
        c.id === formData.id
          ? { ...c, ...formData }
          : c
      ));
    } else {
      // Add new category
      const newCategory: Category = {
        ...formData,
        id: Date.now().toString(),
      };
      setCategories([...categories, newCategory]);
    }

    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  const columns = [
    {
      header: 'Category Name',
      accessor: (item: Category) => item.name,
    },
    {
      header: 'Description',
      accessor: (item: Category) => item.description,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Category
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          data={categories}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No categories found. Click the button above to add a new category."
        />
      </div>

      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => !isSubmitting && setIsDialogOpen(false)}
        title={selectedCategory ? 'Edit Category' : 'Add New Category'}
        maxWidth="lg"
      >
        <CategoryForm
          initialData={selectedCategory || undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </HeadlessDialog>
    </div>
  );
}
