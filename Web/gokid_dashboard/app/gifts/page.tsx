/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Button, ConfirmDeleteDialog, Pagination } from '@/src/components/ui';
import { HeadlessDialog } from '@/src/components/ui/HeadlessDialog';
import { Plus, Pencil, Trash2, Loader2, Gift as GiftIcon, Star } from 'lucide-react';
import { GiftForm } from './GiftForm';
import { useGifts, useCreateGift, useUpdateGift, useDeleteGift } from '@/src/hooks/useGifts';
import type { Gift, GiftFormData, CreateGiftDto } from '@/src/types/gift';

export default function GiftsPage() {
  const { data: gifts, isLoading, error } = useGifts();
  const createMutation = useCreateGift();
  const updateMutation = useUpdateGift();
  const deleteMutation = useDeleteGift();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<GiftFormData | null>(null);
  const [giftToDelete, setGiftToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddNew = () => {
    setSelectedGift(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (gift: Gift) => {
    // Build form data directly from the list item — no API call needed
    setSelectedGift({
      id: gift.id,
      nameAr: gift.nameAr,
      nameEn: gift.nameEn,
      descriptionAr: gift.descriptionAr,
      descriptionEn: gift.descriptionEn,
      pointsCost: gift.pointsCost,
      type: gift.type,
      imageFile: null,
      existingImageUrl: gift.image?.imageUrl,
    });
    setIsDialogOpen(true);
  };

  const initialDataFromSelected: GiftFormData | undefined = selectedGift || undefined;

  const handleSubmit = async (formData: GiftFormData) => {
    // Map GiftFormData → CreateGiftDto (imageFile → image)
    const dto: CreateGiftDto = {
      nameAr: formData.nameAr,
      nameEn: formData.nameEn,
      descriptionAr: formData.descriptionAr,
      descriptionEn: formData.descriptionEn,
      pointsCost: formData.pointsCost,
      type: formData.type,
      image: formData.imageFile ?? undefined,
    };

    if (formData.id) {
      updateMutation.mutate(
        { id: formData.id, data: dto },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setSelectedGift(null);
          },
        }
      );
    } else {
      createMutation.mutate(dto, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setSelectedGift(null);
        },
      });
    }
  };

  const handleDeleteConfirm = (gift: Gift) => {
    setGiftToDelete({ id: gift.id, name: gift.nameAr });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteApprove = () => {
    if (giftToDelete) {
      deleteMutation.mutate(giftToDelete.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setGiftToDelete(null);
        },
      });
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading rewards
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none mb-2">
            Rewards
          </h1>
          <p className="text-gray-500 font-medium">
            Manage rewards and badges available for children
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2 px-5 py-3 rounded-lg shadow-xl shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98] h-auto"
        >
          <Plus size={20} />
          Add New Reward
        </Button>
      </div>

      {/* Gifts Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-purple-600" size={48} />
        </div>
      ) : !gifts || !Array.isArray(gifts) || gifts.length === 0 ? (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-12 text-center">
          <GiftIcon className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Rewards Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding a new reward to motivate children</p>
          <Button
            onClick={handleAddNew}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
          >
            <Plus size={20} />
            Add Reward
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gifts
              .slice((currentPage - 1) * 8, currentPage * 8)
              .map((gift) => {
                const typeColorMap: Record<string, string> = {
                  Badge: '#9333ea',
                  Sticker: '#3b82f6',
                  Trophy: '#f59e0b',
                  Medal: '#ef4444',
                  Reward: '#10b981',
                  Certificate: '#8b5cf6',
                };
                const accentColor = typeColorMap[gift.type] || '#9333ea';
                const cardStyle: Record<string, string> = {
                  borderTopColor: accentColor,
                  borderTopWidth: '4px',
                  '--accent-color': accentColor,
                };

                return (
                  <div
                    key={gift.id}
                    className="group flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                    style={cardStyle as React.CSSProperties}
                  >
                    {/* Decorative Gradient Background */}
                    <div
                      className="absolute -right-4 -top-4 w-40 h-40 blur-[80px] opacity-0 transition-opacity duration-700 group-hover:opacity-30"
                      style={{ backgroundColor: 'var(--accent-color)' }}
                    />

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div
                              className="w-1.5 h-5 rounded-full"
                              style={{ backgroundColor: 'var(--accent-color)' }}
                            />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Reward
                            </span>
                          </div>
                          <h2
                            className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-[var(--accent-color)] transition-colors duration-300"
                            title={gift.nameEn}
                          >
                            {gift.nameEn}
                          </h2>
                        </div>

                        <div className="ml-4 shrink-0">
                          {gift.image?.imageUrl ? (
                            <img
                              src={gift.image.imageUrl}
                              alt={gift.nameEn}
                              className="w-14 h-14 rounded-2xl border border-gray-100 object-cover bg-white shadow-md ring-4 ring-gray-50/50 transform group-hover:rotate-6 transition-transform duration-300"
                            />
                          ) : (
                            <div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 border border-gray-100 shadow-inner group-hover:bg-white transition-colors duration-300"
                              style={{ color: 'var(--accent-color)' }}
                            >
                              <GiftIcon className="w-7 h-7 opacity-40 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-gray-400 bg-gray-50/50 px-4 py-2 rounded-2xl border border-gray-50 w-full text-right" dir="rtl">
                          {gift.nameAr || 'لا يوجد اسم'}
                        </p>

                        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-transparent bg-gray-50/30 group-hover:bg-white group-hover:border-gray-100 transition-all duration-300 shadow-sm">
                          <Star className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
                          <span className="text-xs font-bold text-gray-600">
                            {gift.pointsCost} points
                          </span>
                          <span
                            className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                          >
                            {gift.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3 relative z-10 border-t border-gray-50 pt-5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(gift)}
                        className="h-10 px-5 rounded-2xl border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-600 hover:border-gray-100 hover:scale-105 transition-all duration-200"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        <span className="font-bold">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteConfirm(gift)}
                        className="h-10 px-5 rounded-2xl text-red-500 border-gray-100 hover:bg-red-50 hover:border-red-200 hover:scale-105 transition-all duration-200"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span className="font-bold">Delete</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(gifts.length / 8)}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-10"
          />
        </>
      )}

      {/* Add/Edit Dialog */}
      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedGift(null);
        }}
        title={selectedGift?.id ? 'Edit Reward' : 'Add New Reward'}
        maxWidth="3xl"
      >
        <GiftForm
          initialData={initialDataFromSelected}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </HeadlessDialog>

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Reward"
        description="Are you sure you want to delete this reward? This action cannot be undone."
        itemName={giftToDelete?.name}
        onConfirm={handleDeleteApprove}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setGiftToDelete(null);
        }}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
