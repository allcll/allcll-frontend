import type { Meta, StoryObj } from '@storybook/react-vite';
import Select from './Select';

const options = (
  <>
    <option value="mon">월요일</option>
    <option value="tue">화요일</option>
    <option value="wed">수요일</option>
  </>
);

const meta = {
  title: 'AllcllUI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: options,
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {
  args: {
    size: 'medium',
    className: 'w-48',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Disabled: Story = {
  args: {
    size: 'medium',
    className: 'w-48',
    disabled: true,
  },
};
