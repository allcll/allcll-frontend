import SearchSvg from '@/assets/search.svg?react';

function ZeroListError() {
  return (
    <div className="flex flex-col h-full gap-2 pt-5 w-full items-center justify-center">
      <SearchSvg className="w-7 h-7" />
      <p className="text-md text-gray-500">검색 결과가 없습니다.</p>
    </div>
  );
}

export default ZeroListError;
