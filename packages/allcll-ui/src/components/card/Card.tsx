type CardVariant = 'elevated' | 'outlined' | 'filled';

interface ICard {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
}

const VARIANT_CLASS: Record<CardVariant, string> = {
  elevated: 'bg-white shadow-md',
  outlined: 'bg-white border border-gray-200',
  filled: 'bg-gray-50 shadow-sm border border-gray-200',
};

function Card({ children, variant = 'elevated', className = '' }: ICard) {
  return <div className={`rounded-lg p-4 text-base ${VARIANT_CLASS[variant]} ${className}`}>{children}</div>;
}

export { Card };
export default Card;
