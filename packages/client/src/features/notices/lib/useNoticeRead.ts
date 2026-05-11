import { useState, useCallback } from 'react';
import { type Notice } from '@/entities/notices/model/notice';

const STORAGE_KEY = 'allcll-read-notices';

type ReadMap = Record<number, string>;

function getReadMap(): ReadMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ReadMap) : {};
  } catch {
    return {};
  }
}

function saveReadMap(map: ReadMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function useNoticeRead() {
  const [readMap, setReadMap] = useState<ReadMap>(getReadMap);

  const markAsRead = useCallback((notice: Notice) => {
    setReadMap(prev => {
      const next = { ...prev, [notice.id]: notice.updatedAt };
      saveReadMap(next);
      return next;
    });
  }, []);

  const isRead = (notice: Notice) => readMap[notice.id] === notice.updatedAt;

  return { isRead, markAsRead };
}
