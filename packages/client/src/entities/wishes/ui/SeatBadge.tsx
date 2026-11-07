import { getSeatBadgeColor } from '@/shared/config/colors';
import { Badge } from '@allcll/allcll-ui';

interface SeatBadgeProps {
  seat: number;
  formatter?: (value: string | number) => string | number;
}

function SeatBadge({ seat, formatter = value => value }: Readonly<SeatBadgeProps>) {
  const isValid = seat !== null && seat !== undefined && seat >= 0;
  const color = getSeatBadgeColor(seat);
  const value = isValid ? seat : '-';

  return <Badge color={color}>{formatter(value)}</Badge>;
}

export default SeatBadge;
