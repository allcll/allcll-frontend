import type { ReactNode } from 'react';
import DataTableHeader from './DataTableHeader';
import DataTableBody from './DataTableBody';
import Empty from './Empty.tsx';
import type { ColumnDefinition } from './types';

interface DataTableProps<T> {
  /**
   * An array of column definition objects that define the table's structure.
   */
  columns: ColumnDefinition<T>[];
  /**
   * An array of data objects to be displayed in the table rows.
   */
  data: T[];
  /**
   * Optional CSS class name to apply to the `<table>` element.
   */
  className?: string;
  /**
   * An optional React node to display when the `data` array is empty.
   * If not provided, the table body will be empty.
   */
  emptyComponent?: ReactNode;
}

/**
 * A generic and reusable data table component.
 * It dynamically renders columns and rows based on the provided `columns` and `data` props.
 */
function DataTable<T extends object>({
  columns,
  data,
  className = 'w-full border border-gray-300 border-t-3 border-t-black text-center text-xs text-nowrap',
  emptyComponent = <Empty />,
}: DataTableProps<T>) {
  const hasData = data && data.length > 0;

  return (
    <div className="overflow-x-auto min-h-[300px] border-gray-300">
      <table className={className}>
        <DataTableHeader columns={columns} />
        {hasData ? <DataTableBody columns={columns} data={data} /> : emptyComponent}
      </table>
    </div>
  );
}

export default DataTable;
