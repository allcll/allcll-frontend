import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';
import Chip from '@/components/chip/Chip';

const meta: Meta<typeof Popover> = {
  title: 'AllcllUI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>
        <Chip label="popover 열기" variant="select" selected={false} />
      </Popover.Trigger>

      <Popover.Content>
        <div className="text-sm text-gray-700">
          Popover 내용입니다.
          <br />
          여기에 다양한 컴포넌트를 넣을 수 있어요.
        </div>
      </Popover.Content>
    </Popover>
  ),
};
