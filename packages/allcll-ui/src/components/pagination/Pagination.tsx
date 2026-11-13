import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { INTERACTION } from '../../config';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const ELLIPSIS = 'ellipsis' as const;

function getPageItems(page: number, totalPages: number): (number | typeof ELLIPSIS)[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const start = Math.max(2, Math.min(page - 1, totalPages - 4));
  const end = Math.min(totalPages - 1, Math.max(page + 1, 5));
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return [1, ...(start > 2 ? [ELLIPSIS] : []), ...middle, ...(end < totalPages - 1 ? [ELLIPSIS] : []), totalPages];
}

const BUTTON_CLASS = `flex items-center justify-center min-w-8 h-8 px-2 rounded-md text-sm ${INTERACTION.pressable}`;

function Pagination({ page, totalPages, onPageChange, className = '' }: Readonly<PaginationProps>) {
  const arrowClass = `${BUTTON_CLASS} text-fg-muted hover:bg-surface-muted disabled:text-fg-disabled disabled:hover:bg-transparent disabled:cursor-not-allowed`;

  return (
    <nav aria-label="페이지 이동" className={`flex items-center justify-center gap-1 ${className}`}>
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={arrowClass}
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      {getPageItems(page, totalPages).map((item, index) =>
        item === ELLIPSIS ? (
          <span key={`${ELLIPSIS}-${index}`} className="min-w-8 text-center text-sm text-fg-subtle">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => item !== page && onPageChange(item)}
            className={`${BUTTON_CLASS} ${
              item === page
                ? 'bg-primary-subtle text-primary-500 font-semibold'
                : 'text-fg-secondary hover:bg-surface-muted'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={arrowClass}
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </nav>
  );
}

export default Pagination;
