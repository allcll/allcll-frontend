import { useState, useCallback } from 'react';

const STORAGE_KEY = 'allcll-read-notices';

function getReadIds(): Set<number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored) as number[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useNoticeRead() {
  const [readIds, setReadIds] = useState<Set<number>>(getReadIds);

  const markAsRead = useCallback((id: number) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const isRead = (id: number) => readIds.has(id);

  return { isRead, markAsRead };
}
