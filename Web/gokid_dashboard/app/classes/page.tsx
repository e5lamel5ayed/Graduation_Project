'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/src/components/ui';
import { Button } from '@/src/components/ui/Button';
import { HeadlessDialog } from '@/src/components/ui/HeadlessDialog';
import { Plus } from 'lucide-react';
import { ClassForm, ClassFormData } from './ClassForm';
import { classService } from '@/src/services/classService';
import { Class } from '@/src/types/class';
import { toast } from 'sonner';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const data = await classService.getAll();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedClass(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsDialogOpen(true);
  };

  const handleDelete = async (classItem: Class) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      await classService.delete(classItem.id);
      toast.success('Class deleted successfully');
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Failed to delete class');
    }
  };

  const handleSubmit = async (formData: ClassFormData) => {
    setIsSubmitting(true);

    try {
      if (formData.id) {
        // Update existing class
        await classService.update(formData.id, {
          name: formData.name,
        });
        toast.success('Class updated successfully');
      } else {
        // Create new class
        await classService.create({
          name: formData.name,
        });
        toast.success('Class created successfully');
      }

      setIsDialogOpen(false);
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error('Failed to save class');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Class Name',
      accessor: (item: Class) => item.name,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Classes</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Class
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          data={classes}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No classes found. Click the button above to add a new class."
          isLoading={isLoading}
        />
      </div>

      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => !isSubmitting && setIsDialogOpen(false)}
        title={selectedClass ? 'Edit Class' : 'Add New Class'}
        maxWidth="lg"
      >
        <ClassForm
          initialData={selectedClass ? {
            id: selectedClass.id,
            name: selectedClass.name,
          } : undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </HeadlessDialog>
    </div>
  );
}