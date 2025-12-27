import { getSeatColor } from '@/shared/config/colors';

function ColoredPreSeat({ seat }: Readonly<{ seat: number }>) {
  return seat >= 0 ? (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeatColor(seat)}`}>{seat}</span>
  ) : (
    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-300">-</span>
  );
}

export default ColoredPreSeat;
