import { Skeleton } from '@allcll/allcll-ui';

function SkeletonRows({ col, row }: Readonly<{ col: number; row: number }>) {
  return (
    <>
      {Array.from({ length: row }).map((_, rowIdx) => (
        <tr className="border-t border-gray-200 h-10" key={'skeleton-row-' + rowIdx}>
          {Array.from({ length: col }).map((_, colIdx) => (
            <td className="px-2" key={`skeleton-td-${colIdx}-${rowIdx}`}>
              <Skeleton className="h-4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default SkeletonRows;
