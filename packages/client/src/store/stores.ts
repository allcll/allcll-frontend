import { create } from 'zustand';

interface Course {
  id: string;
  code: string;
  name: string;
  professor: string;
  credits: number;
  seats: number;
  updatedAt: string;
}

interface StoreState {
  courses: Course[];
  updateSeats: (id: string, seats: number) => void;
}

export const useStore = create<StoreState>((set) => ({
  courses: [],
  updateSeats: (id, seats) =>
    set((state) => ({
      courses: state.courses.map((course) =>
        course.id === id ? { ...course, seats } : course
      ),
    })),
}));