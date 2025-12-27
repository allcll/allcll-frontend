import { getWishesColor } from '@/shared/config/colors';

function ColoredText({ wishCount }: Readonly<{ wishCount: number }>) {
  const style = getWishesColor(wishCount);

  return wishCount >= 0 ? (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>{wishCount}</span>
  ) : (
    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-300">-</span>
  );
}

export default ColoredText;
