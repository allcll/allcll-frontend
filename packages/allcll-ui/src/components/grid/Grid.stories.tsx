import type { Meta, StoryObj } from '@storybook/react-vite';
import Grid from './Grid';

const ITEMS = ['전공필수', '전공선택', '교양필수', '균형교양', '기초교양', '자유선택'];

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '안에 든 요소를 같은 폭의 열로 나눠 배치합니다. 카드, 칩, 입력칸처럼 같은 종류의 요소를 줄과 열을 맞춰 늘어놓을 때 사용하고, 화면 폭에 따라 열 개수를 다르게 정할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: { description: '화면 폭 구간(base, sm, md, lg, xl)별 열 개수', control: 'object' },
    gap: { description: '요소 사이 간격(Tailwind 간격 단위)', control: 'select', options: [0, 1, 2, 3, 4, 5, 6, 8] },
    children: { description: '안에 들어갈 요소', control: false },
    className: { table: { disable: true } },
  },
  args: {
    columns: { base: 1, md: 3 },
    gap: 2,
  },
  render: args => (
    <Grid {...args}>
      {ITEMS.map(item => (
        <div key={item} className="rounded-md bg-surface-muted px-4 py-3 text-sm text-fg-secondary">
          {item}
        </div>
      ))}
    </Grid>
  ),
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
