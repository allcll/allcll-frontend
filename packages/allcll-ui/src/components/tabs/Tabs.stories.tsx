import type { Meta, StoryObj } from '@storybook/react-vite';
import Tabs from './Tabs';
import Tab from '../tab/Tab';

const meta = {
  title: 'AllcllUI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: (
      <Tabs>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
      </Tabs>
    ),
  },
};

export const Default: Story = {
  args: {
    children: (
      <Tabs>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
      </Tabs>
    ),
  },
};
