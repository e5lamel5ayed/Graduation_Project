'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { adventureService } from '@/src/services/adventureService';
import { SupervisorAdventureChild } from '@/src/types/adventure';
import { Button } from '@/src/components/ui';
import SidePanel from '@/src/components/ui/SidePanel';
import { SupervisorChildHistory } from '@/src/types/adventure';
import { FileText } from 'lucide-react';

export default function ChildrenPage() {
    const params = useParams() as { weeklyAdventureId?: string; classId?: string };
    const router = useRouter();
    const weeklyAdventureId = params.weeklyAdventureId || '';
    const classId = params.classId || '';

    const [children, setChildren] = useState<SupervisorAdventureChild[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedChildHistory, setSelectedChildHistory] = useState<SupervisorChildHistory | null>(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    useEffect(() => {
        if (!weeklyAdventureId || !classId) return;

        const fetchChildren = async () => {
            try {
                setIsLoading(true);
                const data = await adventureService.getSupervisorAdventureClassChildren(weeklyAdventureId, classId);
                setChildren(data || []);
            } catch (err) {
                console.error('Failed to load children', err);
                toast.error('Failed to load children');
                setChildren([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChildren();
    }, [weeklyAdventureId, classId]);

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Class Children</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Back</Button>
                </div>
            </div>

            {isLoading ? (
                <div className="py-10 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
                </div>
            ) : children.length === 0 ? (
                <div className="text-center py-10 rounded-xl border border-dashed border-gray-200 bg-white">
                    <p className="text-sm font-semibold text-gray-700">No children found for this class.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {children.map((child) => (
                        <div
                            key={child.childId}
                            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transform-gpu transition-transform"
                            role="button"
                            onClick={async () => {
                                try {
                                    setIsLoadingHistory(true);
                                    const history = await adventureService.getSupervisorChildHistory(weeklyAdventureId, child.childId);
                                    setSelectedChildHistory(history);
                                    setIsPanelOpen(true);
                                } catch (err) {
                                    console.error('Failed to load child history', err);
                                    toast.error('Failed to load child history');
                                } finally {
                                    setIsLoadingHistory(false);
                                }
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100">
                                    {child.childAvatarUrl ? (
                                        <Image src={child.childAvatarUrl} alt={child.childName} width={56} height={56} />
                                    ) : (
                                        <div className="w-14 h-14 flex items-center justify-center text-gray-400">👶</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">{child.childName}</h3>
                                    <p className="text-sm text-gray-500">Age: {child.age}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-800">{child.completedTasksCount}/{child.totalTasksCount}</div>
                                    <div className="text-xs text-gray-500">Submitted: {child.submittedTasksCount}</div>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-center">
                                <div className="rounded-md bg-amber-50 border border-amber-100 py-2">
                                    <div className="font-bold">{child.earnedStars}</div>
                                    <div className="text-gray-500">Stars</div>
                                </div>
                                <div className="rounded-md bg-emerald-50 border border-emerald-100 py-2">
                                    <div className="font-bold">{child.earnedPoints}</div>
                                    <div className="text-gray-500">Points</div>
                                </div>
                                <div className={`rounded-md py-2 ${child.isAdventureCompleted ? 'bg-sky-50 border border-sky-100 text-sky-700' : 'bg-gray-50 border border-gray-100 text-gray-600'}`}>
                                    <div className="font-bold">{child.isAdventureCompleted ? 'Completed' : 'In Progress'}</div>
                                    <div className="text-gray-500">Status</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => {
                    setIsPanelOpen(false);
                    setSelectedChildHistory(null);
                }}
                title={selectedChildHistory ? selectedChildHistory.childName : 'Child Details'}
                widthClass="sm:max-w-xl"
            >
                {isLoadingHistory ? (
                    <div className="py-6 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
                    </div>
                ) : !selectedChildHistory ? (
                    <div className="text-center text-sm text-gray-500">No details available</div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                                {selectedChildHistory.childAvatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={selectedChildHistory.childAvatarUrl} alt={selectedChildHistory.childName} className="w-16 h-16 object-cover" />
                                ) : (
                                    <div className="w-16 h-16 flex items-center justify-center text-gray-400">👶</div>
                                )}
                            </div>
                            <div>
                                <div className="text-lg font-bold text-gray-900">{selectedChildHistory.childName}</div>
                                <div className="text-sm text-gray-500">Tasks: {selectedChildHistory.completedTasks}/{selectedChildHistory.totalTasks}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-md bg-amber-50 border border-amber-100 p-3">
                                <div className="font-bold text-lg">{selectedChildHistory.earnedStars}</div>
                                <div className="text-xs text-gray-500">Stars</div>
                            </div>
                            <div className="rounded-md bg-emerald-50 border border-emerald-100 p-3">
                                <div className="font-bold text-lg">{selectedChildHistory.earnedPoints}</div>
                                <div className="text-xs text-gray-500">Points</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-2">Tasks History</h4>
                            {selectedChildHistory.tasks.length === 0 ? (
                                <div className="text-sm text-gray-500">No task records</div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedChildHistory.tasks.map((t) => (
                                        <div key={t.childAdventureTaskId} className="rounded-xl border border-gray-100 p-3 bg-white">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="font-bold text-gray-900">{t.taskTitleEn || t.taskTitleAr || `Day ${t.dayNumber}`}</div>
                                                    <div className="text-xs text-gray-500">Day {t.dayNumber} • {t.status}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {t.evidenceUrl && (
                                                        <a href={t.evidenceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-sky-600">
                                                            <FileText className="h-4 w-4" /> View Evidence
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            {t.taskImageUrl && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={t.taskImageUrl} alt={t.taskTitleEn || ''} className="mt-3 w-full rounded-md object-cover max-h-40" />
                                            )}

                                            {t.storyVoiceUrl && (
                                                <div className="mt-3">
                                                    <audio controls src={t.storyVoiceUrl} className="w-full" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </SidePanel>
        </div>
    );
}
