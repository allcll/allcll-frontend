import { getSeatVariant } from '@/shared/config/colors';
import Badge from './Badge.tsx';

function SeatBadge({ seat }: Readonly<{ seat: number }>) {
  const isValid = seat !== null && seat !== undefined && seat >= 0;
  const variant = getSeatVariant(seat);
  const value = isValid ? seat : '-';

  return <Badge variant={variant}>{value}</Badge>;
}

export default SeatBadge;
