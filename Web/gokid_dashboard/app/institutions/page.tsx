'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Loader2, MapPin, Plus, Search, School, Users, Pencil, Trash2, Eye, Globe, Phone, Mail, CalendarDays, UserRound } from 'lucide-react';
import { Button, HeadlessDialog, Input, Pagination } from '@/src/components/ui';
import { InstitutionForm, InstitutionFormData } from './InstitutionForm';
import { useCreateInstitution, useDeleteInstitution, useInstitution, useInstitutions, useUpdateInstitution } from '@/src/hooks/useInstitutions';
import type { InstitutionDetails, InstitutionListItem } from '@/src/types/institution';

const PAGE_SIZE = 8;

const formatDate = (value?: string) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'N/A'
    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function InstitutionsPage() {
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState<InstitutionListItem | null>(null);

  const createMutation = useCreateInstitution();
  const updateMutation = useUpdateInstitution();
  const deleteMutation = useDeleteInstitution();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPageNumber(1);
      setSearch(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data: institutionsData, isLoading, error } = useInstitutions({
    pageNumber,
    pageSize: PAGE_SIZE,
    search: search || undefined,
  });

  const { data: selectedInstitution, isLoading: isLoadingSelectedInstitution } = useInstitution(selectedInstitutionId || '');

  const institutions = institutionsData?.items || [];
  const totalPages = institutionsData?.totalPages || 1;

  const initialFormData: InstitutionFormData | InstitutionDetails | null = selectedInstitution || null;

  const handleAddNew = () => {
    setSelectedInstitutionId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (institution: InstitutionListItem) => {
    setSelectedInstitutionId(institution.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (institution: InstitutionListItem) => {
    setInstitutionToDelete(institution);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (formData: InstitutionFormData) => {
    if (selectedInstitutionId) {
      await updateMutation.mutateAsync({
        id: selectedInstitutionId,
        data: {
          Name: formData.name,
          PhoneNumber: formData.phoneNumber,
          Address: formData.address,
          City: formData.city,
          Country: formData.country,
          Website: formData.website,
          Description: formData.description,
          Logo: formData.logoFile ?? undefined,
        },
      });
    } else {
      await createMutation.mutateAsync({
        Name: formData.name,
        AdminFullName: formData.adminFullName || '',
        AdminEmail: formData.adminEmail || '',
        PhoneNumber: formData.phoneNumber,
        Address: formData.address,
        City: formData.city,
        Country: formData.country,
        Website: formData.website,
        Description: formData.description,
        Logo: formData.logoFile ?? undefined,
      });
    }

    setIsDialogOpen(false);
    setSelectedInstitutionId(null);
  };

  const handleConfirmDelete = async () => {
    if (!institutionToDelete) return;

    await deleteMutation.mutateAsync(institutionToDelete.id);
    setIsDeleteDialogOpen(false);
    setInstitutionToDelete(null);
  };

  const cardMetric = (icon: React.ReactNode, label: string, value: string | number, toneClassName: string) => (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-xl ${toneClassName}`}>{icon}</span>
        {label}
      </div>
      <div className="text-lg font-black text-slate-900">{value}</div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-white to-purple-50/30 p-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
            <Building2 className="h-3.5 w-3.5" />
            Platform Admin
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Institutions</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Create, review, update, and open the detailed profile for every institution in the platform.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-80">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, code, city, or country"
              leftIcon={<Search />}
            />
          </div>
          <Button onClick={handleAddNew} className="h-14 gap-2 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 px-6 shadow-lg shadow-purple-200/60 transition-transform hover:scale-[1.01]">
            <Plus className="h-5 w-5" />
            Add Institution
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
          Failed to load institutions.
        </div>
      ) : isLoading ? (
        <div className="flex min-h-80 items-center justify-center">
          <Loader2 className="h-9 w-9 animate-spin text-purple-600" />
        </div>
      ) : institutions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Building2 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No institutions found</h3>
          <p className="mt-2 text-sm text-slate-500">Add the first institution to get the platform organized.</p>
          <Button onClick={handleAddNew} className="mt-6">
            <Plus className="h-4 w-4 mr-2" />
            Add Institution
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {institutions.map((institution) => (
              <div
                key={institution.id}
                className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-100/50"
              >
                <div className="h-2 bg-linear-to-r from-purple-500 via-indigo-500 to-cyan-500" />
                <div className="p-6">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
                        {institution.logoUrl ? (
                          <img src={institution.logoUrl} alt={institution.name} className="h-full w-full object-cover" />
                        ) : (
                          <Building2 className="h-8 w-8 text-slate-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-xl font-black text-slate-900">{institution.name}</h2>
                          {institution.code ? (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                              {institution.code}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-purple-500" />
                            {institution.city || 'N/A'}, {institution.country || 'N/A'}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-purple-500" />
                            {formatDate(institution.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-100 transition group-hover:opacity-100">
                      <button
                        onClick={() => router.push(`/institutions/${institution.id}`)}
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-purple-50 hover:text-purple-600"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(institution)}
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(institution)}
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {cardMetric(<School className="h-4 w-4" />, 'Classes', institution.classCount, 'bg-purple-50 text-purple-600')}
                    {cardMetric(<Users className="h-4 w-4" />, 'Students', institution.studentCount, 'bg-cyan-50 text-cyan-600')}
                    {cardMetric(<UserRound className="h-4 w-4" />, 'Supervisors', institution.supervisorCount, 'bg-indigo-50 text-indigo-600')}
                  </div>

                  <div className="mt-5 grid gap-3 rounded-3xl bg-slate-50/80 p-4 sm:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4 text-purple-500" />
                      <span className="truncate">{institution.adminName || institution.adminEmail || 'Admin not available'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4 text-purple-500" />
                      <span className="truncate">{institution.adminEmail || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Globe className="h-4 w-4 text-purple-500" />
                      <span className="truncate">{institution.code || 'Institution profile'}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="text-sm text-slate-500">
                      {institution.adminName ? (
                        <>
                          Managed by <span className="font-semibold text-slate-800">{institution.adminName}</span>
                        </>
                      ) : (
                        'Institution admin details available in the profile page.'
                      )}
                    </div>
                    <Link href={`/institutions/${institution.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700">
                      View Details
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={pageNumber}
            totalPages={totalPages}
            onPageChange={setPageNumber}
            className="mt-6"
          />
        </>
      )}

      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => !createMutation.isPending && !updateMutation.isPending && setIsDialogOpen(false)}
        title={selectedInstitutionId ? 'Edit Institution' : 'Add Institution'}
        maxWidth="3xl"
      >
        {selectedInstitutionId && isLoadingSelectedInstitution ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
          </div>
        ) : (
          <InstitutionForm
            key={selectedInstitutionId || 'create'}
            initialData={initialFormData || undefined}
            mode={selectedInstitutionId ? 'edit' : 'create'}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </HeadlessDialog>

      <HeadlessDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => !deleteMutation.isPending && setIsDeleteDialogOpen(false)}
        title="Delete Institution"
        maxWidth="sm"
      >
        <div className="space-y-5">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-900">{institutionToDelete?.name || 'this institution'}</span>? This will lock the associated admin account.
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