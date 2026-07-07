'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import {
  Button,
  HeadlessDialog,
  ConfirmDeleteDialog,
  Input,
  Pagination,
} from '@/src/components/ui';
import { 
  Plus, 
  Users, 
  Map as MapIcon, 
  Calendar, 
  Edit2, 
  Trash2,
  Clock,
  User as UserIcon,
  GraduationCap,
  Search,
  Loader2,
  UserPlus,
  UserMinus,
  BadgeCheck,
  Circle,
} from 'lucide-react';
import { ClassForm } from './ClassForm';
import { ClassApiItem, ClassCardItem, ClassFormData } from '@/src/types/class';
import { useRouter } from 'next/navigation';
import {
  useAssignSupervisor,
  useClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  useUnassignSupervisor,
} from '@/src/hooks/useClasses';
import { useQuery } from '@tanstack/react-query';
import { supervisorService } from '@/src/services/supervisorService';

const PAGE_SIZE = 8;

const mapApiClassToCard = (classItem: ClassApiItem): ClassCardItem => ({
  id: classItem.id,
  name: classItem.name,
  teacher: 'TBD',
  maxStudents: 30,
  schedule: 'TBD',
  childrenCount: classItem.childrenCount,
  activeAdventuresCount: classItem.activeAdventuresCount ?? 0,
  createdAt: (() => {
    const createdAt = new Date(classItem.createdAt);
    return Number.isNaN(createdAt.getTime()) ? '' : createdAt.toISOString().split('T')[0];
  })(),
});

