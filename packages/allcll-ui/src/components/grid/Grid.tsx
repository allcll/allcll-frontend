import type { ComponentPropsWithoutRef } from 'react';

const COLUMNS_CLASS = {
  base: { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' },
  sm: { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4' },
  md: { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' },
  lg: { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' },
  xl: { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4' },
};

const GAP_CLASS = { 0: 'gap-0', 1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4', 5: 'gap-5', 6: 'gap-6', 8: 'gap-8' };

type ColumnCount = keyof typeof COLUMNS_CLASS.base;
type Breakpoint = keyof typeof COLUMNS_CLASS;

interface GridProps extends ComponentPropsWithoutRef<'div'> {
  columns: Partial<Record<Breakpoint, ColumnCount>>;
  gap?: keyof typeof GAP_CLASS;
}

function Grid({ columns, gap = 0, className, children, ...rest }: GridProps) {
  const { base = 2, ...responsive } = columns;
  const columnClasses = [
    COLUMNS_CLASS.base[base],
    ...(Object.keys(responsive) as Exclude<Breakpoint, 'base'>[]).map(bp => COLUMNS_CLASS[bp][responsive[bp]!]),
  ];

  const finalClass = ['grid', GAP_CLASS[gap], ...columnClasses, className].filter(Boolean).join(' ');

  return (
    <div className={finalClass} {...rest}>
      {children}
    </div>
  );
}

export default Grid;
