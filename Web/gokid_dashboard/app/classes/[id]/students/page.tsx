'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Smile,
  Plus,
  Search,
  Trophy,
  Zap,
  Heart,
  Star,
  Loader2,
  X,
  Users,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import Image from 'next/image';
import { Button, Input } from '@/src/components/ui';
import { cn } from '@/src/lib/utils';
import { useChildren, useEnrollChild, useDeleteChild } from '@/src/hooks/useChildren';
import { useClassById } from '@/src/hooks/useClasses';
import { Child } from '@/src/types/children';

const PAGE_SIZE = 20;

// Badge config identical to Children page
const badgeConfig = {
  excellent: { label: 'Star Student', icon: Star, color: 'text-amber-500 bg-amber-50' },
  great: { label: 'Great Performer', icon: Trophy, color: 'text-purple-600 bg-purple-50' },
  good: { label: 'Helper', icon: Zap, color: 'text-indigo-600 bg-indigo-50' },
  active: { label: 'Most Creative', icon: Heart, color: 'text-rose-500 bg-rose-50' },
};

const getChildBadge = (totalPoints: number) => {
  if (totalPoints >= 80) return badgeConfig.excellent;
  if (totalPoints >= 60) return badgeConfig.great;
  if (totalPoints >= 40) return badgeConfig.good;
  return badgeConfig.active;
};

const getAvatarColor = (childId: string, childName: string) => {
  const colors = [
    { bg: 'bg-indigo-50', text: 'text-indigo-500' },
    { bg: 'bg-pink-50', text: 'text-pink-500' },
    { bg: 'bg-purple-50', text: 'text-purple-500' },
    { bg: 'bg-rose-50', text: 'text-rose-500' },
    { bg: 'bg-blue-50', text: 'text-blue-500' },
    { bg: 'bg-cyan-50', text: 'text-cyan-500' },
  ];
  const hash = childId.charCodeAt(0) + childName.charCodeAt(0);
  return colors[hash % colors.length];
};

