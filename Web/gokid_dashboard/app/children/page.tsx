'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Smile,
  Trophy,
  Zap,
  Heart,
  Star,
  TrendingUp,
  BookOpen,
  Award,
  Loader2,
  Plus,
  X,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import Image from 'next/image';
import { useChildren, useEnrollChild, useDeleteChildFromInstitution } from '@/src/hooks/useChildren';
import { Input } from '@/src/components/ui';
import { cn } from '@/src/lib/utils';
import { Child } from '@/src/types/children';

const PAGE_SIZE = 12;

// Badge configuration based on points
const badgeConfig = {
  excellent: { label: 'Star', icon: Star, color: 'text-amber-500 bg-amber-50' },
  great: { label: 'Great Performer', icon: Trophy, color: 'text-purple-600 bg-purple-50' },
  good: { label: 'Good', icon: Zap, color: 'text-indigo-600 bg-indigo-50' },
  active: { label: 'Active', icon: Heart, color: 'text-rose-500 bg-rose-50' },
};

const getChildBadge = (totalPoints: number) => {
  if (totalPoints >= 80) return badgeConfig.excellent;
  if (totalPoints >= 60) return badgeConfig.great;
  if (totalPoints >= 40) return badgeConfig.good;
  return badgeConfig.active;
};

// Generate avatar color based on child ID or name
const getAvatarColor = (childId: string, childName: string) => {
  const colors = [
    { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { bg: 'bg-purple-50', text: 'text-purple-600' },
    { bg: 'bg-pink-50', text: 'text-pink-600' },
    { bg: 'bg-rose-50', text: 'text-rose-600' },
    { bg: 'bg-blue-50', text: 'text-blue-600' },
    { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  ];
  
  const hash = childId.charCodeAt(0) + childName.charCodeAt(0);
  return colors[hash % colors.length];
};

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function ChildrenPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [registrationCode, setRegistrationCode] = useState('');

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<Child | null>(null);

  const { mutate: enrollChild, isPending: isEnrolling } = useEnrollChild();
  const { mutate: deleteChild, isPending: isDeleting } = useDeleteChildFromInstitution();

  // Handle child enrollment
  const handleEnrollChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationCode.trim()) return;
    enrollChild(
      { classId: '', registrationcode: registrationCode.trim() },
      {
        onSuccess: () => {
          setIsEnrollDialogOpen(false);
          setRegistrationCode('');
        },
      }
    );
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteChild(
      deleteTarget.childId,
      {
        onSuccess: () => {
          setDeleteTarget(null);
        },
      }
    );
  };

  // Role-based access control: Only Organization (institution) role users can access this page
  useEffect(() => {
    if (!authLoading && user && user.role !== 'institution') {
      router.push('/');
      return;
    }
  }, [user, authLoading, router]);

  // Debounced search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentPage(1);
      setSearchName(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data: childrenData, isLoading, error } = useChildren({
    pageNumber: currentPage,
    pageSize: PAGE_SIZE,
    searchName: searchName || undefined,
  });

  const children = useMemo(
    () => (childrenData?.items || []) as Child[],
    [childrenData]
  );

  // Statistics
  const stats = useMemo(() => {
    const items = childrenData?.items || [];
    return {
      total: childrenData?.totalCount || items.length,
      avgPoints: items.length > 0 ? Math.round(items.reduce((sum, c) => sum + c.totalPoints, 0) / items.length) : 0,
      topPerformer: items.length > 0 ? Math.max(...items.map(c => c.totalPoints)) : 0,
    };
  }, [childrenData]);

  // Show loading state
  if (authLoading || (isLoading && children.length === 0)) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Unable to load children</p>
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

  return (
    <div className="p-6 md:p-8 min-h-[calc(100vh-80px)] bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        {/* Title and Description */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
                Our Children
              </h1>
              <p className="text-slate-400 text-xs md:text-sm mt-0.5">
                Manage and monitor all children across your organization
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
                  Total Children
                </p>
                <p className="text-xl font-black text-slate-800">{stats.total}</p>
              </div>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
                  Average Points
                </p>
                <p className="text-xl font-black text-purple-600">{stats.avgPoints}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
                  Top Score
                </p>
                <p className="text-xl font-black text-amber-600">{stats.topPerformer}</p>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <Trophy className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-300" />
            <Input
              placeholder="Search children by name..."
              className="pl-10 py-2.5 text-sm rounded-lg border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsEnrollDialogOpen(true)}
            className="inline-flex cursor-pointer items-center justify-center rounded-2xl font-medium transition-colors bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg hover:from-purple-700 hover:to-purple-900 h-[46px] px-6 text-xs uppercase tracking-wider whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Child
          </button>
        </div>

        {/* Children Grid */}
        {children.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {children.map((child) => {
              const badge = getChildBadge(child.totalPoints);
              const BadgeIcon = badge.icon;
              const avatarColor = getAvatarColor(child.childId, child.childName);
              const initials = getInitials(child.childName);

              return (
                <div
                  key={child.childId}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group relative"
                >
                  {/* Delete Button - appears on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(child);
                    }}
                    className="absolute top-3 right-3 z-20 p-1.5 bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm border border-slate-100 hover:border-red-200"
                    title="Remove child from class"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  {/* Card Header with gradient */}
                  <div className="h-20 w-full opacity-20 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-300 relative z-0" />

                  {/* Card Content */}
                  <div className="px-6 pb-6 -mt-14 relative z-10">
                    {/* Avatar and Basic Info */}
                    <div className="flex items-end gap-4 mb-6">
                      {child.avatarUrl ? (
                        <Image
                          src={child.avatarUrl}
                          alt={child.childName}
                          width={64}
                          height={64}
                          className="rounded-2xl border-4 border-white shadow-lg object-cover"
                        />
                      ) : (
                        <div
                          className={cn(
                            'w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-base font-black',
                            avatarColor.bg,
                            avatarColor.text
                          )}
                        >
                          {initials}
                        </div>
                      )}
                      <div className="flex-1 mb-1">
                        <h3 className="text-base font-black text-slate-800 leading-tight">
                          {child.childName}
                        </h3>
                        {child.nickName && (
                          <p className="text-xs text-slate-400 font-semibold italic">
                            &quot;{child.nickName}&quot;
                          </p>
                        )}
                        <p className="text-xs text-slate-400 font-bold mt-0.5">{child.age} years old</p>
                      </div>
                    </div>

                    {/* Badge */}
                    <div
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase mb-4',
                        badge.color
                      )}
                    >
                      <BadgeIcon className="h-3 w-3" />
                      {badge.label}
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-slate-100">
                      {/* Class */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500">
                          <BookOpen className="h-4 w-4" />
                          <span className="text-xs font-semibold truncate">{child.className}</span>
                        </div>
                        <span className="text-xs font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg whitespace-nowrap">
                          Class
                        </span>
                      </div>

                      {/* Points Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-slate-500">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-xs font-semibold">Points</span>
                          </div>
                          <span className="text-xs font-black text-indigo-600">
                            {child.totalPoints}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full bg-gradient-to-r transition-all duration-500',
                              child.totalPoints >= 80
                                ? 'from-emerald-400 to-emerald-500'
                                : child.totalPoints >= 60
                                  ? 'from-indigo-400 to-purple-500'
                                  : 'from-yellow-400 to-orange-500'
                            )}
                            style={{ width: `${Math.min((child.totalPoints / 100) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Points Card */}
                    <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl mb-6 border border-indigo-100">
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                        Total Achievements
                      </p>
                      <p className="text-xl font-black text-indigo-600">{child.totalPoints}</p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-1">Points Earned</p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100">
            <Smile className="h-16 w-16 text-slate-200 mb-4" />
            <p className="text-slate-500 text-base font-semibold mb-2">No children found</p>
            <p className="text-slate-400 text-sm">
              {searchName ? 'Try adjusting your search' : 'Start by adding children to your classes'}
            </p>
          </div>
        )}

        {/* Pagination Info */}
        {childrenData && (childrenData.hasPreviousPage || childrenData.hasNextPage) && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {childrenData.pageNumber} of {childrenData.totalPages} ({childrenData.totalCount} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!childrenData.hasPreviousPage}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 font-semibold text-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!childrenData.hasNextPage}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 font-semibold text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Confirm Dialog ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>

            {/* Text */}
            <h2 className="text-lg font-black text-slate-800 text-center mb-1">Remove Child?</h2>
            <p className="text-sm text-slate-400 text-center mb-6">
              Are you sure you want to remove{' '}
              <span className="font-bold text-slate-600">{deleteTarget.childName}</span>{' '}
              from the class? The child will remain in the institution.
            </p>

            {/* Actions */}
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

      {/* ── Enroll Child Dialog ── */}
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
                  <h2 className="text-lg font-bold text-slate-800">Add Child</h2>
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
                      Add Child
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
