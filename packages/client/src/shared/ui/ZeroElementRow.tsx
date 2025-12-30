import { Flex } from '@allcll/allcll-ui';
import SearchSvg from '@/assets/search.svg?react';

interface IZeroElementRow {
  col: number;
  title: string;
  description?: string;
}

export function ZeroElementRow({ col, title, description }: Readonly<IZeroElementRow>) {
  return (
    <tr>
      <td colSpan={col} className="text-center py-4">
        <Flex direction="flex-col" align="items-center">
          <SearchSvg className="w-12 h-12" />
          <p className="text-gray-500 font-bold mt-4">{title}</p>
          {description && <p className="text-gray-400 text-xs mt-1">{description}</p>}
        </Flex>
      </td>
    </tr>
  );
}
