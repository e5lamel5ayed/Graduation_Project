export interface ClassFormData {
  id?: string;
  name: string;
  teacher: string;
  maxStudents: number | string;
  schedule: string;
}

export interface Class extends ClassFormData {
  id: string;
  studentsCount: number;
}
