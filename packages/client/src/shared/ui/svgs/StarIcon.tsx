import { StarIcon as StarOutlineIcon, StarFilledIcon } from '@allcll/allcll-ui';

function StarIcon({ disabled }: { disabled: boolean }) {
  return disabled ? (
    <StarOutlineIcon className="w-4 h-4 text-gray-400" />
  ) : (
    <StarFilledIcon className="w-4 h-4 text-yellow-400" />
  );
}

export default StarIcon;
