import { useMemo, useState } from 'react';

export const usePagination = <T,>(items: T[], pageSize: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, pageSize, safePage]);

  return {
    currentPage: safePage,
    pageSize,
    paginatedItems,
    setCurrentPage,
    totalItems,
    totalPages,
  };
};
