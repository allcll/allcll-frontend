import type { Meta, StoryObj } from '@storybook/react-vite';
import SupportingText from './SupportingText';

const meta = {
  title: 'AllcllUI/SupportingText',
  component: SupportingText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SupportingText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '서비스 전체에서 사용할 학기를 설정합니다.',
  },
};
