'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { 
  LayoutGrid, 
  List,
  Search,
  Loader2,
  Calendar,
  Trash2,
  ChevronRight,
  Compass,
  School,
  Users,
} from 'lucide-react';
import { Button, HeadlessDialog, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdventureCard, EmptyState } from '@/src/components/adventures';
import { Adventure, SupervisorAdventure, SupervisorAdventureClass } from '@/src/types/adventure';
import { adventureService } from '@/src/services/adventureService';
import { classService } from '@/src/services/classService';
import { ClassApiItem } from '@/src/types/class';
import { toast } from 'sonner';

export default function AdventuresPage() {
  const { user } = useAuth();
  const isSupervisor = user?.role === 'supervisor';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [supervisorAdventures, setSupervisorAdventures] = useState<SupervisorAdventure[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [assigningAdventureId, setAssigningAdventureId] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassApiItem[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [assignmentStartDate, setAssignmentStartDate] = useState('');
  const [adventureToDelete, setAdventureToDelete] = useState<Adventure | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [adventureToChangeStatus, setAdventureToChangeStatus] = useState<Adventure | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [adventureToAssign, setAdventureToAssign] = useState<Adventure | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [adventureClasses, setAdventureClasses] = useState<SupervisorAdventureClass[]>([]);
  const [isClassesDialogOpen, setIsClassesDialogOpen] = useState(false);
  const [selectedAdventureClassesTitle, setSelectedAdventureClassesTitle] = useState('');
  const [isLoadingAdventureClasses, setIsLoadingAdventureClasses] = useState(false);
  const [selectedWeeklyAdventureId, setSelectedWeeklyAdventureId] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isSupervisor) {
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsLoading(true);
        const data = await adventureService.getAll({ searchTitle, status });
        setAdventures(data);
      } catch (error) {
        console.error('Failed to load adventures', error);
        toast.error('Failed to load adventures');
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchTitle, status, isSupervisor]);

  useEffect(() => {
    if (!isSupervisor) {
      return;
    }

    const fetchSupervisorAdventures = async () => {
      try {
        setIsLoading(true);
        const data = await adventureService.getSupervisorAdventures();
        setSupervisorAdventures(data);
      } catch (error) {
        console.error('Failed to load supervisor adventures', error);
        toast.error('Failed to load adventures');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupervisorAdventures();
  }, [isSupervisor]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoadingClasses(true);
        let classesData;
        
        if (user?.role === 'supervisor') {
          classesData = await classService.getAllForSupervisor();
        } else {
          classesData = await classService.getAll();
        }
        
        setClasses(classesData.items || []);
      } catch {
        toast.error('Failed to load classes');
      } finally {
        setIsLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [user?.role]);

  const handleDeleteAdventure = (adventureId: string) => {
    const selectedAdventure = adventures.find((adventure) => adventure.id === adventureId) || null;
    setAdventureToDelete(selectedAdventure);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!adventureToDelete) return;

    try {
      setDeletingId(adventureToDelete.id);
      await adventureService.delete(adventureToDelete.id);
      setAdventures((prev) => prev.filter((adventure) => adventure.id !== adventureToDelete.id));
      toast.success('Adventure deleted successfully');
      setIsDeleteDialogOpen(false);
      setAdventureToDelete(null);
    } catch {
      toast.error('Failed to delete adventure');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    if (deletingId) return;
    setIsDeleteDialogOpen(false);
    setAdventureToDelete(null);
  };

  const handleToggleStatus = (adventure: Adventure) => {
    setAdventureToChangeStatus(adventure);
    setIsStatusDialogOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!adventureToChangeStatus) return;
    const nextStatus = adventureToChangeStatus.status === 'Active' ? 'Inactive' : 'Active';

    try {
      setStatusUpdatingId(adventureToChangeStatus.id);
      const updated = await adventureService.updateStatus(adventureToChangeStatus.id, nextStatus);
      const appliedStatus = updated.status || nextStatus;

      setAdventures((prev) =>
        prev.map((item) =>
          item.id === adventureToChangeStatus.id
            ? {
                ...item,
                status: appliedStatus,
                category: appliedStatus,
              }
            : item
        )
      );

      toast.success(`Adventure status changed to ${appliedStatus}`);
      setIsStatusDialogOpen(false);
      setAdventureToChangeStatus(null);
    } catch {
      toast.error('Failed to update adventure status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleCancelStatusChange = () => {
    if (statusUpdatingId) return;
    setIsStatusDialogOpen(false);
    setAdventureToChangeStatus(null);
  };

  const handleOpenAssignDialog = (adventure: Adventure) => {
    setAdventureToAssign(adventure);
    setSelectedClassId('');
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    setAssignmentStartDate(new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16));
    setIsAssignDialogOpen(true);
  };

  const handleOpenClassesDialog = async (adventure: SupervisorAdventure) => {
    try {
      setSelectedAdventureClassesTitle(adventure.title);
      setSelectedWeeklyAdventureId(adventure.weeklyAdventureId);
      setIsClassesDialogOpen(true);
      setIsLoadingAdventureClasses(true);
      const classesData = await adventureService.getSupervisorAdventureClasses(adventure.weeklyAdventureId);
      setAdventureClasses(classesData);
    } catch (error) {
      console.error('Failed to load adventure classes', error);
      toast.error('Failed to load classes');
      setAdventureClasses([]);
    } finally {
      setIsLoadingAdventureClasses(false);
    }
  };

  const handleCloseClassesDialog = () => {
    setIsClassesDialogOpen(false);
    setAdventureClasses([]);
    setSelectedAdventureClassesTitle('');
    setSelectedWeeklyAdventureId('');
  };

  const handleCloseAssignDialog = () => {
    if (assigningAdventureId) return;
    setIsAssignDialogOpen(false);
    setAdventureToAssign(null);
    setSelectedClassId('');
  };

  const filteredSupervisorAdventures = supervisorAdventures.filter((adventure) => {
    const query = searchTitle.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [adventure.title, adventure.className, adventure.titleEn, adventure.titleAr]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  const visibleAdventures = isSupervisor ? filteredSupervisorAdventures : adventures;

  const handleConfirmAssign = async () => {
    if (!adventureToAssign) return;

    if (!selectedClassId) {
      toast.error('Please select a class first');
      return;
    }

    if (!assignmentStartDate) {
      toast.error('Please choose a start date');
      return;
    }

    try {
      setAssigningAdventureId(adventureToAssign.id);
      await adventureService.assignToClass({
        adventureId: adventureToAssign.id,
        classId: selectedClassId,
        startDate: new Date(assignmentStartDate).toISOString(),
      });

      toast.success('Adventure assigned to class successfully');
      setIsAssignDialogOpen(false);
      setAdventureToAssign(null);
      setSelectedClassId('');
    } catch {
      toast.error('Failed to assign adventure to class');
    } finally {
      setAssigningAdventureId(null);
    }
  };

  return (
    <div className="p-3 sm:p-8 bg-gray-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-5">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-none mb-2">
              {isSupervisor ? 'Supervisor Adventures' : 'My Adventures'}
            </h1>
            <p className="text-gray-500 font-medium">
              {isSupervisor
                ? 'Weekly adventures assigned to your classes'
                : 'Manage and monitor all your 7-day challenges'}
            </p>
          </div>
        </div>

        {!isSupervisor && (
          <Link href="/adventures/builder">
            <Button className="px-5 py-3 rounded-lg shadow-xl shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3 h-auto">
              <span className="text-base font-bold">Build Adventure</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-5 w-full">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder={isSupervisor ? 'Search by title or class...' : 'Search by title...'}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {!isSupervisor && (
          <div className="w-full lg:w-56">
            <Select value={status} onValueChange={(value) => setStatus(value === 'all' ? '' : value)}>
              <SelectTrigger className="h-10 rounded-xl border-gray-200 bg-white text-sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex bg-gray-100 p-1 rounded-xl flex-1 lg:flex-none">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex-1 lg:px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="text-xs font-bold">Grid</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex-1 lg:px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="h-4 w-4" />
            <span className="text-xs font-bold">List</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="h-56 flex items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
        </div>
      ) : visibleAdventures.length > 0 ? (
        <div
          key={viewMode}
          className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200"
        >
          {isSupervisor ? (
            viewMode === 'grid' ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {filteredSupervisorAdventures.map((adventure) => (
                  <div key={adventure.weeklyAdventureId} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-sky-200 flex flex-col h-full">
                    <div className="p-5 flex flex-col gap-4 h-full">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-sky-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-200 text-white">
                          <Compass className="h-6 w-6" />
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-lg">
                          {adventure.className || 'Unassigned Class'}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-1">
                          {adventure.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {adventure.titleAr || adventure.titleEn}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Start</p>
                          <p className="text-sm font-bold text-gray-800">{new Date(adventure.startDate).toLocaleDateString()}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">End</p>
                          <p className="text-sm font-bold text-gray-800">{new Date(adventure.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenClassesDialog(adventure)}
                          className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-left hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-2 text-emerald-700 mb-1">
                            <Users className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Children</span>
                          </div>
                          <p className="text-lg font-black text-emerald-900">{adventure.totalChildren}</p>
                        </button>
                        <Link
                          href={`/adventures/reviews/${adventure.weeklyAdventureId}`}
                          className="rounded-xl bg-amber-50 border border-amber-100 p-3 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex items-center gap-2 text-amber-700 mb-1">
                            <School className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Reviews</span>
                          </div>
                          <p className="text-lg font-black text-amber-900">{adventure.pendingReviewsCount}</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {filteredSupervisorAdventures.map((adventure, index) => (
                  <div
                    key={adventure.weeklyAdventureId}
                    className={`p-3 sm:p-4 ${index !== visibleAdventures.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="w-full grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                      <div className="sm:col-span-1">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br from-sky-500 to-cyan-500 flex items-center justify-center shadow-md shadow-sky-200 text-white">
                          <Compass className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="min-w-0 sm:col-span-4">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">{adventure.title}</h3>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{adventure.className}</p>
                      </div>

                      <div className="sm:col-span-3 text-[11px] text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {new Date(adventure.startDate).toLocaleDateString()} - {new Date(adventure.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-1 text-gray-500 font-semibold">{adventure.totalChildren} children</div>
                      </div>

                      <div className="sm:col-span-2 text-[11px] text-gray-400 sm:text-right">
                        <div className="text-gray-500 font-semibold">{adventure.pendingReviewsCount} pending reviews</div>
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-start sm:justify-end">
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-sky-700">
                          <School className="h-3.5 w-3.5" />
                          Weekly Adventure
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : viewMode === 'grid' ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {adventures.map(adventure => (
                <AdventureCard
                  key={adventure.id}
                  adventure={adventure}
                  onDelete={handleDeleteAdventure}
                  isDeleting={deletingId === adventure.id}
                  onToggleStatus={handleToggleStatus}
                  isStatusUpdating={statusUpdatingId === adventure.id}
                  onAssign={handleOpenAssignDialog}
                  isAssigning={assigningAdventureId === adventure.id}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {adventures.map((adventure, index) => (
                <div
                  key={adventure.id}
                  className={`p-3 sm:p-4 ${index !== visibleAdventures.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="w-full grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                    <div className="sm:col-span-1">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-200 text-white">
                        <Compass className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="min-w-0 sm:col-span-5">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">{adventure.title}</h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{adventure.description}</p>
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        disabled={statusUpdatingId === adventure.id}
                        onClick={() => handleToggleStatus(adventure)}
                        className={`inline-flex text-[10px] font-black uppercase px-2.5 py-1 rounded-md border transition-all duration-200 hover:scale-[1.03] disabled:opacity-50 ${
                          adventure.status === 'Active'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        {statusUpdatingId === adventure.id ? 'Updating...' : adventure.status || 'Unknown'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAssignDialog(adventure)}
                        disabled={assigningAdventureId === adventure.id}
                        className="h-8 px-2.5 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 text-[10px] font-black uppercase inline-flex items-center gap-1 hover:bg-sky-100 transition-colors disabled:opacity-50"
                      >
                        <School className="h-3.5 w-3.5" />
                        {assigningAdventureId === adventure.id ? 'Assigning...' : 'Assign'}
                      </button>
                    </div>

                    <div className="sm:col-span-2 text-[11px] text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(adventure.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-1 text-gray-500 font-semibold">{adventure.taskCount} tasks</div>
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-2 sm:justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteAdventure(adventure.id)}
                        disabled={deletingId === adventure.id}
                        className="h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
                        aria-label="Delete adventure"
                      >
                        <Trash2 className="h-4 w-4 mx-auto" />
                      </button>

                      <Link
                        href={`/adventures/builder?id=${adventure.id}`}
                        className="h-8 px-3 rounded-lg bg-gray-900 text-white text-xs font-bold inline-flex items-center gap-1 hover:bg-purple-600 transition-colors"
                      >
                        Edit <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        isSupervisor ? (
          <div className="text-center py-24 bg-white rounded-2xl border-4 border-dashed border-gray-100">
            <div className="bg-sky-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Compass className="h-10 w-10 text-sky-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No Supervisor Adventures</h3>
            <p className="text-gray-500 max-w-sm mx-auto font-medium">
              There are no weekly adventures assigned to your classes yet.
            </p>
          </div>
        ) : (
          <EmptyState />
        )
      )}

      <HeadlessDialog
        isOpen={isClassesDialogOpen}
        onClose={handleCloseClassesDialog}
        title="Adventure Classes"
        maxWidth="lg"
      >
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
            <p className="text-xs font-semibold text-sky-700">Selected Adventure</p>
            <p className="text-sm font-bold text-sky-900 mt-1 truncate">
              {selectedAdventureClassesTitle || '-'}
            </p>
          </div>

          {isLoadingAdventureClasses ? (
            <div className="py-10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
            </div>
          ) : adventureClasses.length > 0 ? (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {adventureClasses.map((classItem) => (
                <div
                  key={classItem.classId}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.push(`/adventures/${selectedWeeklyAdventureId}/classes/${classItem.classId}/children`);
                    }
                  }}
                  onClick={() => {
                    router.push(`/adventures/${selectedWeeklyAdventureId}/classes/${classItem.classId}/children`);
                  }}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transform-gpu transition-transform"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{classItem.className}</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      {classItem.childrenCount} children
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-500">
                    <div>
                      <p className="font-semibold text-gray-400 mb-0.5">Start Date</p>
                      <p className="font-bold text-gray-700">{new Date(classItem.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-400 mb-0.5">End Date</p>
                      <p className="font-bold text-gray-700">{new Date(classItem.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 rounded-xl border border-dashed border-gray-200 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700">No classes found for this adventure.</p>
            </div>
          )}
        </div>
      </HeadlessDialog>

      {!isSupervisor && (
        <>
          <HeadlessDialog
            isOpen={isDeleteDialogOpen}
            onClose={handleCancelDelete}
            title="Confirm Delete"
            maxWidth="sm"
          >
            <div className="mt-4">
              <p className="text-gray-700">
                {adventureToDelete
                  ? `Are you sure you want to delete "${adventureToDelete.title}"?`
                  : 'Are you sure you want to delete this adventure?'}
              </p>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  onClick={handleConfirmDelete}
                  isLoading={Boolean(deletingId)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelDelete}
                  disabled={Boolean(deletingId)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </HeadlessDialog>

          <HeadlessDialog
            isOpen={isStatusDialogOpen}
            onClose={handleCancelStatusChange}
            title="Confirm Status Change"
            maxWidth="sm"
          >
            <div className="mt-4">
              <p className="text-gray-700">
                {adventureToChangeStatus
                  ? `Change status for "${adventureToChangeStatus.title}" to ${adventureToChangeStatus.status === 'Active' ? 'Inactive' : 'Active'}?`
                  : 'Are you sure you want to change adventure status?'}
              </p>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  onClick={handleConfirmStatusChange}
                  isLoading={Boolean(statusUpdatingId)}
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelStatusChange}
                  disabled={Boolean(statusUpdatingId)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </HeadlessDialog>

          <HeadlessDialog
            isOpen={isAssignDialogOpen}
            onClose={handleCloseAssignDialog}
            title="Assign Adventure To Class"
            maxWidth="md"
          >
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
                <p className="text-xs font-semibold text-sky-700">Selected Adventure</p>
                <p className="text-sm font-bold text-sky-900 mt-1 truncate">{adventureToAssign?.title || '-'}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Class</label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger className="h-11 rounded-xl border-gray-200">
                    <SelectValue placeholder={isLoadingClasses ? 'Loading classes...' : 'Select class'} />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="assignmentStartDate" className="text-xs font-bold uppercase tracking-wider text-gray-500">Start Date</label>
                <input
                  id="assignmentStartDate"
                  title="Assignment start date"
                  type="datetime-local"
                  value={assignmentStartDate}
                  onChange={(e) => setAssignmentStartDate(e.target.value)}
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleCloseAssignDialog}
                  disabled={Boolean(assigningAdventureId)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmAssign}
                  isLoading={Boolean(assigningAdventureId)}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  Assign To Class
                </Button>
              </div>
            </div>
          </HeadlessDialog>
        </>
      )}
    </div>
  );
}
