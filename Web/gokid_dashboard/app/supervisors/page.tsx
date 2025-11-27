'use client';

import { useState } from 'react';
import { DataTable } from '@/src/components/ui';
import { Button } from '@/src/components/ui/Button';
import { HeadlessDialog } from '@/src/components/ui/HeadlessDialog';
import { Plus } from 'lucide-react';
import { SupervisorForm, SupervisorFormData } from './SupervisorForm';
  
interface Supervisor extends SupervisorFormData {
  id: string;
  email: string;
  phoneNumber: number ;
}

export default function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', phoneNumber: 1234567890},
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phoneNumber: 2345678901 },
    { id: '3', name: 'Robert Johnson', email: 'robert.johnson@example.com', phoneNumber: 3456789012},
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNew = () => {
    setSelectedSupervisor(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsDialogOpen(true);
  };

  const handleDelete = (supervisor: Supervisor) => {
      setSupervisors(supervisors.filter(s => s.id !== supervisor.id));
 
  };

  const handleSubmit = async (formData: SupervisorFormData) => {
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API

    if (formData.id) {
      // Update existing supervisor
      setSupervisors(supervisors.map(s =>
        s.id === formData.id
          ? { ...formData } as Supervisor
          : s
      ));
    } else {
      // Add new supervisor
      const newSupervisor: Supervisor = {
        ...formData,
        id: Date.now().toString(),
        Email: '',
      } as Supervisor;
      setSupervisors([...supervisors, newSupervisor]);
    }

    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  const columns = [
    {
      header: 'Supervisor Name',
      accessor: (item: Supervisor) => item.name,
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
        />
      </div>

      <HeadlessDialog
        isOpen={isDialogOpen}
        onClose={() => !isSubmitting && setIsDialogOpen(false)}
        title={selectedSupervisor ? 'Edit Supervisor' : 'Add New Supervisor'}
        maxWidth="lg"
      >
        <SupervisorForm
          initialData={selectedSupervisor || undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </HeadlessDialog>
    </div>
  );
}