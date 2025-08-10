import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SseSubject } from '@/hooks/server/useSSESeats.ts';

export interface HeadTitle {
  title: string;
  visible: boolean;
  key: keyof SseSubject;
}

const DefaultTableHeadTitles: HeadTitle[] = [
  { title: '과목코드', visible: true, key: 'code' },
  { title: '과목명', visible: true, key: 'name' },
  { title: '담당교수', visible: true, key: 'professor' },
  { title: '여석', visible: true, key: 'seat' },
  { title: '최근갱신', visible: true, key: 'queryTime' },

  { title: '학과명', visible: false, key: 'manageDeptNm' },
  { title: '수강학년', visible: false, key: 'studentYear' },
  { title: '수업시간', visible: false, key: 'lesnTime' },
  { title: '수업실', visible: false, key: 'lesnRoom' },
  { title: '학점', visible: false, key: 'tmNum' },
  { title: '비고', visible: false, key: 'remark' },
  { title: '수업유형', visible: false, key: 'curiTypeCdNm' },
  { title: '수업언어', visible: false, key: 'curiLangNm' },
];

export interface LiveTableStore {
  tableTitles: HeadTitle[];
  setTableTitles: (titles: HeadTitle[]) => void;
  resetTableTitles: () => void;
}

export const useLiveTableStore = create<LiveTableStore>()(
  persist(
    set => ({
      tableTitles: DefaultTableHeadTitles,
      setTableTitles: titles => set({ tableTitles: titles }),
      resetTableTitles: () => set({ tableTitles: DefaultTableHeadTitles }),
    }),
    {
      name: 'live-table-head-store',
    },
  ),
);
