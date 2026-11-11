import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dialog } from './Dialog';
import TextField from '../textfield/TextField';
import Button from '../button/Button';

const SIZES = ['medium', 'large'] as const;

const meta = {
  title: 'Overlay/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '화면 위에 띄워 확인이나 입력을 받는 창입니다. 버튼은 아래쪽에 두고, 확인처럼 주가 되는 버튼을 마지막에 둡니다. 짧은 선택은 Popover를 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { description: '창 제목', control: 'text' },
    size: { description: '창 폭', control: 'radio', options: SIZES },
    isOpen: { description: '열림 상태', control: false },
    onClose: { description: '닫을 때 호출하는 함수', control: false },
    children: { description: '`Dialog.Content`, `Dialog.Footer` 조합', control: false },
  },
  args: {
    title: '커스텀 일정 생성',
    size: 'medium',
    isOpen: false,
    onClose: () => {},
    children: null,
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
      <>
        <Button variant="solid" size="medium" onClick={() => setOpen(true)}>
          창 열기
        </Button>
        <Dialog {...args} isOpen={open} onClose={close}>
          <Dialog.Content>
            <TextField id="schedule-place" label="장소" size="medium" placeholder="장소를 입력해주세요" />
          </Dialog.Content>
          <Dialog.Footer>
            <Button variant="solid" size="medium" onClick={close}>
              저장
            </Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  },
};
