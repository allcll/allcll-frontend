import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { type Notice } from '@/entities/notices/model/notice';

interface NoticeReadStore {
  readMap: Record<number, string>;
  markAsRead: (notice: Notice) => void;
}

const STORAGE_KEY = 'allcll-read-notices';

export const useNoticeReadStore = create<NoticeReadStore>()(
  persist(
    set => ({
      readMap: {},
      markAsRead: notice =>
        set(state => ({
          readMap: { ...state.readMap, [notice.id]: notice.updatedAt },
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ readMap: state.readMap }),
    },
  ),
);

export function useIsNoticeRead() {
  const readMap = useNoticeReadStore(s => s.readMap);
  return (notice: Notice) => readMap[notice.id] === notice.updatedAt;
}
