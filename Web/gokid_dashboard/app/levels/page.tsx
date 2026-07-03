'use client';

import { useMemo, useState } from 'react';
import { Award, CalendarDays, Hash, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Button, HeadlessDialog, Input } from '@/src/components/ui';
import { LevelForm, LevelFormData } from './LevelForm';
import {
  useCreateLevel,
  useDeleteLevel,
  useLevel,
  useLevels,
  useUpdateLevel,
} from '@/src/hooks/useLevels';
import type { Level } from '@/src/types/level';

const formatDate = (value?: string) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'N/A'
    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function LevelsPage() {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<Level | null>(null);

  const createMutation = useCreateLevel();
  const updateMutation = useUpdateLevel();
  const deleteMutation = useDeleteLevel();

  const { data: levels = [], isLoading, error } = useLevels();
  const { data: selectedLevel, isLoading: isLoadingSelectedLevel } = useLevel(selectedLevelId || '');

  const filteredLevels = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return levels;

    return levels.filter((level) => {
      const name = level.name?.toLowerCase() || '';
      return (
        name.includes(keyword)
        || String(level.order).includes(keyword)
        || String(level.minPoints).includes(keyword)
      );
    });
  }, [levels, search]);

  const handleAddNew = () => {
    setSelectedLevelId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (level: Level) => {
    setSelectedLevelId(level.id || null);
    setIsDialogOpen(true);
  };

  const handleDelete = (level: Level) => {
    setLevelToDelete(level);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (formData: LevelFormData) => {
    if (selectedLevelId) {
      await updateMutation.mutateAsync({
        id: selectedLevelId,
        data: {
          Name: formData.name,
          Order: formData.order,
          MinPoints: formData.minPoints,
          Badge: formData.badgeFile ?? undefined,
        },
      });
    } else {
      await createMutation.mutateAsync({
        Name: formData.name,
        Order: formData.order,
        MinPoints: formData.minPoints,
        Badge: formData.badgeFile ?? undefined,
      });
    }

    setIsDialogOpen(false);
    setSelectedLevelId(null);
  };

  const handleConfirmDelete = async () => {
    if (!levelToDelete?.id) return;

    await deleteMutation.mutateAsync(levelToDelete.id);
    setIsDeleteDialogOpen(false);
    setLevelToDelete(null);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-linear-to-br from-slate-50 via-white to-cyan-50/40 p-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
            <Award className="h-3.5 w-3.5" />
            Platform Admin
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Levels</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage the progression levels that children can unlock as they gain points.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-80">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by level name, order, or points"
              leftIcon={<Search />}
            />
          </div>
          <Button onClick={handleAddNew} className="h-14 gap-2 rounded-2xl bg-linear-to-r px-6 transition-transform hover:scale-[1.01]">
            <Plus className="h-5 w-5" />
            Add Level
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
          Failed to load levels.
        </div>
      ) : isLoading ? (
        <div className="flex min-h-80 items-center justify-center">
          <Loader2 className="h-9 w-9 animate-spin text-cyan-600" />
        </div>
      ) : filteredLevels.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <Award className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No levels found</h3>
          <p className="mt-2 text-sm text-slate-500">Add the first level to define progression milestones.</p>
          <Button onClick={handleAddNew} className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            Add Level
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredLevels.map((level) => (
            <div
              key={level.id}
              className="group overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-100/50"
            >
              <div className="h-2 bg-linear-to-r from-cyan-500 via-sky-500 to-blue-500" />
              <div className="p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
                      {level.badgeUrl ? (
                        <img src={level.badgeUrl} alt={level.name || 'Level badge'} className="h-full w-full object-cover" />
                      ) : (
                        <Award className="h-8 w-8 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-xl font-black text-slate-900">{level.name || 'Unnamed level'}</h2>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-cyan-500" />
                          {formatDate(level.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-100">
                    <button
                      onClick={() => handleEdit(level)}
                      className="rounded-xl p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(level)}
                      className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <Hash className="h-4 w-4" />
                      </span>
                      Order
                    </div>
                    <div className="text-lg font-black text-slate-900">{level.order}</div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <Award className="h-4 w-4" />
                      </span>
                      Min Points
                    </div>
                    <div className="text-lg font-black text-slate-900">{level.minPoints}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => !createMutation.isPending && !updateMutation.isPending && setIsDialogOpen(false)}
        title={selectedLevelId ? 'Edit Level' : 'Add Level'}
        maxWidth="xl"
      >
        {selectedLevelId && isLoadingSelectedLevel ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-cyan-600" />
          </div>
        ) : (
          <LevelForm
            key={selectedLevelId || 'create'}
            initialData={selectedLevel || undefined}
            mode={selectedLevelId ? 'edit' : 'create'}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </HeadlessDialog>

      <HeadlessDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => !deleteMutation.isPending && setIsDeleteDialogOpen(false)}
        title="Delete Level"
        maxWidth="sm"
      >
        <div className="space-y-5">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-900">{levelToDelete?.name || 'this level'}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} isLoading={deleteMutation.isPending} className="bg-rose-600 hover:bg-rose-700">
              Delete
            </Button>
          </div>
        </div>
      </HeadlessDialog>
    </div>
  );
}
