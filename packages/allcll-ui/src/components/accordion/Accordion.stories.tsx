import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Accordion, { AccordionItem } from './Accordion';

const FAQ_ITEMS = [
  {
    id: 'notification-difference',
    question: '브라우저 알림과 토스트 알림의 차이가 무엇인가요?',
    answer:
      '브라우저 알림은 사용하는 탭과 상관없이 기기에 알림을 보내고, 토스트 알림은 화면 우측 상단에 나타나며 ALLCLL 탭 안에서만 동작합니다.',
  },
  {
    id: 'refresh-interval',
    question: '실시간 과목 갱신 주기는 어떻게 되나요?',
    answer:
      '모든 사용자의 여석 과목 알림 개수를 기준으로 우선순위가 정해집니다. 따라서 어떤 과목은 자주 갱신되고, 어떤 과목은 갱신이 늦어질 수 있습니다.',
  },
];

const meta = {
  title: 'Display/Accordion',
  component: Accordion,
  subcomponents: { 'Accordion.Item': AccordionItem },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '제목을 누르면 내용이 펼쳐지고 다시 누르면 접히는 목록입니다. 한 번에 하나만 펼쳐지고, 다른 항목을 열면 이전 항목은 닫힙니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: { description: '펼쳐진 항목의 값, 모두 접혀 있으면 null', control: false },
    onValueChange: { description: '펼쳐진 항목이 바뀔 때 호출하는 함수', control: false },
    children: { description: 'Accordion.Item 목록', control: false },
    className: { table: { disable: true } },
  },
  args: {
    value: null,
    onValueChange: () => {},
    children: null,
  },
  render: function Render(args) {
    const [openId, setOpenId] = useState<string | null>(args.value);

    useEffect(() => setOpenId(args.value), [args.value]);

    return (
      <div className="w-[480px] bg-surface-subtle p-4">
        <Accordion value={openId} onValueChange={setOpenId}>
          {FAQ_ITEMS.map(item => (
            <Accordion.Item key={item.id} value={item.id} title={item.question}>
              {item.answer}
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    );
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
