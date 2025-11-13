import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dialog } from './Dialog';
import Chip from '../chip/Chip';
import TextField from '../textfield/TextField';
import Button from '../button/Button';

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
    onClose: () => {},
    title: '모달 타이틀입니다.',
    children: (
      <Dialog.Contents>
        <Dialog.Content>
          <Dialog.Title>타이틀</Dialog.Title>
          <Chip variant="none" label="칩" selected />
          <TextField size="medium" placeholder="텍스트 필드" />

          <Dialog.Title>타이틀</Dialog.Title>
          <Chip variant="none" label="칩" selected />
          <TextField size="medium" placeholder="텍스트 필드" />
        </Dialog.Content>
        <Dialog.Footer>
          <Button size="small" variant="text">
            확인
          </Button>
          <Button size="small" variant="outlined">
            취소
          </Button>
        </Dialog.Footer>
      </Dialog.Contents>
    ),
  },
};
