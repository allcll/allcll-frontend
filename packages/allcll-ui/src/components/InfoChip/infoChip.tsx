type InfoChipVariants = 'success' | 'warning' | 'danger';

interface IInfoChip {
  variant: InfoChipVariants;
  children: React.ReactNode;
}

function InfoChip({ variant, children }: IInfoChip) {
  const variantClass = getVariantClass(variant);

  return <div className={`${variantClass} px-4 py-2 rounded-full `}>{children}</div>;
}

export default InfoChip;

function getVariantClass(variant: InfoChipVariants) {
  switch (variant) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'danger':
      return 'bg-rose-100 text-rose-800';
    default:
      return '';
  }
}
