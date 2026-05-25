import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  language: 'vi' | 'en';
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  language,
}) => {
  if (totalItems <= pageSize) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const summary = language === 'vi'
    ? `${start}-${end} / ${totalItems} kết quả`
    : `${start}-${end} of ${totalItems} results`;

  return (
    <div className="flex items-center justify-between gap-3 rounded-b-xl border-t border-gray-100 bg-white px-3 py-3 text-xs text-gray-500">
      <span className="font-medium">{summary}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50"
          aria-label={language === 'vi' ? 'Trang trước' : 'Previous page'}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-16 text-center font-bold text-gray-700">
          {currentPage}/{totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50"
          aria-label={language === 'vi' ? 'Trang sau' : 'Next page'}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
