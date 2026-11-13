import type { Meta, StoryObj } from '@storybook/react-vite';
import Flex from './Flex';
import Chip from '../chip/Chip';

const ITEMS = ['1학년', '2학년', '3학년', '4학년'];

const meta = {
  title: 'Layout/Flex',
  component: Flex,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '안에 든 요소를 가로나 세로로 늘어놓고 정렬과 간격을 정합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: { description: '늘어놓는 방향', control: 'radio', options: ['row', 'column'] },
    wrap: { description: '넘치면 다음 줄로 넘길지 여부', control: 'boolean' },
    justify: {
      description: '늘어놓는 방향의 정렬',
      control: 'radio',
      options: ['start', 'center', 'end', 'between'],
    },
    align: {
      description: '늘어놓는 방향과 수직인 쪽의 정렬',
      control: 'radio',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    gap: {
      description: '요소 사이 간격(Tailwind 간격 단위)',
      control: 'select',
      options: [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8],
    },
    as: { description: '렌더링할 요소', control: false },
    children: { description: '안에 들어갈 요소', control: false },
    className: { table: { disable: true } },
  },
  args: {
    direction: 'row',
    wrap: false,
    justify: 'start',
    align: 'stretch',
    gap: 2,
  },
  render: args => (
    <div className="w-80 rounded-md border border-dashed border-line-strong p-2">
      <Flex {...args}>
        {ITEMS.map(item => (
          <Chip key={item} label={item} selected={false} />
        ))}
      </Flex>
    </div>
  ),
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
