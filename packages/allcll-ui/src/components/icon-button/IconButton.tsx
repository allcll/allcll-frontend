import type { ComponentPropsWithoutRef } from 'react';

type ButtonVariant = 'contain' | 'plain';
export type IconButtonSize = 'small' | 'medium' | 'large';

interface IIconButton extends ComponentPropsWithoutRef<'button'> {
  icon: React.ReactNode;
  label?: string;
  variant?: ButtonVariant;
  size: IconButtonSize;
}

const SIZE_CLASS: Record<IconButtonSize, string> = {
  small: '[&_svg]:size-3',
  medium: '[&_svg]:size-4',
  large: '[&_svg]:size-5',
};

// 아이콘이 작아도 24px 이상 눌리도록 보이지 않는 영역을 덧댐. 버튼에 relative를 주면 쓰는 쪽의 absolute를 덮어써서 안쪽 span에 둠
const HIT_AREA_CLASS =
  "relative after:absolute after:top-1/2 after:left-1/2 after:size-6 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']";

function IconButton({ icon, variant = 'plain', size, label, className = '', ...rest }: IIconButton) {
  const finalClassName = `flex flex-row items-center justify-center gap-1 ${getVariantClass(variant)} ${SIZE_CLASS[size]} ${className}`;

  return (
    <button type="button" aria-label={label} className={finalClassName} {...rest}>
      {icon && <span className={HIT_AREA_CLASS}>{icon}</span>}
    </button>
  );
}

export default IconButton;

function getVariantClass(variant: string) {
  switch (variant) {
    case 'contain':
      return 'p-2.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-300 ease-out';
    case 'plain':
      return 'rounded-md bg-transparent text-gray-700';
    default:
      return '';
  }
}
