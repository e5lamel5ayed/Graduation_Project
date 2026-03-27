'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Button, HeadlessDialog, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui';
import Link from 'next/link';
import { AdventureCard, EmptyState } from '@/src/components/adventures';
import { Adventure } from '@/src/types/adventure';
import { adventureService } from '@/src/services/adventureService';
import { classService } from '@/src/services/classService';
import { Class } from '@/src/types/class';
import { toast } from 'sonner';

export default function AdventuresPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [assigningAdventureId, setAssigningAdventureId] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [assignmentStartDate, setAssignmentStartDate] = useState('');
  const [adventureToDelete, setAdventureToDelete] = useState<Adventure | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [adventureToChangeStatus, setAdventureToChangeStatus] = useState<Adventure | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [adventureToAssign, setAdventureToAssign] = useState<Adventure | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
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
  }, [searchTitle, status]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoadingClasses(true);
        const classesData = await classService.getAll();
        setClasses(classesData);
      } catch {
        toast.error('Failed to load classes');
      } finally {
        setIsLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

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

  const handleCloseAssignDialog = () => {
    if (assigningAdventureId) return;
    setIsAssignDialogOpen(false);
    setAdventureToAssign(null);
    setSelectedClassId('');
  };

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
            <h1 className="text-2xl font-black text-gray-900 leading-none mb-2">My Adventures</h1>
            <p className="text-gray-500 font-medium">Manage and monitor all your 7-day challenges</p>
          </div>
        </div>

        <Link href="/adventures/builder">
          <Button className="px-5 py-3 rounded-lg shadow-xl shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3 h-auto">
            <span className="text-base font-bold">Build Adventure</span>
          </Button>
        </Link>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-5 w-full">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Search by title..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

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
      ) : adventures.length > 0 ? (
        <div
          key={viewMode}
          className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200"
        >
          {viewMode === 'grid' ? (
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
                  className={`p-3 sm:p-4 ${index !== adventures.length - 1 ? 'border-b border-gray-100' : ''}`}
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
        <EmptyState />
      )}

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
    </div>
  );
}
