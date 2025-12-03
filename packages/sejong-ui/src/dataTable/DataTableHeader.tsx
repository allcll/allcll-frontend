import type { ColumnDefinition } from './types';

interface DataTableHeaderProps<T> {
  columns: ColumnDefinition<T>[];
}

function DataTableHeader<T>({ columns }: Readonly<DataTableHeaderProps<T>>) {
  return (
    <thead className="bg-gray-100">
      <tr className="text-nowrap">
        {columns.map(column => (
          <th key={String(column.header)} className="border border-gray-300 px-2 py-1">
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default DataTableHeader;