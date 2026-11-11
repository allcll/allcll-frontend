import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';
import PopoverTrigger from '../popover-trigger/PopoverTrigger';
import PopoverContent from '../popover-content/PopoverContent';
import Listbox from '../../listbox/Listbox';
import ListboxOption from '../../listbox/ListboxOption';
import { CheckmarkIcon } from '../../../icons';

const GRADES = ['1학년', '2학년', '3학년', '4학년'];

const meta: Meta<typeof Popover> = {
  title: 'Overlay/Popover',
  component: Popover,
  subcomponents: { 'Popover.Trigger': PopoverTrigger, 'Popover.Content': PopoverContent },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '버튼 아래에 펼쳐지는 작은 패널입니다. 필터처럼 짧은 선택을 담고, 입력이 길거나 확인이 필요한 내용은 Dialog를 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: { description: '`Popover.Trigger`, `Popover.Content` 조합', control: false },
    isOpen: { description: '열림 상태', control: false },
    onOpenChange: { description: '열림 상태가 바뀔 때 호출하는 함수', control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Playground: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger label="학년" />
      <Popover.Content>
        <div className="text-sm text-gray-700">필터 선택지가 들어가는 자리입니다.</div>
      </Popover.Content>
    </Popover>
  ),
};

export const ExampleCloseOnSelect: Story = {
  parameters: {
    docs: {
      description: {
        story: '항목을 고르면 패널이 닫히는 모습입니다.',
      },
    },
  },
  render: function Render() {
    const [grade, setGrade] = useState<string | null>(null);

    return (
      <Popover>
        <Popover.Trigger label={grade ?? '학년'} selected={!!grade} />
        <Popover.Content className="p-1">
          <Listbox aria-label="학년">
            {GRADES.map(item => (
              <Popover.Close key={item} asChild>
                <ListboxOption
                  selected={item === grade}
                  left={item}
                  right={<CheckmarkIcon className="w-4 h-4 shrink-0 text-primary-500" />}
                  onSelect={() => setGrade(item)}
                />
              </Popover.Close>
            ))}
          </Listbox>
        </Popover.Content>
      </Popover>
    );
  },
};
