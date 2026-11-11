import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Pagination from './Pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '여러 페이지로 나뉜 목록에서 페이지를 이동할 때 사용합니다. 페이지가 많으면 처음, 끝, 현재 페이지 주변만 보여주고 나머지는 말줄임으로 줄입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    page: { description: '현재 페이지(1부터)', control: { type: 'number', min: 1 } },
    totalPages: { description: '전체 페이지 수', control: { type: 'number', min: 1 } },
    onPageChange: { description: '페이지를 옮길 때 호출하는 함수', control: false },
    className: { table: { disable: true } },
  },
  args: {
    page: 1,
    totalPages: 5,
    onPageChange: () => {},
  },
  render: function Render(args) {
    const [page, setPage] = useState(args.page);

    useEffect(() => setPage(args.page), [args.page]);

    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ExampleManyPages: Story = {
  parameters: {
    docs: { description: { story: '페이지가 많을 때 양쪽을 말줄임으로 줄인 모습입니다.' } },
  },
  args: {
    page: 12,
    totalPages: 24,
  },
};
