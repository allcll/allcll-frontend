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

function SkeletonRow({length}: {length: number}) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length }).map((_, index) => (
        <td className="" key={index}>
          <div className="h-4 bg-gray-300 rounded"></div>
        </td>
      ))}
    </tr>
  );
}

export default SkeletonTable;