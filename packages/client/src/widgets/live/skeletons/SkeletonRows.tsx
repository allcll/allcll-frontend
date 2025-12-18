/**
 * TODO: shared로 옮겨야함.
 * @param param0
 * @returns
 */
function SkeletonRows({ col, row }: Readonly<{ col: number; row: number }>) {
  return (
    <>
      {Array.from({ length: row }).map((_, rowIdx) => (
        <tr className="animate-pulse border-t border-gray-200 h-10" key={'skeleton-row-' + rowIdx}>
          {Array.from({ length: col }).map((_, colIdx) => (
            <td className="bg-gray-300" key={`skeleton-td-${colIdx}-${rowIdx}`} colSpan={-1} />
          ))}
        </tr>
      ))}
    </>
  );
}

export default SkeletonRows;
