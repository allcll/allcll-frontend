import { useState } from 'react';

export function usePagination<T>(items: T[], resetKey: string, pageSize = 10) {
  const [page, setPage] = useState(1);
  const [prevResetKey, setPrevResetKey] = useState(resetKey);

  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  return {
    page: currentPage,
    totalPages,
    setPage,
    pageItems: items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
  };
}
