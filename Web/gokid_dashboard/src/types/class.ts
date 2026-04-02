export interface ClassFormData {
  id?: string;
  name: string;
  teacher: string;
  maxStudents: number | string;
  schedule: string;
  adventuresCount?: number;
  createdAt?: string;
}

export interface Class extends ClassFormData {
  id: string;
  studentsCount: number;
  adventuresCount: number;
  createdAt: string;
}
