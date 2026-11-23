import { useState } from 'react';
import useDepartments from '@/entities/departments/api/useDepartments.ts';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import SearchBox from '@/features/filtering/ui/SearchBox.tsx';
import { matchOptionKeyword } from '@/shared/lib/search.ts';
import { Button, Flex, Label, Listbox, ListboxOption, CheckmarkIcon, EmptyState, SearchIcon } from '@allcll/allcll-ui';
import { Filtering } from '@allcll/common';

const ALL_DEPARTMENT_LABEL = '전체 학과';

interface IDepartmentFilter {
  setFilter: (key: keyof Filters, value: string | null) => void;
  selectedValue: string;
}

function DepartmentFilter({ setFilter, selectedValue }: IDepartmentFilter) {
  const { data: departments } = useDepartments();
  const [searchKeywords, setSearchKeywords] = useState('');

  const options = [
    { value: '', label: ALL_DEPARTMENT_LABEL },
    ...(departments ?? []).map(({ departmentCode, departmentName }) => ({
      value: departmentCode,
      label: departmentName,
    })),
  ];
  const isMatched = (option: (typeof options)[number]) => !searchKeywords || matchOptionKeyword(option, searchKeywords);
  const hasMatch = options.some(isMatched);
  const selectedLabel = options.find(option => option.value === selectedValue)?.label ?? ALL_DEPARTMENT_LABEL;

  return (
    <Filtering label={selectedLabel} selected={!!selectedValue}>
      <Flex direction="column" className="h-80 w-max min-w-80 max-w-[calc(100vw-2rem)]">
        <Label>학과</Label>
        <SearchBox
          type="text"
          placeholder="학과 검색"
          value={searchKeywords}
          onDelete={() => setSearchKeywords('')}
          onChange={e => setSearchKeywords(e.target.value)}
          className="w-full shrink-0"
        />

        <Listbox bordered className="flex-1">
          {!hasMatch && (
            <EmptyState
              icon={SearchIcon}
              title="검색 결과가 없습니다."
              description="다른 학과 이름으로 검색해주세요."
              className="h-full"
            />
          )}
          {/* 검색해도 팝오버 폭이 바뀌지 않도록 걸러진 학과도 높이만 없애 두어 전체 목록의 가장 긴 이름에 폭을 맞춤 */}
          {options.map(option => {
            const matched = isMatched(option);

            return (
              <div
                key={option.value}
                aria-hidden={!matched || undefined}
                className={matched ? '' : 'h-0 overflow-hidden invisible'}
              >
                <ListboxOption
                  selected={option.value === selectedValue}
                  focusable={matched}
                  left={option.label}
                  right={<CheckmarkIcon className="w-4 h-4 shrink-0 text-primary-500" />}
                  onSelect={() => setFilter('department', option.value)}
                />
              </div>
            );
          })}
        </Listbox>

        <Flex justify="end" className="shrink-0 mt-1 pt-1.5 -mb-1.5 border-t border-line-subtle">
          <Button
            variant="text"
            size="small"
            color="gray"
            disabled={!selectedValue}
            onClick={() => setFilter('department', '')}
          >
            초기화
          </Button>
        </Flex>
      </Flex>
    </Filtering>
  );
}

export default DepartmentFilter;
