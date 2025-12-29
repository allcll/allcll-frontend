import { getWishesVariant } from '@/shared/config/colors';
import Badge from '@/entities/wishes/ui/Badge.tsx';

function BasketBadge({ wishCount }: Readonly<{ wishCount: number }>) {
  const isValid = wishCount !== null && wishCount !== undefined && wishCount >= 0;
  const variant = getWishesVariant(wishCount);
  const value = isValid ? wishCount : '-';

  return <Badge variant={variant}>{value}</Badge>;
}

export default BasketBadge;
