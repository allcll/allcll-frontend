type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'text' | 'contain' | 'outlined' | 'ghost';

type ButtonSize = 'small' | 'medium' | 'large';

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean;
}

function Button({ variant, size, children, disabled, ...rest }: IButton) {
  const buttonClass = 'flex flex-row gap-1 cursor-pointer rounded-lg';
  const variantClass = getVariantClass(variant);
  const sizeClass = getSizeClass(size);
  const finalClassName = `${buttonClass} ${variantClass} ${sizeClass}`.trim();

  return (
    <button className={finalClassName} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export default Button;

function getVariantClass(variant: string) {
  switch (variant) {
    case 'primary':
      return 'bg-blue-500 text-white hover:bg-blue-600';
    case 'secondary':
      return 'bg-gray-100  hover:bg-gray-300';
    case 'text':
      return 'bg-transparent text-blue-500 hover:text-blue-600';
    case 'outlined':
      return 'bg-transparent border border-gray-700 hover:bg-gray-100';
    case 'danger':
      return 'bg-rose-400 text-white hover:bg-rose-500';
    case 'ghost':
      return 'bg-gray-100  border border-gray-200 text-gray-700 hover:bg-gray-200';
    default:
      return '';
  }
}

function getSizeClass(size: string) {
  switch (size) {
    case 'small':
      return 'text-sm px-4 py-2';
    case 'medium':
      return 'text-base px-5 py-2';
    case 'large':
      return 'text-lg px-6 py-3';
    default:
      return '';
  }
}
