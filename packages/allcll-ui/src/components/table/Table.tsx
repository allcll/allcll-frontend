import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type RefObject } from 'react';
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from '../../icons';

type Align = 'left' | 'center';

const ALIGN_CLASS: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
};

interface TableProps extends ComponentPropsWithoutRef<'table'> {
  wrapperClassName?: string;
  scrollClassName?: string;
}

function TableRoot({ wrapperClassName = '', scrollClassName = '', className = '', children, ...rest }: TableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const overflow = useHorizontalOverflow(scrollRef);

  return (
    <div className={`relative border border-line rounded-md overflow-hidden ${wrapperClassName}`}>
      <div ref={scrollRef} className={`overflow-x-auto ${scrollClassName}`}>
        <table
          className={`w-full text-sm whitespace-nowrap has-[[data-table-row]]:shadow-[0_1px_0_var(--color-line)] ${className}`}
          {...rest}
        >
          {children}
        </table>
      </div>

      {overflow.left && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-gray-900/10 to-transparent" />
      )}
      {overflow.right && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-gray-900/10 to-transparent" />
      )}
    </div>
  );
}

interface TableHeadProps extends ComponentPropsWithoutRef<'thead'> {
  /** 세로로 스크롤해도 위에 고정할지 여부 */
  sticky?: boolean;
}

export function TableHead({ sticky = false, className = '', children, ...rest }: TableHeadProps) {
  return (
    <thead className={`${sticky ? 'sticky top-0 z-content' : ''} ${className}`} {...rest}>
      <tr className="bg-surface-subtle">{children}</tr>
    </thead>
  );
}

interface TableCellProps {
  /** 글자 정렬 */
  align?: Align;
}

type SortDirection = 'asc' | 'desc';

type TableHeaderCellProps = TableCellProps &
  ComponentPropsWithoutRef<'th'> & {
    /** 정렬 방향, 정렬하지 않으면 null */
    sortDirection?: SortDirection | null;
    /** 열 제목을 누를 때 호출하는 함수 */
    onSort?: () => void;
  };

export function TableHeaderCell({
  align = 'center',
  sortDirection,
  onSort,
  className = '',
  children,
  ...rest
}: TableHeaderCellProps) {
  const cellClassName = `px-4 py-2 font-semibold ${ALIGN_CLASS[align]} ${className}`;

  if (!onSort) {
    return (
      <th className={cellClassName} {...rest}>
        {children}
      </th>
    );
  }

  const SortIcon =
    sortDirection === 'asc' ? ChevronUpIcon : sortDirection === 'desc' ? ChevronDownIcon : ChevronsUpDownIcon;
  const ariaSort = sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none';

  return (
    <th aria-sort={ariaSort} className={cellClassName} {...rest}>
      <button type="button" onClick={onSort} className="inline-flex items-center gap-1 cursor-pointer">
        {children}
        <SortIcon className={`w-3.5 h-3.5 ${sortDirection ? 'text-fg-muted' : 'text-fg-disabled'}`} />
      </button>
    </th>
  );
}

function TableBody(props: ComponentPropsWithoutRef<'tbody'>) {
  return <tbody {...props} />;
}

function TableRow({ className = '', ...rest }: ComponentPropsWithoutRef<'tr'>) {
  return <tr data-table-row className={`h-10 border-t border-line ${className}`} {...rest} />;
}

export function TableCell({
  align = 'center',
  className = '',
  ...rest
}: TableCellProps & ComponentPropsWithoutRef<'td'>) {
  return <td className={`px-4 py-1.5 ${ALIGN_CLASS[align]} ${className}`} {...rest} />;
}

// 가로로 넘칠 때 더 스크롤할 쪽 가장자리에 그림자를 보여주기 위해 남은 스크롤 방향을 추적
function useHorizontalOverflow(ref: RefObject<HTMLElement | null>) {
  const [overflow, setOverflow] = useState({ left: false, right: false });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const { scrollLeft, clientWidth, scrollWidth } = element;
      setOverflow({ left: scrollLeft > 0, right: scrollLeft + clientWidth < scrollWidth - 1 });
    };

    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);

    return () => {
      element.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [ref]);

  return overflow;
}

const Table = Object.assign(TableRoot, {
  Head: TableHead,
  HeaderCell: TableHeaderCell,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
});

export default Table;
