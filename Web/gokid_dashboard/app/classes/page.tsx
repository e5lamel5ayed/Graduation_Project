'use client';

import { useState } from 'react';
import { DataTable, Button, HeadlessDialog, ConfirmDeleteDialog } from '@/src/components/ui';
import { Plus } from 'lucide-react';
import { ClassForm } from './ClassForm';
import { Class, ClassFormData } from '@/src/types/class';


export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([
    { id: '1', name: 'Math 101', studentsCount: 25, teacher: 'John Doe', maxStudents: 30, schedule: 'Mon, Wed, Fri 9:00 AM' },
    { id: '2', name: 'Science 201', studentsCount: 20, teacher: 'Jane Smith', maxStudents: 25, schedule: 'Tue, Thu 10:30 AM' },
    { id: '3', name: 'History 150', studentsCount: 30, teacher: 'Robert Johnson', maxStudents: 35, schedule: 'Mon, Wed 1:00 PM' },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);

  const handleAddNew = () => {
    setSelectedClass(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsDialogOpen(true);
  };

  const handleDelete = (classItem: Class) => {
    setClassToDelete(classItem);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (classToDelete) {
      setClasses(classes.filter(c => c.id !== classToDelete.id));
      setIsDeleteDialogOpen(false);
      setClassToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setClassToDelete(null);
  };

  const handleSubmit = async (formData: ClassFormData) => {
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API

    if (formData.id) {
      // Update existing class
      setClasses(classes.map(c =>
        c.id === formData.id
          ? { ...formData, studentsCount: c.studentsCount } as Class
          : c
      ));
    } else {
      // Add new class
      const newClass: Class = {
        ...formData,
        id: Date.now().toString(),
        studentsCount: 0,
      };
      setClasses([...classes, newClass]);
    }

    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  const columns = [
    {
      header: 'Class Name',
      accessor: (item: Class) => item.name,
    },
    {
      header: 'Teacher',
      accessor: (item: Class) => item.teacher,
    },
    {
      header: 'Students',
      accessor: (item: Class) => `${item.studentsCount} / ${item.maxStudents}`,
      className: 'text-center',
    },
    {
      header: 'Schedule',
      accessor: (item: Class) => item.schedule,
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
        />
      </div>

      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => !isSubmitting && setIsDialogOpen(false)}
        title={selectedClass ? 'Edit Class' : 'Add New Class'}
        maxWidth="lg"
      >
        <ClassForm
          initialData={selectedClass || undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </HeadlessDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={classToDelete?.name}
      />
    </div>
  );
}