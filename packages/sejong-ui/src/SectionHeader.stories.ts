import type { Meta, StoryObj } from '@storybook/react-vite';
import SectionHeader from './SectionHeader';

const meta = {
  title: 'SejongUI/SectionHeader',
  component: SectionHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '수강 대상 교과목',
  },
};

export const LongTitle: Story = {
  args: {
    children: '이것은 매우 긴 섹션 헤더 제목입니다. 텍스트가 어떻게 표시되는지 확인하기 위함입니다.',
  },
};
