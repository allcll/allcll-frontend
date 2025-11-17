import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import DataTable from './DataTable';
import type { ColumnDefinition } from './types';
import Button from '../Button'; // Example usage with another component

const meta = {
  title: 'SejongUI/DataTable',
  component: DataTable<User>,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'object',
      description: 'Array of column definitions',
    },
    data: {
      control: 'object',
      description: 'Array of data to display',
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the table',
    },
    emptyComponent: {
      control: false,
      description: 'Component to show when data is empty',
    },
  },
} satisfies Meta<typeof DataTable<User>>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Sample Data and Columns for Stories ---

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Guest';
}

const sampleData: User[] = [
  { id: 1, name: '홍길동', email: 'gildong@example.com', role: 'Admin' },
  { id: 2, name: '이순신', email: 'sunsin@example.com', role: 'User' },
  { id: 3, name: '세종대왕', email: 'sejong@example.com', role: 'User' },
];

const basicColumns: ColumnDefinition<User>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: '이름', accessorKey: 'name' },
  { header: '이메일', accessorKey: 'email' },
  { header: '역할', accessorKey: 'role' },
];

const columnsWithCustomCell: ColumnDefinition<User>[] = [
  ...basicColumns,
  {
    header: '관리',
    accessorKey: 'id', // Accessor is still useful as a key
    cell: item => (
      <div className="flex justify-center gap-2">
        <Button variant="primary" size="sm" onClick={fn()} className="text-xs py-0.5 px-1">
          수정
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => alert(`Deleting user ${item.name}`)}
          className="text-xs py-0.5 px-1"
        >
          삭제
        </Button>
      </div>
    ),
  },
];

const NothingComponent = () => (
  <tbody>
    <tr>
      <td colSpan={10} className="text-center text-gray-500 py-10">
        표시할 데이터가 없습니다.
      </td>
    </tr>
  </tbody>
);

export const Basic: Story = {
  name: '기본 테이블',
  args: {
    columns: basicColumns,
    data: sampleData,
  },
};

export const WithCustomCells: Story = {
  name: '버튼을 포함한 테이블',
  args: {
    columns: columnsWithCustomCell,
    data: sampleData,
  },
};

export const Empty: Story = {
  name: '데이터가 없는 테이블',
  args: {
    columns: basicColumns,
    data: [],
    emptyComponent: <NothingComponent />,
  },
};
