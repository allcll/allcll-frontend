import { ZeroContent } from './ZeroContent';

interface IZeroElementRow {
  col: number;
  title: string;
  description?: string;
}

export function ZeroElementRow({ col, title, description }: IZeroElementRow) {
  return (
    <tr>
      <td colSpan={col} className="py-4 text-center">
        <ZeroContent title={title} description={description} />
      </td>
    </tr>
  );
}
