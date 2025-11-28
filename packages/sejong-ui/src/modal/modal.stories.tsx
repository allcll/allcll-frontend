import type { Meta, StoryObj } from '@storybook/react-vite';
import Modal from './Modal';
import ModalHeader from './ModalHeader';
import ModalButtonContainer from './ModalButtonContainer.tsx';
import ModalButton from './ModalButton';
import Button from '../Button';
import Input from '../Input';

const meta = {
  title: 'SejongUI/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    preventAutoFocus: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <ModalHeader title="Default Modal" />
        <div style={{ padding: '1rem' }}>
          <p>This is a default modal.</p>
        </div>
        <ModalButtonContainer>
          <ModalButton onClick={() => alert('Closed!')}>Close</ModalButton>
        </ModalButtonContainer>
      </>
    ),
    onBackdropClick: () => alert('Backdrop clicked!'),
  },
};

export const WithForm: Story = {
  args: {
    children: (
      <>
        <ModalHeader title="Form in Modal" />
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input placeholder="Username" />
          <Input type="password" placeholder="Password" />
        </div>
        <ModalButtonContainer>
          <Button variant="primary" onClick={() => alert('Logged in!')}>
            Login
          </Button>
          <ModalButton onClick={() => alert('Cancelled!')}>Cancel</ModalButton>
        </ModalButtonContainer>
      </>
    ),
    onBackdropClick: () => alert('Backdrop clicked!'),
  },
};

export const LongContent: Story = {
  args: {
    children: (
      <>
        <ModalHeader title="Long Content" onClose={() => {}} />
        <div style={{ padding: '1rem' }}>
          {[...Array(50)].map((_, i) => (
            <p key={i}>This is a long content line {i + 1}.</p>
          ))}
        </div>
        <ModalButtonContainer>
          <ModalButton onClick={() => alert('Closed!')}>Close</ModalButton>
        </ModalButtonContainer>
      </>
    ),
    onBackdropClick: () => alert('Backdrop clicked!'),
  },
};

export const PreventAutoFocus: Story = {
  args: {
    ...Default.args,
    preventAutoFocus: true,
  },
};
