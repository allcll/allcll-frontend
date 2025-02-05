interface SkeletonTableProps {
  headerNames: string[];
}

function SkeletonTable({headerNames}: SkeletonTableProps) {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          { headerNames.map((name, index) => (
            <th className="py-2" key={index}>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonRow key={index} length={headerNames.length} />
        ))}
      </tbody>
    </table>
  );
}

export function SkeletonRow({length}: {length: number}) {
  return (
    <tr className="animate-pulse border-t border-gray-200 h-10">
      {Array.from({ length }).map((_, index) => (
        <td className="bg-gray-300" key={index} colSpan={-1}></td>
      ))}
    </tr>
  );
}

export default SkeletonTable;