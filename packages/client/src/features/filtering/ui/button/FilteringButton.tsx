import { FilterIcon, IconButton } from '@allcll/allcll-ui';

function FilteringButton({ handleOpenFilter, className }: { handleOpenFilter: () => void; className?: string }) {
  return (
    <IconButton
      aria-label="필터 수정"
      title="필터 수정"
      label="필터 수정"
      variant="contain"
      icon={<FilterIcon className="w-4 h-4" />}
      onClick={handleOpenFilter}
      className={className}
    />
  );
}

export default FilteringButton;
