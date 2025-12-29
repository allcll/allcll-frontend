function TableColorInfo() {
  return (
    <div className="flex justify-end items-center mt-2 text-xs text-gray-500">
      <span className="flex items-center gap-2">
        <span className="block w-4 h-4 rounded bg-green-100 ml-1" aria-label="초록색 " />
        영어로 진행되는 과목
      </span>
      <span className="flex items-center gap-2 ml-4">
        <span className="block w-4 h-4 rounded bg-gray-100 ml-1" aria-label="회색 " />
        삭제된 과목
      </span>
    </div>
  );
}

export default TableColorInfo;
