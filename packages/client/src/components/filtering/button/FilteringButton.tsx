import FilterSvg from '@/assets/filter.svg?react';

function FilteringButton({ handleOpenFilter }: { handleOpenFilter: () => void }) {
  return (
    <button
      className="p-2 rounded-md flex gap-2 text-sm items-center border border-gray-400 bg-white hover:bg-gray-100"
      aria-label="필터 수정"
      title="필터 수정"
      onClick={handleOpenFilter}
    >
      <FilterSvg className="w-4 h-4 text-gray-600 hover:text-blue-500 transition-colors" />
    </button>
  );
}

export default FilteringButton;
