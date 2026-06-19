/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Button, ConfirmDeleteDialog } from '@/src/components/ui';
import { HeadlessDialog } from '@/src/components/ui/HeadlessDialog';
import { Plus, Pencil, Trash2, Loader2, Gift as GiftIcon } from 'lucide-react';
import { GiftForm } from './GiftForm';
import { useGifts, useCreateGift, useUpdateGift, useDeleteGift, useGift } from '@/src/hooks/useGifts';
import type { Gift, GiftFormData } from '@/src/types/gift';

export default function GiftsPage() {
  const { data: gifts, isLoading, error } = useGifts();
  const createMutation = useCreateGift();
  const updateMutation = useUpdateGift();
  const deleteMutation = useDeleteGift();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<GiftFormData | null>(null);
  const [giftToDelete, setGiftToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: selectedFullGift, isLoading: isLoadingSelectedGift } = useGift(selectedId || '');

  const handleAddNew = () => {
    setSelectedGift(null);
    setSelectedId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (gift: Gift) => {
    setSelectedId(gift.id);
    setIsDialogOpen(true);
  };

  const initialDataFromSelected: GiftFormData | undefined = selectedFullGift
    ? {
      id: selectedFullGift.id,
      nameAr: selectedFullGift.nameAr,
      nameEn: selectedFullGift.nameEn,
      descriptionAr: selectedFullGift.descriptionAr,
      descriptionEn: selectedFullGift.descriptionEn,
      pointsCost: selectedFullGift.pointsCost,
      type: selectedFullGift.type,
      imageFile: null,
      existingImageUrl: selectedFullGift.image?.imageUrl,
    }
    : selectedGift || undefined;

  const handleSubmit = async (formData: GiftFormData) => {
    if (formData.id) {
      updateMutation.mutate(
        { id: formData.id, data: formData },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setSelectedGift(null);
            setSelectedId(null);
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
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
          Error loading gifts
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
            Gifts
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
          Add New Gift
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Gifts Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding a new gift to motivate children</p>
          <Button
            onClick={handleAddNew}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
          >
            <Plus size={20} />
            Add Gift
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              {gift.image?.imageUrl && (
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-indigo-100 overflow-hidden">
                  <img
                    src={gift.image.imageUrl}
                    alt={gift.nameEn}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {gift.type}
                  </div>
                </div>
              )}
              {!gift.image?.imageUrl && (
                <div className="h-48 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                  <GiftIcon className="w-12 h-12 text-purple-300" />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{gift.nameEn}</h3>
                <p className="text-sm text-gray-600 mb-3 text-right dir-rtl">{gift.nameAr}</p>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{gift.descriptionEn}</p>

                {/* Points */}
                <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 mb-4 border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-orange-600">{gift.pointsCost}</span>
                    <span className="text-xs font-semibold text-gray-600">points</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500">
                    <GiftIcon size={16} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(gift)}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-600 hover:bg-purple-100 py-2 rounded-lg font-semibold transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm(gift)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg font-semibold transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedGift(null);
          setSelectedId(null);
        }}
        title={selectedId ? 'Edit Gift' : 'Add New Gift'}
        maxWidth="3xl"
      >
        <GiftForm
          initialData={initialDataFromSelected}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending || isLoadingSelectedGift}
        />
      </HeadlessDialog>

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Gift"
        description="Are you sure you want to delete this gift? This action cannot be undone."
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
