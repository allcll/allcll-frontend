import type { Meta, StoryObj } from '@storybook/react-vite';
import ModalButtonContainer from './ModalButtonContainer.tsx';
import ModalButton from './ModalButton.tsx';

const meta = {
  title: 'SejongUI/ModalButtonContainer',
  component: ModalButtonContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ModalButtonContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <ModalButton>Button 1</ModalButton>
        <ModalButton>Button 2</ModalButton>
      </>
    ),
  },
};
