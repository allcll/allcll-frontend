import { FilterIcon, IconButton } from '@allcll/allcll-ui';

function FilteringButton({ handleOpenFilter, className }: { handleOpenFilter: () => void; className?: string }) {
  return (
    <IconButton
      size="medium"
      aria-label="필터 수정"
      title="필터 수정"
      label="필터 수정"
      variant="contain"
      icon={<FilterIcon />}
      onClick={handleOpenFilter}
      className={className}
    />
  );
}

export default FilteringButton;
