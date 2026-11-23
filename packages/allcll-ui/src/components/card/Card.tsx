type CardVariant = 'elevated' | 'outlined' | 'filled';

interface ICard {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
}

const VARIANT_CLASS: Record<CardVariant, string> = {
  elevated: 'bg-surface shadow-md',
  outlined: 'bg-surface border border-line',
  filled: 'bg-surface-subtle shadow-sm border border-line',
};

function Card({ children, variant = 'elevated', className = '' }: ICard) {
  return <div className={`rounded-lg p-4 text-base ${VARIANT_CLASS[variant]} ${className}`}>{children}</div>;
}

export { Card };
export default Card;
