import type { ColumnDefinition } from './types';

interface DataTableBodyProps<T> {
  columns: ColumnDefinition<T>[];
  data: T[];
}

function DataTableBody<T>({ columns, data }: Readonly<DataTableBodyProps<T>>) {
  // 'a.b.c' 형태의 깊은 경로에서 값을 안전하게 가져오는 헬퍼 함수
  const getDeepValue = (obj: any, path: string): any => {
    return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
  };

  return (
    <tbody>
      {data.map((item, rowIndex) => (
        <tr key={`row-${rowIndex}`}>
          {columns.map((column, colIndex) => (
            <td key={`cell-${rowIndex}-${colIndex}`} className="border border-gray-300 px-2 py-1">
              {/* cell 렌더링 함수가 있으면 그것을 사용, 없으면 accessor로 값을 찾아서 표시 */}
              {column.cell ? column.cell(item) : getDeepValue(item, column.accessorKey as string)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default DataTableBody;
