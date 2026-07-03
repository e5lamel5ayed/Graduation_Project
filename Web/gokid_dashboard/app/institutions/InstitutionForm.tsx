/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Building2, Camera, Globe, Mail, MapPinned, Phone, X } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import type { InstitutionDetails } from '@/src/types/institution';

export interface InstitutionFormData {
  id?: string;
  name: string;
  adminFullName?: string;
  adminEmail?: string;
  adminName?: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  website: string;
  description: string;
  logoFile?: File | null;
  logoUrl?: string;
}

interface InstitutionFormProps {
  initialData?: InstitutionFormData | InstitutionDetails | null;
  onSubmit: (data: InstitutionFormData) => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const normalizeInitialData = (initialData?: InstitutionFormData | InstitutionDetails | null): InstitutionFormData | null => {
  if (!initialData) {
    return null;
  }

  return {
    id: initialData.id,
    name: initialData.name || '',
    adminFullName: 'adminFullName' in initialData ? initialData.adminFullName : initialData.adminName,
    adminEmail: 'adminEmail' in initialData ? initialData.adminEmail : undefined,
    phoneNumber: initialData.phoneNumber || '',
    address: initialData.address || '',
    city: initialData.city || '',
    country: initialData.country || '',
    website: initialData.website || '',
    description: initialData.description || '',
    logoUrl: initialData.logoUrl,
  };
};

export function InstitutionForm({ initialData, onSubmit, isLoading = false, mode }: InstitutionFormProps) {
  const [formData, setFormData] = useState<InstitutionFormData>(() => normalizeInitialData(initialData) || {
    name: '',
    adminFullName: '',
    adminEmail: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    website: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        logoFile: e.target.files?.[0],
      }));
    }
  };

  const clearLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoFile: undefined,
      logoUrl: prev.logoUrl,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fieldClassName = 'min-h-[120px] w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-200';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Institution Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Bright Future Nursery"
          leftIcon={<Building2 />}
          required
        />

        {mode === 'create' ? (
          <Input
            label="Admin Full Name"
            name="adminFullName"
            value={formData.adminFullName || ''}
            onChange={handleChange}
            placeholder="e.g. Ahmed Mohamed"
            required
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
            Admin account info cannot be edited here.
          </div>
        )}

        {mode === 'create' ? (
          <Input
            label="Admin Email"
            name="adminEmail"
            type="email"
            value={formData.adminEmail || ''}
            onChange={handleChange}
            placeholder="admin@example.com"
            leftIcon={<Mail />}
            required
          />
        ) : (
          <Input
            label="Admin Email"
            value={formData.adminEmail || 'Managed by system'}
            disabled
            leftIcon={<Mail />}
          />
        )}

        <Input
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="e.g. 01012345678"
          leftIcon={<Phone />}
          required
        />

        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="e.g. Cairo"
          leftIcon={<MapPinned />}
          required
        />

        <Input
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="e.g. Egypt"
          leftIcon={<MapPinned />}
          required
        />

        <Input
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://example.com"
          leftIcon={<Globe />}
          required
        />
      </div>

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Full address"
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short description about the institution"
          className={fieldClassName}
          required
        />
      </div>

      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Logo</h4>
            <p className="text-xs text-gray-500">PNG or JPG up to 5MB</p>
          </div>
        </div>

        <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-gray-200 bg-white px-4 py-5 text-center transition hover:border-purple-300 hover:bg-purple-50/30">
          <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />

          {formData.logoFile ? (
            <div className="flex items-center justify-center gap-3 text-sm font-medium text-purple-700">
              <span className="truncate max-w-[240px]">{formData.logoFile.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  clearLogo();
                }}
                className="rounded-full p-1 hover:bg-purple-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : formData.logoUrl ? (
            <div className="space-y-3">
              <img src={formData.logoUrl} alt="Institution logo" className="mx-auto h-20 w-20 rounded-2xl object-cover border border-gray-100 shadow-sm" />
              <span className="block text-xs text-gray-500">Click to replace the current logo</span>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="block text-sm font-semibold text-gray-900">Upload institution logo</span>
              <span className="block text-xs text-gray-500">Drag and drop or click to browse</span>
            </div>
          )}
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData({
            name: '',
            adminFullName: '',
            adminEmail: '',
            phoneNumber: '',
            address: '',
            city: '',
            country: '',
            website: '',
            description: '',
          })}
          disabled={isLoading}
        >
          Reset
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === 'create' ? 'Create Institution' : 'Update Institution'}
        </Button>
      </div>
    </form>
  );
}

export type { CreateInstitutionDto, UpdateInstitutionDto } from '@/src/types/institution';