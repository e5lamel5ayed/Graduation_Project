'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, CalendarDays, Globe, Loader2, Mail, MapPin, Phone, School, Users, UserRound, User } from 'lucide-react';
import { Button, HeadlessDialog } from '@/src/components/ui';
import { useInstitution, useInstitutionSupervisorProfile } from '@/src/hooks/useInstitutions';

const formatDate = (value?: string) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'N/A'
    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function InstitutionDetailsPage() {
  const params = useParams<{ institutionId: string }>();
  const router = useRouter();
  const institutionId = params?.institutionId;
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string | null>(null);

  const { data: institution, isLoading, error } = useInstitution(institutionId || '');
  const {
    data: supervisorProfile,
    isLoading: isLoadingSupervisorProfile,
    error: supervisorProfileError,
  } = useInstitutionSupervisorProfile(
    institutionId || '',
    selectedSupervisorId || '',
    !!selectedSupervisorId,
  );

  const closeSupervisorDialog = () => {
    setSelectedSupervisorId(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !institution) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 p-8">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          Failed to load institution details.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-linear-to-br from-slate-50 via-white to-indigo-50/30 p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-purple-200 hover:text-purple-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-xl shadow-slate-100/70">
        <div className="h-2 bg-linear-to-r from-purple-500 via-indigo-500 to-cyan-500" />
        <div className="p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-5">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.75rem] border border-slate-100 bg-slate-50 shadow-sm">
                {institution.logoUrl ? (
                  <img src={institution.logoUrl} alt={institution.name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-10 w-10 text-slate-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900">{institution.name}</h1>
                  {institution.code ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                      {institution.code}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  {institution.description || 'No description was provided for this institution.'}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-purple-500" />
                    <span className="wrap-break-word">{institution.address || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-purple-500" />
                    <span>{institution.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4 text-purple-500" />
                    <span className="break-all">{institution.adminEmail || institution.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Globe className="h-4 w-4 text-purple-500" />
                    <span className="break-all">{institution.website || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-purple-100 bg-purple-50/60 p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-purple-500">Institution Admin</div>
                <div className="mt-2 text-lg font-black text-slate-900">{institution.adminName || 'N/A'}</div>
                <div className="mt-1 text-sm text-slate-600 break-all">{institution.adminEmail || 'N/A'}</div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Created At</div>
                <div className="mt-2 text-lg font-black text-slate-900">{formatDate(institution.createdAt)}</div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Class Count</div>
                <div className="mt-2 text-lg font-black text-slate-900">{institution.classCount}</div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Supervisor Count</div>
                <div className="mt-2 text-lg font-black text-slate-900">{institution.supervisorCount}</div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                <Users className="h-4 w-4 text-purple-500" />
                Supervisors
              </div>
              <div className="mt-4 space-y-3">
                {institution.supervisors && institution.supervisors.length > 0 ? (
                  institution.supervisors.map((supervisor) => (
                    <button
                      type="button"
                      key={supervisor.id || supervisor.email || supervisor.fullName}
                      onClick={() => supervisor.id && setSelectedSupervisorId(supervisor.id)}
                      disabled={!supervisor.id}
                      className="w-full rounded-2xl border border-white bg-white p-4 text-left shadow-sm transition hover:border-purple-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <div className="font-bold text-slate-900">{supervisor.fullName || 'Unnamed supervisor'}</div>
                      <div className="mt-1 text-sm text-slate-500 break-all">{supervisor.email || 'N/A'}</div>
                      <div className="mt-2 text-xs font-semibold text-purple-600">
                        {supervisor.assignedClassesCount} assigned classes
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
                    No supervisors are assigned yet.
                  </div>
                )}
              </div>
            </div>

            <div className="xl:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                <School className="h-4 w-4 text-purple-500" />
                Classes
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                {institution.classes && institution.classes.length > 0 ? (
                  institution.classes.map((classItem) => (
                    <div key={classItem.id || classItem.name} className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5 shadow-sm">
                      <div className="text-lg font-black text-slate-900">{classItem.name || 'Unnamed class'}</div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
                        <div className="rounded-2xl bg-white p-3">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Students</div>
                          <div className="mt-1 text-base font-bold text-slate-900">{classItem.childrenCount}</div>
                        </div>
                        <div className="rounded-2xl bg-white p-3">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Supervisors</div>
                          <div className="mt-1 text-base font-bold text-slate-900">{classItem.supervisorsCount}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5 text-purple-500" />
                        {formatDate(classItem.createdAt)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-sm text-slate-500">
                    No classes have been created yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <School className="h-4 w-4 text-purple-500" />
                Classes
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">{institution.classCount}</div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Users className="h-4 w-4 text-purple-500" />
                Students
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">{institution.studentCount}</div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <UserRound className="h-4 w-4 text-purple-500" />
                Supervisors
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">{institution.supervisorCount}</div>
            </div>
          </div>
        </div>
      </div>

      <HeadlessDialog
        isOpen={!!selectedSupervisorId}
        onClose={closeSupervisorDialog}
        title="Supervisor Profile"
        maxWidth="2xl"
      >
        {isLoadingSupervisorProfile ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
          </div>
        ) : supervisorProfileError || !supervisorProfile ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Failed to load supervisor profile.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
                {supervisorProfile.avatarUrl ? (
                  <img src={supervisorProfile.avatarUrl} alt={supervisorProfile.fullName || 'Supervisor'} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-slate-300" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{supervisorProfile.fullName || 'Unnamed supervisor'}</h3>
                <p className="mt-1 text-sm text-slate-500">{supervisorProfile.email || 'N/A'}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone Number</div>
                <div className="mt-1 font-semibold text-slate-800">{supervisorProfile.phoneNumber || 'N/A'}</div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Institution</div>
                <div className="mt-1 font-semibold text-slate-800">{supervisorProfile.institutionName || institution.name || 'N/A'}</div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600 sm:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Created At</div>
                <div className="mt-1 font-semibold text-slate-800">{formatDate(supervisorProfile.createdAt)}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                <School className="h-4 w-4 text-purple-500" />
                Assigned Classes
              </div>
              {supervisorProfile.assignedClasses && supervisorProfile.assignedClasses.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {supervisorProfile.assignedClasses.map((classItem) => (
                    <div key={classItem.classId || classItem.className} className="rounded-2xl border border-slate-100 bg-white p-4">
                      <div className="font-semibold text-slate-900">{classItem.className || 'Unnamed class'}</div>
                      <div className="mt-2 text-sm text-slate-500">Students: {classItem.childrenCount}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No assigned classes.
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={closeSupervisorDialog}>Close</Button>
            </div>
          </div>
        )}
      </HeadlessDialog>
    </div>
  );
}