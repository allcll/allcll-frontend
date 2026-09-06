import { forwardRef, type SVGProps } from 'react';

/**
 * Carbon Icons에 대응하는 아이콘이 없는 경우 사용하는 커스텀 아이콘
 */
interface CustomIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const LogoKakaoTalkIcon = forwardRef<SVGSVGElement, CustomIconProps>(function LogoKakaoTalkIcon(
  { size = 16, children, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="-4 -4.1 44 44"
      fill="currentColor"
      {...rest}
    >
      <path d="M18,1C8.058,1 0,7.256 0,14.973C0,19.771 3.117,24.003 7.863,26.519L5.866,33.849C5.689,34.498 6.427,35.014 6.993,34.638L15.747,28.833C16.485,28.904 17.236,28.946 18,28.946C27.941,28.946 36,22.689 36,14.973C36,7.256 27.941,1 18,1Z" />
      {children}
    </svg>
  );
});
