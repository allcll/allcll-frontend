import StarSvg from '@/assets/star.svg?react';
import StarEnabledSvg from '@/assets/starEnabled.svg?react';

function StarIcon({disabled} : {disabled: boolean}) {
  return disabled ? (
    <StarSvg className="w-5 h-5"/>
  ): (
    <StarEnabledSvg className="w-5 h-5"/>
  );
}

export default StarIcon;