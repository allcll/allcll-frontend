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

/**
 * @deprecated
 * 여석을 저장하는 store입니다. 현재는 사용하지 않습니다.
 * */
export const useStore = create<StoreState>((set) => ({
  courses: [],
  updateSeats: (id, seats) =>
    set((state) => ({
      courses: state.courses.map((course) =>
        course.id === id ? { ...course, seats } : course
      ),
    })),
}));