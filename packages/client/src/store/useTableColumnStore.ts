import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SseSubject } from '@/hooks/server/useSSESeats.ts';
import { Wishes } from '@/utils/types.ts';
import { IPreRealSeat } from '@/hooks/server/usePreRealSeats.ts';

export interface HeadTitle<T> {
  title: string;
  visible: boolean;
  key: keyof T;
}

interface IColumnStore<T> {
  tableTitles: HeadTitle<T>[];
  setTableTitles: (titles: HeadTitle<T>[]) => void;
  resetTableTitles: () => void;
}

const createColumnStore = <T>(tableType: string, DefaultHeadTitles: HeadTitle<T>[]) => {
  return create<IColumnStore<T>>()(
    persist(
      set => ({
        tableTitles: DefaultHeadTitles,
        setTableTitles: titles => set({ tableTitles: titles }),
        resetTableTitles: () => set({ tableTitles: DefaultHeadTitles }),
      }),
      { name: `${tableType}-table-head-store` },
    ),
  );
};

////

const LiveColumn: HeadTitle<SseSubject>[] = [
  { title: '과목코드', visible: true, key: 'code' },
  { title: '과목명', visible: true, key: 'name' },
  { title: '담당교수', visible: true, key: 'professor' },
  { title: '여석', visible: true, key: 'seat' },
  { title: '최근갱신', visible: true, key: 'queryTime' },

  { title: '학과명', visible: false, key: 'manageDeptNm' },
  { title: '수강학년', visible: false, key: 'studentYear' },
  { title: '수업시간', visible: false, key: 'lesnTime' },
  { title: '강의실', visible: false, key: 'lesnRoom' },
  { title: '학점', visible: false, key: 'tmNum' },
  { title: '비고', visible: false, key: 'remark' },
  { title: '수업유형', visible: false, key: 'curiTypeCdNm' },
  { title: '수업언어', visible: false, key: 'curiLangNm' },
];

export const useLiveTableStore = createColumnStore('live', LiveColumn);

////

const WishesColumns: HeadTitle<Wishes & IPreRealSeat>[] = [
  { title: '학수번호', visible: true, key: 'subjectCode' },
  { title: '분반', visible: true, key: 'classCode' },
  { title: '개설 학과', visible: true, key: 'departmentName' },
  { title: '과목명', visible: true, key: 'subjectName' },
  { title: '교수명', visible: true, key: 'professorName' },
  { title: '관심', visible: true, key: 'totalCount' },
  { title: '여석', visible: true, key: 'seat' },

  { title: '수강학년', visible: false, key: 'studentYear' },
  { title: '수업시간', visible: false, key: 'lesnTime' },
  { title: '강의실', visible: false, key: 'lesnRoom' },
  { title: '학점', visible: false, key: 'tmNum' },
  { title: '비고', visible: false, key: 'remark' },
  { title: '수업유형', visible: false, key: 'curiTypeCdNm' },
  { title: '수업언어', visible: false, key: 'curiLangNm' },
];

export const useWishesTableStore = createColumnStore('wishes', WishesColumns);
