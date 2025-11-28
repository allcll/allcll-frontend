import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dialog } from './Dialog';
import Chip from '../chip/Chip';
import TextField from '../textfield/TextField';
import Button from '../button/Button';
import { useState } from 'react';

const meta = {
  title: 'AllcllUI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  args: {
    isOpen: true,
    onClose: () => {},
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    isOpen: true,
    title: 'Dialog 제목',
    onClose: () => {},
    children: <div>Dialog Content</div>,
  },
  render: args => {
    const [open, setOpen] = useState(true);

    return (
      <Dialog {...args} isOpen={open} onClose={() => setOpen(false)}>
        <Dialog.Contents>
          <Dialog.Content>
            <h2>타이틀</h2>
            <Chip variant="none" label="칩" selected />
            <TextField size="medium" placeholder="텍스트 필드" />

            <h2>타이틀</h2>
            <Chip variant="none" label="칩" selected />
            <TextField size="medium" placeholder="텍스트 필드" />
          </Dialog.Content>
          <Dialog.Footer>
            <Button size="small" variant="text" onClick={() => setOpen(false)}>
              확인
            </Button>
            <Button size="small" variant="outlined" onClick={() => setOpen(false)}>
              취소
            </Button>
          </Dialog.Footer>
        </Dialog.Contents>
      </Dialog>
    );
  },
};
