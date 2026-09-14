import { FilterIcon } from '@allcll/allcll-ui';
import { IconButton } from '@allcll/allcll-ui';

function FilteringButton({ handleOpenFilter }: { handleOpenFilter: () => void }) {
  return (
    <IconButton
      aria-label="필터 수정"
      title="필터 수정"
      label="필터 수정"
      variant="contain"
      icon={<FilterIcon className="w-4 h-4 text-gray-400" />}
      onClick={handleOpenFilter}
    />
  );
}

export default FilteringButton;
