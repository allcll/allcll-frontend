import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Pagination from './Pagination';

const meta = {
  title: 'AllcllUI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    page: 1,
    totalPages: 5,
    onPageChange: () => {},
  },
  render: function Render(args) {
    const [page, setPage] = useState(args.page);

    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ManyPages: Story = {
  args: {
    page: 12,
    totalPages: 24,
  },
};

export const SinglePage: Story = {
  args: {
    totalPages: 1,
  },
};
