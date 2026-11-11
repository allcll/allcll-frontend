import { getWishesBadgeColor } from '@/shared/config/colors';
import { Badge } from '@allcll/allcll-ui';

interface BasketBadgeProps {
  wishCount: number;
  formatter?: (value: string | number) => string | number;
}

function BasketBadge({ wishCount, formatter = value => value }: Readonly<BasketBadgeProps>) {
  const isValid = wishCount !== null && wishCount !== undefined && wishCount >= 0;
  const color = getWishesBadgeColor(wishCount);
  const value = isValid ? wishCount : '-';

  return <Badge color={color}>{formatter(value)}</Badge>;
}

export default BasketBadge;
