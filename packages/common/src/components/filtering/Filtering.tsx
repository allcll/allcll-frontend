import { Flex, Popover } from '@allcll/allcll-ui';

interface IFiltering {
  label: string;
  className?: string;
  selected: boolean;
  children: React.ReactNode;
}

/**
 * 기본 필터링 컴포넌트 입니다.
 * Chip + 필터링할 수 있는 옵션들로 이루어진 컴포넌트입니다.
 * @param param0
 * @returns
 */
function Filtering({ label, selected, children, className = '' }: Readonly<IFiltering>) {
  return (
    <Popover>
      <Popover.Trigger selected={selected} label={label} />
      <Popover.Content>
        <Flex direction="flex-col" gap="gap-4" className={className}>
          {children}
        </Flex>
      </Popover.Content>
    </Popover>
  );
}

export default Filtering;
