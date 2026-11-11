import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Table, { TableCell, TableHead, TableHeaderCell } from './Table';
import Badge from '../badge/Badge';

const SUBJECTS = [
  { name: '해석학개론2', professor: '차영준', seat: 12 },
  { name: '반도체소자제작및실습2', professor: '남태욱', seat: 3 },
  { name: '전쟁과전략', professor: '김덕영', seat: 0 },
  { name: '대칭키암호론', professor: '노동영', seat: 7 },
];

const seatColor = (seat: number) => (seat > 5 ? 'success' : seat > 0 ? 'warning' : 'danger');

const meta = {
  title: 'Display/Table',
  component: Table,
  subcomponents: { 'Table.Head': TableHead, 'Table.HeaderCell': TableHeaderCell, 'Table.Cell': TableCell },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '행과 열로 데이터를 보여주는 표입니다. 가로로 넘치면 스크롤되고, 더 볼 내용이 있는 쪽 가장자리에 그림자가 생깁니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    scrollClassName: { description: '스크롤 영역에 줄 클래스', control: 'text' },
    wrapperClassName: { table: { disable: true } },
    className: { table: { disable: true } },
    children: { description: 'Table.Head, Table.Body 조합', control: false },
  },
  args: {
    scrollClassName: '',
  },
  render: args => (
    <div className="w-[480px]">
      <Table {...args}>
        <Table.Head>
          <Table.HeaderCell align="left">과목명</Table.HeaderCell>
          <Table.HeaderCell>담당교수</Table.HeaderCell>
          <Table.HeaderCell>여석</Table.HeaderCell>
        </Table.Head>
        <Table.Body>
          {SUBJECTS.map(subject => (
            <Table.Row key={subject.name}>
              <Table.Cell align="left">{subject.name}</Table.Cell>
              <Table.Cell>{subject.professor}</Table.Cell>
              <Table.Cell>
                <Badge color={seatColor(subject.seat)}>{subject.seat}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  ),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ExampleSortable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '열 제목을 눌러 정렬하는 모습입니다. 표는 정렬 방향을 화살표로만 보여주고, 누를 때 어떤 순서로 바꿀지는 쓰는 쪽에서 정합니다.',
      },
    },
  },
  render: function Render() {
    const [direction, setDirection] = useState<'asc' | 'desc' | null>(null);
    const nextDirection = { null: 'desc', desc: 'asc', asc: null } as const;
    const sorted = direction
      ? [...SUBJECTS].sort((a, b) => (direction === 'asc' ? a.seat - b.seat : b.seat - a.seat))
      : SUBJECTS;

    return (
      <div className="w-[480px]">
        <Table>
          <Table.Head>
            <Table.HeaderCell align="left">과목명</Table.HeaderCell>
            <Table.HeaderCell>담당교수</Table.HeaderCell>
            <Table.HeaderCell sortDirection={direction} onSort={() => setDirection(nextDirection[`${direction}`])}>
              여석
            </Table.HeaderCell>
          </Table.Head>
          <Table.Body>
            {sorted.map(subject => (
              <Table.Row key={subject.name}>
                <Table.Cell align="left">{subject.name}</Table.Cell>
                <Table.Cell>{subject.professor}</Table.Cell>
                <Table.Cell>
                  <Badge color={seatColor(subject.seat)}>{subject.seat}</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  },
};
