import type { ComponentPropsWithoutRef } from 'react';

type BreakpointColumns = {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

interface GridProps extends ComponentPropsWithoutRef<'div'> {
  columns: BreakpointColumns;
  gap?: `gap-${number}`;
}

function Grid({ columns, gap = 'gap-0', className, children, ...rest }: GridProps) {
  const classes: string[] = ['grid', gap];

  const baseCols = columns.base ?? 2;
  classes.push(`grid-cols-${baseCols}`);

  if (columns.base) classes.push(`grid-cols-${columns.base}`);
  if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
  if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
  if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
  if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);

  const finalClass = classes.join(' ') + (className ? ` ${className}` : '');

  return (
    <div className={finalClass} {...rest}>
      {children}
    </div>
  );
}

export default Grid;
