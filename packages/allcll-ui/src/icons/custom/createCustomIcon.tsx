import { forwardRef, type SVGProps } from 'react';

/**
 * Lucide에 대응하는 아이콘이 없는 경우 사용하는 커스텀 아이콘
 */
export interface CustomIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const custom = (displayName: string, viewBox: string, render: () => React.ReactNode) => {
  const Icon = forwardRef<SVGSVGElement, CustomIconProps>(function CustomIcon({ size = 16, children, ...rest }, ref) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        fill="currentColor"
        {...rest}
      >
        {render()}
        {children}
      </svg>
    );
  });
  Icon.displayName = displayName;
  return Icon;
};
