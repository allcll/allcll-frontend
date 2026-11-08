import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import BottomSheet, { BottomSheetFooter } from './BottomSheet';
import Button from '../button/Button';
import Chip from '../chip/Chip';
import Label from '../label/Label';

const GRADES = ['1학년', '2학년', '3학년', '4학년'];

const meta = {
  title: 'Overlay/BottomSheet',
  component: BottomSheet,
  subcomponents: { 'BottomSheet.Footer': BottomSheetFooter },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '모바일에서 화면 아래에서 올라오는 창입니다. 데스크톱에서 Dialog로 띄우는 내용을 모바일에서 보여줄 때 사용하고, 아래로 끌어내리거나 바깥을 누르면 닫힙니다. 아래쪽 버튼 영역은 내용을 스크롤해도 바닥에 붙어 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { description: '시트 제목', control: 'text' },
    isOpen: { description: '열림 상태', control: false },
    onClose: { description: '닫을 때 호출하는 함수', control: false },
    snapPoints: { description: '시트가 멈출 높이 목록, 1은 화면 전체', control: false },
    activeSnapPoint: { description: '지금 멈춰 있는 높이', control: false },
    onActiveSnapPointChange: { description: '멈춘 높이가 바뀔 때 호출하는 함수', control: false },
    children: { description: '시트 내용', control: false },
  },
  args: {
    title: '필터',
    isOpen: false,
    onClose: () => {},
    children: null,
  },
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    const [grades, setGrades] = useState<string[]>([]);
    const toggleGrade = (grade: string) =>
      setGrades(prev => (prev.includes(grade) ? prev.filter(item => item !== grade) : [...prev, grade]));

    return (
      <>
        <Button variant="solid" size="medium" onClick={() => setIsOpen(true)}>
          시트 열기
        </Button>
        <BottomSheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="flex flex-col gap-2">
            <Label>학년</Label>
            <div className="flex flex-wrap gap-2">
              {GRADES.map(grade => (
                <Chip key={grade} label={grade} selected={grades.includes(grade)} onClick={() => toggleGrade(grade)} />
              ))}
            </div>
          </div>
          <BottomSheet.Footer>
            <Button variant="solid" color="gray" size="medium" disabled={!grades.length} onClick={() => setGrades([])}>
              필터 초기화
            </Button>
            <Button variant="solid" size="medium" onClick={() => setIsOpen(false)}>
              완료
            </Button>
          </BottomSheet.Footer>
        </BottomSheet>
      </>
    );
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
