import { Flex } from '@allcll/allcll-ui';
import SearchSvg from '@/assets/search.svg?react';

interface ZeroContentProps {
  title: string;
  description?: string;
}

export function ZeroContent({ title, description }: ZeroContentProps) {
  return (
    <Flex direction="flex-col" align="items-center" gap="gap-1">
      <SearchSvg className="w-7 h-7" />
      <p className="text-gray-500 font-medium">{title}</p>
      {description && <p className="text-gray-400 text-xs">{description}</p>}
    </Flex>
  );
}
