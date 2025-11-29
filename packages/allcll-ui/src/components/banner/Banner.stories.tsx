import type { Meta, StoryObj } from '@storybook/react-vite';

import Banner from './Banner';

type BannerProps = React.ComponentProps<typeof Banner>;

const meta = {
  title: 'AllcllUI/Banner',
  component: Banner,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['success', 'warning', 'info', 'error'],
    },
    children: { control: { type: 'text' } },
  },
  args: {
    variant: 'info',
    children: '알림이 울리지않나요?',
    deleteBanner: () => {},
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: ({ variant, ...args }) => (
    <ul className="flex flex-wrap gap-5">
      <li className="flex flex-col items-center">
        <Banner variant="info" {...args}>
          알림이 울리지 않나요? 문제 해결하러 가기
        </Banner>
      </li>
      <li className="flex flex-col items-center">
        <Banner variant="warning" {...args}>
          알림이 울리지 않나요? 문제 해결하러 가기
        </Banner>
      </li>
    </ul>
  ),

  argTypes: {
    variant: { control: false },
  },
};

export const Playground: Story = {
  args: {
    deleteBanner: () => {},
    children: '알림이 울리지 않나요?  문제 해결하러 가기',
  },
};

const createBannerStory = (variant: BannerProps['variant']): Story => ({
  args: { variant: variant, children: '알림이 울리지 않나요?', deleteBanner: () => {} },
  argTypes: { variant: { control: false } },
});

export const Info: Story = createBannerStory('info');
export const Warning: Story = createBannerStory('warning');
