export interface Subject {
  id: number;
  code: string;
  name: string;
  professor: string;
  credits: number;
  seats: number;
}

export interface SubjectList {
  data: Subject[];
}