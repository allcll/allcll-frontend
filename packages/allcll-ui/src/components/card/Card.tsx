import { CardContent } from './CardContent';
import CardHeader from './CardHeader';

interface ICard {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'elevated' | 'outlined' | 'filled';
  className?: string;
}

function CardRoot({ children, size, variant, className }: ICard) {
  const sizeClass = getSizeClass(size || 'medium');
  const variantClass = getVariantClass(variant);
  const defaultClass = 'rounded-lg';

  return <div className={`card ${defaultClass} ${sizeClass} ${variantClass} ${className || ''}`}>{children}</div>;
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Content: CardContent,
});

export default Card;

function getSizeClass(size: 'small' | 'medium' | 'large') {
  switch (size) {
    case 'small':
      return 'px-4 py-4 text-sm';
    case 'medium':
      return 'p-4 text-base';
    case 'large':
      return 'px-10 py-4 text-lg';
    default:
      return '';
  }
}

function getVariantClass(variant: 'elevated' | 'outlined' | 'filled' = 'elevated') {
  switch (variant) {
    case 'elevated':
      return 'bg-white shadow-md';
    case 'outlined':
      return 'bg-white border border-gray-200';
    case 'filled':
      return 'bg-gray-50 shadow-sm rounded-lg p-4 border border-gray-200 hover:shadow-md';
    default:
      return '';
  }
}
