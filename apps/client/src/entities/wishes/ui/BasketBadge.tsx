import { getWishesVariant } from '@/shared/config/colors';
import { Badge } from '@allcll/allcll-ui';

interface BasketBadgeProps {
  wishCount: number;
  formatter?: (value: string | number) => string | number;
}

function BasketBadge({ wishCount, formatter = value => value }: Readonly<BasketBadgeProps>) {
  const isValid = wishCount !== null && wishCount !== undefined && wishCount >= 0;
  const variant = getWishesVariant(wishCount);
  const value = isValid ? wishCount : '-';

  return <Badge variant={variant}>{formatter(value)}</Badge>;
}

export default BasketBadge;