export default function ClassesPage() {
  const { user } = useAuth();
  const isSupervisor = user?.role === 'supervisor';
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassCardItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassCardItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [classToAssign, setClassToAssign] = useState<ClassCardItem | null>(null);

  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();
  const deleteMutation = useDeleteClass();
  const assignSupervisorMutation = useAssignSupervisor();
  const unassignSupervisorMutation = useUnassignSupervisor();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentPage(1);
      setSearchName(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data: classData, isLoading, error } = useClasses({
    pageNumber: currentPage,
    pageSize: PAGE_SIZE,
    SearchName: searchName || undefined,
  }, isSupervisor);

  const apiClasses = useMemo(
    () => {
      if (user?.role === 'supervisor') {
        return ((classData || []) as ClassApiItem[]).map(mapApiClassToCard);
      }

      return ((classData as { items?: ClassApiItem[] } | undefined)?.items || []).map(mapApiClassToCard);
    },
    [classData, user?.role]
  );

  const {
    data: supervisors = [],
    isLoading: isSupervisorsLoading,
    error: supervisorsError,
    refetch: refetchSupervisors,
  } = useQuery({
    queryKey: ['InstitutionSupervisor', classToAssign?.id || 'all'],
    queryFn: () => supervisorService.getAll(classToAssign?.id),
    enabled: isAssignDialogOpen && !!classToAssign?.id,
  });

  const classes = apiClasses;

  const handleAddNew = () => {
    setSelectedClass(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (classItem: ClassCardItem) => {
    setSelectedClass(classItem);
    setIsDialogOpen(true);
  };

  const handleDelete = (classItem: ClassCardItem) => {
    setClassToDelete(classItem);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenAssignDialog = (classItem: ClassCardItem) => {
    setClassToAssign(classItem);
    setIsAssignDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (classToDelete) {
      await deleteMutation.mutateAsync(classToDelete.id);
      setIsDeleteDialogOpen(false);
      setClassToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setClassToDelete(null);
  };

  const handleAssignSupervisorRow = async (supervisorId: string) => {
    if (!classToAssign) return;

    await assignSupervisorMutation.mutateAsync({
      classId: classToAssign.id,
      data: {
        supervisorId,
      },
    });

    await refetchSupervisors();
  };

  const handleUnassignSupervisorRow = async (supervisorId: string) => {
    if (!classToAssign) return;

    await unassignSupervisorMutation.mutateAsync({
      classId: classToAssign.id,
      supervisorId,
    });

    await refetchSupervisors();
  };

  const handleCloseAssignDialog = () => {
    if (isAssigningSupervisor) return;
    setIsAssignDialogOpen(false);
    setClassToAssign(null);
  };

  const handleSubmit = async (formData: ClassFormData) => {
    try {
      if (formData.id) {
        await updateMutation.mutateAsync({
          classId: formData.id,
          data: { name: formData.name },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
        });
      }
      setIsDialogOpen(false);
      setSelectedClass(null);
    } catch {
      // Error is handled by mutation toast
    }
  };

  const totalPages = classData?.totalPages || (classData?.totalCount ? Math.ceil(classData.totalCount / PAGE_SIZE) : 1);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isAssigningSupervisor = assignSupervisorMutation.isPending || unassignSupervisorMutation.isPending;

  return (
    <div className="p-8 min-h-[calc(100vh-80px)] bg-slate-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none mb-2 bg-clip-text">
            Classes Management
          </h1>
          <p className="text-slate-500 mt-1">Manage your nursery classes and student activities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="w-full sm:w-72">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search..."
              leftIcon={<Search />}
              className="h-12"
            />
          </div>
          {!isSupervisor ? (
            <Button onClick={handleAddNew} className="bg-linear-to-r from-purple-600 to-indigo-600 border-none shadow-lg hover:shadow-indigo-200/50 transition-all duration-300">
              <Plus className="h-5 w-5 mr-2" />
              Create New Class
            </Button>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-80">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          Failed to load classes.
        </div>
      ) : (
        <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {classes.length > 0 ? (
          classes.map((classItem, index) => (
            <div 
              key={`${classItem.id || 'class'}-${index}`}
              className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-500 overflow-hidden"
            >
              {/* Card Header Pattern */}
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-purple-500 to-indigo-500" />
              
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

                  {!isSupervisor ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenAssignDialog(classItem)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
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
                  ) : null}
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
                      {classItem.childrenCount} <span className="text-slate-400 font-normal">/ {classItem.maxStudents}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
                      <MapIcon className="h-3.5 w-3.5" />
                      Adventures
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      {classItem.activeAdventuresCount}
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
           
          </div>
        )}
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

      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => !isSubmitting && setIsDialogOpen(false)}
        title={selectedClass ? 'Edit Class' : 'Create New Class'}
        maxWidth="lg"
      >
        <ClassForm
          initialData={selectedClass ?? undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </HeadlessDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={classToDelete?.name}
        isLoading={deleteMutation.isPending}
      />

      <HeadlessDialog
        isOpen={isAssignDialogOpen}
        onClose={handleCloseAssignDialog}
        title="Manage Supervisors"
        maxWidth="lg"
      >
        <div className="space-y-5">
          <p className="text-sm text-slate-500">
            Manage supervisors for <span className="font-semibold text-slate-700">{classToAssign?.name}</span>
          </p>

          {isSupervisorsLoading ? (
            <div className="flex items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 py-10">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          ) : supervisorsError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              Failed to load supervisors.
            </div>
          ) : supervisors.length > 0 ? (
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {supervisors.map((supervisor) => {
                const isAssigned = !!supervisor.isAssignedToClass;

                return (
                  <div
                    key={supervisor.id}
                    className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50/80 px-4 py-3 transition-colors hover:bg-white"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={
                        `flex h-11 w-11 items-center justify-center rounded-2xl ${isAssigned ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`
                      }>
                        {isAssigned ? <BadgeCheck className="h-5 w-5" /> : <Circle className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-semibold text-slate-800">{supervisor.fullName}</p>
                          <span className={
                            `rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${isAssigned ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`
                          }>
                            {isAssigned ? 'Assigned' : 'Available'}
                          </span>
                        </div>
                        <p className="truncate text-sm text-slate-500">{supervisor.email}</p>
                      </div>
                    </div>

                    {isAssigned ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnassignSupervisorRow(supervisor.id)}
                        isLoading={unassignSupervisorMutation.isPending}
                        disabled={isAssigningSupervisor}
                      >
                        <UserMinus className="mr-2 h-4 w-4" />
                        Unassign
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAssignSupervisorRow(supervisor.id)}
                        isLoading={assignSupervisorMutation.isPending}
                        disabled={isAssigningSupervisor}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-500">
              No supervisors available.
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCloseAssignDialog} disabled={isAssigningSupervisor}>
              Close
            </Button>
          </div>
        </div>
      </HeadlessDialog>
    </div>
  );
}
