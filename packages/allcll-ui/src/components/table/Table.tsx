import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type RefObject } from 'react';

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
    <div className={`relative border border-gray-200 rounded-md overflow-hidden ${wrapperClassName}`}>
      <div ref={scrollRef} className={`overflow-x-auto ${scrollClassName}`}>
        <table className={`w-full text-sm whitespace-nowrap ${className}`} {...rest}>
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
  sticky?: boolean;
}

function TableHead({ sticky = false, className = '', children, ...rest }: TableHeadProps) {
  return (
    <thead className={`${sticky ? 'sticky top-0 z-content' : ''} ${className}`} {...rest}>
      <tr className="bg-gray-50">{children}</tr>
    </thead>
  );
}

interface TableCellProps {
  align?: Align;
}

function TableHeaderCell({
  align = 'center',
  className = '',
  ...rest
}: TableCellProps & ComponentPropsWithoutRef<'th'>) {
  return <th className={`px-4 py-2 font-bold ${ALIGN_CLASS[align]} ${className}`} {...rest} />;
}

function TableBody(props: ComponentPropsWithoutRef<'tbody'>) {
  return <tbody {...props} />;
}

function TableRow({ className = '', ...rest }: ComponentPropsWithoutRef<'tr'>) {
  return <tr className={`h-10 border-t border-gray-200 ${className}`} {...rest} />;
}

function TableCell({ align = 'center', className = '', ...rest }: TableCellProps & ComponentPropsWithoutRef<'td'>) {
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
