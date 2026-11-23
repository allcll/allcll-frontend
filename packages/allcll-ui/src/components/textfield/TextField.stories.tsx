import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import TextField from './TextField';

const SIZES = ['small', 'medium', 'large'] as const;

const STATES = [
  { label: '기본', props: {} },
  { label: '오류', props: { isError: true, errorMessage: '학번은 8자리 숫자여야 합니다' } },
  { label: '비활성', props: { disabled: true } },
];

const meta = {
  title: 'Form/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '라벨과 오류 메시지를 함께 보여주는 입력칸입니다. 폼 안의 입력 항목에 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: { description: '라벨과 입력칸을 잇는 id', control: false },
    label: { description: '위에 붙는 라벨', control: 'text' },
    required: { description: '필수 표시(*)', control: 'boolean' },
    size: { description: '글자 크기', control: 'radio', options: SIZES },
    placeholder: { description: '안내 문구', control: 'text' },
    isError: { description: '오류 상태', control: 'boolean' },
    errorMessage: { description: '오류일 때 아래에 보일 문구', control: 'text' },
    disabled: { description: '입력할 수 없는 상태', control: 'boolean' },
    onClear: { description: '지우기 버튼을 눌렀을 때 호출하는 함수', control: false },
    endAdornment: { description: '오른쪽 끝에 붙일 요소', control: false },
    className: { table: { disable: true } },
  },
  args: {
    id: 'student-id',
    label: '학번',
    required: true,
    size: 'medium',
    placeholder: '학번을 입력하세요',
    isError: false,
    errorMessage: '',
    disabled: false,
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: { story: '기본, 오류, 비활성 상태입니다.' },
    },
  },
  render: args => (
    <div className="grid grid-cols-[auto_18rem] items-center gap-4">
      {STATES.map((state, index) => (
        <Fragment key={state.label}>
          <span className="text-xs text-fg-muted">{state.label}</span>
          <TextField {...args} {...state.props} id={`${args.id}-${index}`} />
        </Fragment>
      ))}
    </div>
  ),
};
