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
    className: 'w-48',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
