import type { ColumnDefinition } from './types';
import { useId } from 'react';

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
      {data.map((item, rowIndex) => {
        const rowId = useId();

        return (
          <tr key={`row-${rowId}`}>
            {columns.map(column => (
              <td key={`cell-${rowId}-${useId()}`} className="border border-gray-300 px-2 py-1">
                {column.cell ? column.cell(item, rowIndex) : getDeepValue(item, column.accessorKey as string)}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
}

export default DataTableBody;