export default function ClassStudentsPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [searchInput, setSearchInput] = useState('');
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [registrationCode, setRegistrationCode] = useState('');

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<Child | null>(null);

  const { mutate: enrollChild, isPending: isEnrolling } = useEnrollChild();
  const { mutate: deleteChild, isPending: isDeleting } = useDeleteChild();

  // Debounced search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentPage(1);
      setSearchName(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  // Fetch class info to display name
  const { data: classData, isLoading: classLoading } = useClassById(classId);

  // Fetch students filtered by classId — same endpoint as Children page
  const {
    data: childrenData,
    isLoading: childrenLoading,
    error,
  } = useChildren({
    pageNumber: currentPage,
    pageSize: PAGE_SIZE,
    classId,
    searchName: searchName || undefined,
  });

  const children = useMemo(
    () => (childrenData?.items || []) as Child[],
    [childrenData]
  );

  const handleEnrollChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationCode.trim()) return;
    enrollChild({ classId, registrationcode: registrationCode.trim() }, {
      onSuccess: () => {
        setIsEnrollDialogOpen(false);
        setRegistrationCode('');
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteChild(
      { classId, childId: deleteTarget.childId },
      { onSuccess: () => setDeleteTarget(null) }
    );
  };

  const isLoading = classLoading || (childrenLoading && children.length === 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Unable to load students</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const className = classData?.name || 'Class';

  return (
    <div className="p-8 min-h-[calc(100vh-80px)] bg-[#fcfaff]">
      {/* Header Section */}
      <div className="mb-10">
        <button
          onClick={() => router.push('/classes')}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Classes</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-xl font-black text-slate-800">
              {className} <span className="text-indigo-600">Students</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Select a child to view their full profile and performance
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                className="pl-11 pr-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 transition-all outline-none w-64 shadow-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsEnrollDialogOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl h-[46px] px-6 shadow-lg shadow-indigo-100 border-none font-bold text-xs uppercase tracking-wider"
            >
              <Plus className="h-4 w-4 mr-2" />
              Register Student
            </Button>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      {children.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {children.map((child) => {
              const badge = getChildBadge(child.totalPoints);
              const BadgeIcon = badge.icon;
              const avatarColor = getAvatarColor(child.childId, child.childName);

              return (
                <div
                  key={child.childId}
                  onClick={() => router.push(`/classes/${classId}/students/${child.childId}`)}
                  className="group relative p-5 rounded-[36px] bg-white border border-slate-100/50 transition-all duration-500 cursor-pointer text-center hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-2 overflow-hidden"
                >
                  {/* Delete button - appears on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(child);
                    }}
                    className="absolute top-3 right-3 z-20 p-1.5 bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm border border-slate-100 hover:border-red-200"
                    title="Remove student from class"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>

                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Avatar */}
                  <div className="relative mx-auto w-20 h-20 mb-5">
                    <div className="absolute inset-0 rounded-[28px] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-indigo-400" />
                    {child.avatarUrl ? (
                      <Image
                        src={child.avatarUrl}
                        alt={child.childName}
                        width={80}
                        height={80}
                        className="relative w-full h-full rounded-[28px] object-cover transition-all duration-500 group-hover:scale-110 shadow-inner"
                      />
                    ) : (
                      <div
                        className={cn(
                          'relative w-full h-full rounded-[28px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-inner',
                          avatarColor.bg,
                          avatarColor.text
                        )}
                      >
                        <Smile className="h-10 w-10 drop-shadow-sm" />
                      </div>
                    )}
                    {/* Online dot */}
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-[3px] border-white rounded-full shadow-lg z-10" />
                  </div>

                  {/* Name & Badge */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-700 tracking-tight group-hover:text-indigo-600 transition-colors truncate">
                      {child.childName.split(' ')[0]}
                    </h4>
                    <div
                      className={cn(
                        'inline-flex items-center gap-1 py-1 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-transform duration-300 group-hover:scale-105',
                        badge.color
                      )}
                    >
                      <BadgeIcon className="h-2.5 w-2.5" />
                      {badge.label}
                    </div>
                  </div>
                </div>
              );
            })}


          </div>

          {/* Pagination */}
          {childrenData && (childrenData.hasPreviousPage || childrenData.hasNextPage) && (
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page {childrenData.pageNumber} of {childrenData.totalPages} ({childrenData.totalCount} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!childrenData.hasPreviousPage}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 font-semibold text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!childrenData.hasNextPage}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 font-semibold text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty state + placeholder card */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100 mb-2">
            <Users className="h-16 w-16 text-slate-200 mb-4" />
            <p className="text-slate-500 text-base font-semibold mb-2">No students yet</p>
            <p className="text-slate-400 text-sm">
              {searchName ? 'Try adjusting your search' : 'Register a student to get started'}
            </p>
          </div>

        </div>
      )}

      {/* ── Delete Confirm Dialog ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 text-center mb-1">Remove Student?</h2>
            <p className="text-sm text-slate-400 text-center mb-6">
              Are you sure you want to remove{' '}
              <span className="font-bold text-slate-600">{deleteTarget.childName}</span>{' '}
              from this class? The child will remain in the institution.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-bold text-sm transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Child Dialog */}
      {isEnrollDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Plus className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Register Student</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Enter the child&apos;s registration code</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEnrollDialogOpen(false);
                  setRegistrationCode('');
                }}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {/* Dialog Content */}
            <form onSubmit={handleEnrollChild} className="p-6 space-y-4">
              <div>
                <label htmlFor="registrationCode" className="block text-sm font-bold text-slate-700 mb-2">
                  Registration Code
                </label>
                <Input
                  id="registrationCode"
                  type="text"
                  placeholder="Enter registration code..."
                  value={registrationCode}
                  onChange={(e) => setRegistrationCode(e.target.value)}
                  disabled={isEnrolling}
                  className="w-full"
                  autoFocus
                />
                <p className="text-xs text-slate-400 mt-2">
                  The unique code provided for the child&apos;s enrollment
                </p>
              </div>

              {/* Dialog Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEnrollDialogOpen(false);
                    setRegistrationCode('');
                  }}
                  disabled={isEnrolling}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold text-sm transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEnrolling || !registrationCode.trim()}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Register
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
