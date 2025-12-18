import { Day } from '@/utils/types.ts';
import React, { useEffect } from 'react';
import InputTime from '@/features/timetable/ui/common/InputTime.tsx';
import { Button, Flex, Label } from '@allcll/allcll-ui';

export interface IDayTimeItem {
  day: Day | '';
  type: 'all' | 'before' | 'after' | 'between';
  start?: string;
  end?: string;
}

interface IDayTimeFilter {
  items: IDayTimeItem[];
  onChange: (items: IDayTimeItem[]) => void;
}

function DayTimeFilter({ items, onChange }: Readonly<IDayTimeFilter>) {
  useEffect(() => {
    if (items.length === 0) {
      onChange([{ day: '', type: 'all' }]);
      return;
    }

    const reconciledItems = reconcileData(items);
    if (reconciledItems) onChange(reconciledItems);
  }, [items]);

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };
    onChange(updatedItems);
  };

  const handleDelete = (index: number) => () => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange(updatedItems);
  };

  return (
    <>
      <Label>시간</Label>

      <Flex direction="flex-col" gap="gap-2">
        {items.map((item, index) => (
          <DayTime
            key={`${item.day}-${item.type}-${item.start}-${item.end}`}
            item={item}
            onChange={handleChange(index)}
            onDelete={handleDelete(index)}
          />
        ))}
      </Flex>

      <Button variant="text" size="small" onClick={() => onChange([...items, { day: '', type: 'all' }])}>
        요일 추가
      </Button>
    </>
  );
}

interface IDayTime {
  item: IDayTimeItem;
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  onDelete: () => void;
}

function DayTime({ item, onChange, onDelete }: IDayTime) {
  const hasType = !!item.day;
  const hasStart = item.type != 'all';
  const hasEnd = item.type === 'between';

  return (
    <div className="flex items-center gap-2">
      <select
        name="day"
        value={item.day}
        onChange={onChange}
        className="bg-gray-100 px-3 py-2 rounded-md text-xs text-gray-600 w-fit"
      >
        <option value="">전체</option>
        {['월', '화', '수', '목', '금', '토', '일'].map(day => (
          <option key={day} value={day as Day}>
            {day}
          </option>
        ))}
      </select>
      {hasType && (
        <select
          name="type"
          value={item.type}
          onChange={onChange}
          className="bg-gray-100 px-3 py-2 rounded-md text-xs text-gray-600 w-fit"
        >
          <option value="all">전체</option>
          <option value="before">이전</option>
          <option value="after">이후</option>
          <option value="between">사이</option>
        </select>
      )}
      {hasStart && <InputTime name="start" value={item.start || '00:00'} onChange={onChange} />}
      {hasEnd && <InputTime name="end" value={item.end || '00:00'} onChange={onChange} />}

      <Button variant="text" size="small" textColor="secondary" onClick={onDelete}>
        삭제
      </Button>
    </div>
  );
}

function reconcileData(items: IDayTimeItem[]): IDayTimeItem[] | null {
  const changed = items.some(item => {
    if (item.day === '') {
      return item.type !== 'all' || item.start || item.end;
    }
    if (item.type === 'all') {
      return item.start || item.end;
    }
    if (item.type === 'before' || item.type === 'after') {
      return !item.start || item.end;
    }
    if (item.type === 'between') {
      return !item.start || !item.end;
    }
    return false;
  });

  if (changed) {
    return items.map(item => {
      if (item.day === '') {
        return { day: '', type: 'all' };
      }
      if (item.type === 'all') {
        return { day: item.day, type: 'all' };
      }
      if (item.type === 'before' || item.type === 'after') {
        return { day: item.day, type: item.type, start: item.start || '00:00' };
      }
      if (item.type === 'between') {
        return { day: item.day, type: item.type, start: item.start || '00:00', end: item.end || '00:00' };
      }
      return item;
    });
  }

  return items;
}

export default DayTimeFilter;
