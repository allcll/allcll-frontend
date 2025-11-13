import type { Meta, StoryObj } from '@storybook/react-vite';

import Card from './Card';
import Button from '../button/Button';

const meta = {
  title: 'AllcllUI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: { control: { type: 'text' } },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: { type: 'select' },
      options: ['elevated', 'outlined', 'filled'],
    },
  },

  args: {
    children: 'Card Content',
    size: 'medium',
    variant: 'outlined',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: 'Card Content',
    size: 'medium',
    variant: 'outlined',
  },
  render: args => {
    return <Card {...args} />;
  },
};

export const Cards: Story = {
  render: () => (
    <ul className="flex flex-wrap gap-5">
      <li>
        <Card size="small" variant="elevated">
          Small Elevated Card
        </Card>
      </li>
      <li>
        <Card size="medium" variant="outlined">
          Medium Outlined Card
        </Card>
      </li>
      <li>
        <Card size="large" variant="filled">
          Large Filled Card
        </Card>
      </li>
    </ul>
  ),
  argTypes: {
    children: {
      control: false,
    },
    size: {
      control: false,
    },
    variant: {
      control: false,
    },
  },
};

export const SubjectCard: Story = {
  render: () => (
    <ul className="flex flex-wrap gap-5">
      <li>
        <Card size="small" variant="elevated">
          <h3 className="text-lg font-semibold mb-2">알고리즘</h3>
          <Button size="small" variant="outlined">
            상세보기
          </Button>
        </Card>
      </li>
      <li>
        <Card size="medium" variant="outlined">
          Medium Outlined Card
        </Card>
      </li>
      <li>
        <Card size="large" variant="filled">
          Large Filled Card
        </Card>
      </li>
    </ul>
  ),
  argTypes: {
    children: {
      control: false,
    },
    size: {
      control: false,
    },
    variant: {
      control: false,
    },
  },
};
