import type { Meta, StoryObj } from '@storybook/react-vite';

import Input from './Input';
import IconButton from '../icon-button/IconButton';
import { CloseIcon, SearchIcon } from '../../icons';

const meta = {
  title: 'Form/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '라벨 없이 쓰는 기본 입력창입니다. 라벨이나 오류 메시지가 필요한 폼에는 TextField를 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { description: '안내 문구', control: 'text' },
    disabled: { description: '입력할 수 없는 상태', control: 'boolean' },
    fullWidth: { description: '부모 폭을 가득 채울지 여부', control: 'boolean' },
    leftIcon: { description: '왼쪽 아이콘 자리', control: false },
    rightIcon: { description: '오른쪽 아이콘 자리', control: false },
    className: { table: { disable: true } },
  },
  args: {
    placeholder: '과목명, 교수명, 학수번호 검색',
    disabled: false,
    fullWidth: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ExampleWithIcons: Story = {
  parameters: {
    docs: { description: { story: '검색 아이콘과 지우기 버튼을 넣은 모습입니다.' } },
  },
  args: {
    leftIcon: <IconButton size="medium" label="검색" variant="plain" icon={<SearchIcon className="text-gray-400" />} />,
    rightIcon: (
      <IconButton size="medium" label="지우기" variant="plain" icon={<CloseIcon className="text-gray-400" />} />
    ),
  },
};
