import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const createColumnStore = <T>(tableType: string, DefaultHeadTitles: HeadTitle<T>[]) => {
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
