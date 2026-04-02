'use client';

import { useState } from 'react';
import { Button, HeadlessDialog, ConfirmDeleteDialog } from '@/src/components/ui';
import { 
  Plus, 
  Users, 
  Map as MapIcon, 
  Calendar, 
  MoreVertical, 
  Edit2, 
  Trash2,
  Clock,
  User as UserIcon,
  GraduationCap
} from 'lucide-react';
import { ClassForm } from './ClassForm';
import { Class, ClassFormData } from '@/src/types/class';
import { cn } from '@/src/lib/utils';


import { useRouter } from 'next/navigation';

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([
    { 
      id: '1', 
      name: 'Math 101', 
      studentsCount: 25, 
      teacher: 'John Doe', 
      maxStudents: 30, 
      schedule: 'Mon, Wed, Fri 9:00 AM',
      adventuresCount: 12,
      createdAt: '2024-03-20'
    },
    { 
      id: '2', 
      name: 'Science 201', 
      studentsCount: 20, 
      teacher: 'Jane Smith', 
      maxStudents: 25, 
      schedule: 'Tue, Thu 10:30 AM',
      adventuresCount: 8,
      createdAt: '2024-03-22'
    },
    { 
      id: '3', 
      name: 'History 150', 
      studentsCount: 30, 
      teacher: 'Robert Johnson', 
      maxStudents: 35, 
      schedule: 'Mon, Wed 1:00 PM',
      adventuresCount: 15,
      createdAt: '2024-03-18'
    },
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
          ? { ...formData, studentsCount: c.studentsCount, adventuresCount: c.adventuresCount, createdAt: c.createdAt } as Class
          : c
      ));
    } else {
      // Add new class
      const newClass: Class = {
        ...formData,
        id: Date.now().toString(),
        studentsCount: 0,
        adventuresCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      } as Class;
      setClasses([...classes, newClass]);
    }

    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-8 min-h-[calc(100vh-80px)] bg-slate-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-indigo-700 bg-clip-text text-transparent">
            Classes Management
          </h1>
          <p className="text-slate-500 mt-1">Manage your nursery classes and student activities</p>
        </div>
        <Button onClick={handleAddNew} className="bg-gradient-to-r from-purple-600 to-indigo-600 border-none shadow-lg hover:shadow-indigo-200/50 transition-all duration-300">
          <Plus className="h-5 w-5 mr-2" />
          Create New Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {classes.length > 0 ? (
          classes.map((classItem) => (
            <div 
              key={classItem.id}
              className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-500 overflow-hidden"
            >
              {/* Card Header Pattern */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500" />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <GraduationCap className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{classItem.name}</h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                        <UserIcon className="h-3.5 w-3.5" />
                        <span>Teacher: {classItem.teacher}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(classItem)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(classItem)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div 
                    onClick={() => router.push(`/classes/${classItem.id}/students`)}
                    className="bg-slate-50 p-3 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
                      <Users className="h-3.5 w-3.5" />
                      Students
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      {classItem.studentsCount} <span className="text-slate-400 font-normal">/ {classItem.maxStudents}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
                      <MapIcon className="h-3.5 w-3.5" />
                      Adventures
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      {classItem.adventuresCount}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Clock className="h-4 w-4 text-slate-300" />
                    <span className="text-xs">Created: {classItem.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
            <GraduationCap className="h-16 w-16 text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">No classes found.</p>
            <Button onClick={handleAddNew} variant="ghost" className="mt-4">
              Add your first class
            </Button>
          </div>
        )}
      </div>

      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => !isSubmitting && setIsDialogOpen(false)}
        title={selectedClass ? 'Edit Class' : 'Create New Class'}
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