/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { DataTable, Button, HeadlessDialog } from '@/src/components/ui';
import { Plus } from 'lucide-react';
import { SupervisorForm, SupervisorFormData } from './SupervisorForm';
import { supervisorService } from '@/src/services/supervisorService';
import { Supervisor } from '@/src/types/supervisor';
import { toast } from 'sonner';

export default function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      setIsLoading(true);
      const data = await supervisorService.getAll();
      setSupervisors(data);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
      toast.error('Failed to load supervisors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedSupervisor(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsDialogOpen(true);
  };

  const handleDelete = async (supervisor: Supervisor) => {
    try {
      await supervisorService.delete(supervisor.id);
      toast.success('Supervisor deleted successfully');
      fetchSupervisors();
    } catch (error) {
      console.error('Error deleting supervisor:', error);
      toast.error('Failed to delete supervisor');
    }
  };

  const handleSubmit = async (formData: SupervisorFormData) => {
    setIsSubmitting(true);

    try {
      if (formData.id) {
        // Update existing supervisor
        const updateData: any = {
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        if (formData.avatarFile) {
          updateData.avatarFile = formData.avatarFile;
        }

        await supervisorService.update(formData.id, updateData);
        toast.success('Supervisor updated successfully');
      } else {
        // Create new supervisor
        await supervisorService.create({
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          avatarFile: formData.avatarFile,
        });
        toast.success('Supervisor created successfully');
      }

      setIsDialogOpen(false);
      fetchSupervisors();
    } catch (error) {
      console.error('Error saving supervisor:', error);
      toast.error('Failed to save supervisor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Full Name',
      accessor: (item: Supervisor) => item.fullName,
    },
    {
      header: 'Email',
      accessor: (item: Supervisor) => item.email,
    },
    {
      header: 'Phone Number',
      accessor: (item: Supervisor) => item.phoneNumber,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Supervisors</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Supervisor
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          data={supervisors}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No supervisors found. Click the button above to add a new supervisor."
          isLoading={isLoading}
        />
      </div>

      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => !isSubmitting && setIsDialogOpen(false)}
        title={selectedSupervisor ? 'Edit Supervisor' : 'Add New Supervisor'}
        maxWidth="lg"
      >
        <SupervisorForm
          initialData={selectedSupervisor ? {
            id: selectedSupervisor.id,
            fullName: selectedSupervisor.fullName,
            email: selectedSupervisor.email,
            password: '',
            phoneNumber: selectedSupervisor.phoneNumber,
            avatarUrl: selectedSupervisor.avatarUrl,
          } : undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </HeadlessDialog>
    </div>
  );
}