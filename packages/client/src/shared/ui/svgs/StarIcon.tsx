import StarSvg from '@/assets/star.svg?react';
import StarEnabledSvg from '@/assets/starEnabled.svg?react';

function StarIcon({ disabled }: { disabled: boolean }) {
  return disabled ? <StarSvg className="w-4 h-4" /> : <StarEnabledSvg className="w-4 h-4" />;
}

export default StarIcon;
