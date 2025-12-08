import type { ColumnDefinition } from './types';

interface DataTableBodyProps<T> {
  columns: ColumnDefinition<T>[];
  data: T[];
  keyInfo: ((_: T) => string) | keyof T;
}

function DataTableBody<T>({ columns, data, keyInfo }: Readonly<DataTableBodyProps<T>>) {
  return (
    <tbody>
      {data.map((item, rowIndex) => {
        const rowId = typeof keyInfo === 'function' ? keyInfo(item) : item[keyInfo];

        return (
          <tr key={`row-${rowId}`}>
            {columns.map(column => (
              <td key={`cell-${rowId}-${column.header}`} className="border border-gray-300 px-2 py-1">
                {column.cell(item, rowIndex)}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
}

export default DataTableBody;
