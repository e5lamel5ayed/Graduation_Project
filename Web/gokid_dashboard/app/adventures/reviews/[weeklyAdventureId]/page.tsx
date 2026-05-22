'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Loader2,
  ArrowLeft,
  Search,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { Button, HeadlessDialog } from '@/src/components/ui';
import { SupervisorAdventureTask } from '@/src/types/task';
import { adventureService } from '@/src/services/adventureService';
import { toast } from 'sonner';

export default function AdventureReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const weeklyAdventureId = params.weeklyAdventureId as string;

  const [tasks, setTasks] = useState<SupervisorAdventureTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Completed' | 'Missed' | 'Locked'>('all');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<SupervisorAdventureTask | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'approve' | 'reject'>('approve');
  const [reviewReason, setReviewReason] = useState('');
  const [reviewingTaskId, setReviewingTaskId] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adventureService.getSupervisorAdventureTasks(
        weeklyAdventureId,
        statusFilter === 'all' ? undefined : statusFilter
      );
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks', error);
      toast.error('Failed to load review tasks');
    } finally {
      setIsLoading(false);
    }
  }, [weeklyAdventureId, statusFilter]);

  useEffect(() => {
    if (weeklyAdventureId) {
      loadTasks();
    }
  }, [weeklyAdventureId, loadTasks]);

  const openReviewDialog = (task: SupervisorAdventureTask) => {
    setSelectedTask(task);
    setReviewDecision('approve');
    setReviewReason('');
    setIsReviewDialogOpen(true);
  };

  const closeReviewDialog = () => {
    if (reviewingTaskId) return;
    setIsReviewDialogOpen(false);
    setSelectedTask(null);
    setReviewDecision('approve');
    setReviewReason('');
  };

  const submitReview = async () => {
    if (!selectedTask) return;

    if (reviewDecision === 'reject' && !reviewReason.trim()) {
      toast.error('Please write a rejection reason');
      return;
    }

    try {
      setReviewingTaskId(selectedTask.childAdventureTaskId);
      await adventureService.reviewSupervisorTask(selectedTask.childAdventureTaskId, {
        isApproved: reviewDecision === 'approve',
        rejectionReason: reviewDecision === 'reject' ? reviewReason.trim() : '',
      });

      toast.success(reviewDecision === 'approve' ? 'Task approved successfully' : 'Task rejected successfully');
      setIsReviewDialogOpen(false);
      setSelectedTask(null);
      setReviewDecision('approve');
      setReviewReason('');
      await loadTasks();
    } catch (error) {
      console.error('Failed to submit review', error);
      toast.error('Failed to submit review');
    } finally {
      setReviewingTaskId(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      task.childName.toLowerCase().includes(query) ||
      task.taskTitleEn.toLowerCase().includes(query) ||
      task.taskTitleAr.toLowerCase().includes(query);

    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          bgFill: 'bg-emerald-500',
          label: 'Completed',
        };
      case 'Missed':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-700',
          bgFill: 'bg-rose-500',
          label: 'Missed',
        };
      case 'Locked':
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-700',
          bgFill: 'bg-slate-500',
          label: 'Locked',
        };
      case 'Pending':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          bgFill: 'bg-amber-500',
          label: 'Pending Review',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          bgFill: 'bg-gray-500',
          label: 'Pending',
        };
    }
  };

  return (
    <div className="p-3 sm:p-8 bg-gray-50/50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors mb-4 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Adventures
        </button>
        <h1 className="text-2xl font-black text-gray-900 leading-none mb-2">
          Review Tasks
        </h1>
        <p className="text-gray-500 font-medium">
          Review and manage submitted tasks from children
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-6 w-full">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by child name or task..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'Pending', 'Completed', 'Missed', 'Locked'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                statusFilter === status
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {status === 'all' ? 'All Status' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="h-56 flex items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
          {filteredTasks.map((task) => {
            const statusBadge = getStatusBadge(task.status);
            return (
              <div
                key={task.childAdventureTaskId}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-3 items-start sm:items-center">
                    {/* Child Info */}
                    <div className="sm:col-span-3">
                      <div className="flex items-center gap-3">
                        {task.childAvatarUrl ? (
                          <Image
                            src={task.childAvatarUrl}
                            alt={task.childName}
                            width={40}
                            height={40}
                            unoptimized
                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">
                            {task.childName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Task Info */}
                    <div className="sm:col-span-3 min-w-0">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Task
                      </p>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {task.taskTitleEn}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        Day {task.dayNumber}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="sm:col-span-2">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${statusBadge.bg} ${statusBadge.border} ${statusBadge.text}`}
                      >
                        {task.status === 'Completed' && (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        {task.status === 'Pending' && (
                          <Clock className="h-3.5 w-3.5" />
                        )}
                        {task.status === 'Missed' && (
                          <AlertCircle className="h-3.5 w-3.5" />
                        )}
                        {statusBadge.label}
                      </div>
                    </div>

                    {/* Submission Date */}
                    <div className="sm:col-span-2 text-[11px] text-gray-500">
                      {task.submittedAt ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(task.submittedAt).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>

                    {/* Evidence */}
                    <div className="sm:col-span-2 flex items-center justify-start sm:justify-end gap-2 flex-wrap">
                      {task.evidenceUrl && (
                        <a
                          href={task.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-bold uppercase hover:bg-sky-100 transition-colors"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                          View
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => openReviewDialog(task)}
                        disabled={reviewingTaskId === task.childAdventureTaskId}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase hover:bg-emerald-100 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border-4 border-dashed border-gray-100">
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-gray-200" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No Tasks Found</h3>
          <p className="text-gray-500 max-w-sm mx-auto font-medium">
            {searchQuery || statusFilter !== 'all'
              ? 'No tasks match your filters. Try adjusting your search criteria.'
              : 'There are no tasks to review yet.'}
          </p>
        </div>
      )}

      <HeadlessDialog
        isOpen={isReviewDialogOpen}
        onClose={closeReviewDialog}
        title="Review Task"
        maxWidth="md"
      >
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs font-semibold text-gray-500">Selected Task</p>
            <p className="text-sm font-bold text-gray-900 mt-1 truncate">
              {selectedTask ? `${selectedTask.childName} - ${selectedTask.taskTitleEn}` : '-'}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Decision</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReviewDecision('approve')}
                className={`rounded-xl border px-4 py-3 text-sm font-bold transition-all ${
                  reviewDecision === 'approve'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => setReviewDecision('reject')}
                className={`rounded-xl border px-4 py-3 text-sm font-bold transition-all ${
                  reviewDecision === 'reject'
                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                Reject
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="rejectionReason" className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Reason
            </label>
            <textarea
              id="rejectionReason"
              value={reviewReason}
              onChange={(e) => setReviewReason(e.target.value)}
              placeholder={reviewDecision === 'reject' ? 'Write the rejection reason...' : 'Optional note'}
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
            />
            {reviewDecision === 'reject' && (
              <p className="text-[11px] text-rose-500 font-medium">
                A rejection reason is required when rejecting.
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={closeReviewDialog} disabled={Boolean(reviewingTaskId)}>
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              isLoading={Boolean(reviewingTaskId)}
              className={reviewDecision === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}
            >
              {reviewDecision === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </div>
        </div>
      </HeadlessDialog>
    </div>
  );
}
