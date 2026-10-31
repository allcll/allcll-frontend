import { EmptyState, SearchIcon } from '@allcll/allcll-ui';

interface IZeroElementRow {
  col: number;
  title: string;
  description?: string;
}

export function ZeroElementRow({ col, title, description }: IZeroElementRow) {
  return (
    <tr>
      <td colSpan={col} className="py-4 text-center">
        <EmptyState icon={SearchIcon} title={title} description={description} className="mt-2" />
      </td>
    </tr>
  );
}
