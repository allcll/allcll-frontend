import { useDeferredValue } from 'react';
import useScheduleModal from '@/features/timetable/lib/useScheduleModal.ts';
import { ScheduleAdapter } from '@/entities/timetable/model/adapter.ts';
import { useScheduleSearchStore } from '@/features/filtering/model/useFilterStore.ts';
import useFilteringSubjects from '@/features/filtering/lib/useFilteringSubjects.ts';
import useSearchRank from '@/features/filtering/lib/useSearchRank.ts';
import useWishes from '@/entities/wishes/model/useWishes.ts';
import SearchBox from '@/features/filtering/ui/SearchBox.tsx';
import ScheduleFilter from '../../../widgets/filtering/ui/ScheduleFilter.tsx';
import { Button, Card, Flex } from '@allcll/allcll-ui';
import TimetableSubjectCards from '@/features/timetable/ui/subject/TimetableSubjectCards.tsx';

const initSchedule = new ScheduleAdapter().toUiData();

// Fixme: div depth 최적화 필요
function ScheduleContentPanel() {
  const { openScheduleModal } = useScheduleModal();
  // Todo:  학기에 맞는 시간표 data가져오기
  const { data, isPending } = useWishes();
  const subjects = useSearchRank(data) ?? [];

  const filters = useScheduleSearchStore(state => state.filters);
  const setFilters = useScheduleSearchStore(state => state.setFilter);
  const filteredData = useDeferredValue(useFilteringSubjects(subjects, filters));

  return (
    <Card>
      <Flex direction="flex-col" gap="gap-3" className="w-full bg-white h-screen md:border-t-0">
        <SearchBox
          type="text"
          value={filters.keywords}
          placeholder="과목명 검색"
          onDelete={() => setFilters('keywords', '')}
          onChange={e => setFilters('keywords', e.target.value)}
          className="w-full"
        />

        <ScheduleFilter />
        <Button variant="text" size="small" onClick={() => openScheduleModal(initSchedule)}>
          + 커스텀 일정 생성
        </Button>

        <Flex direction="flex-col" className="h-full overflow-hidden overflow-y-auto">
          <TimetableSubjectCards subjects={filteredData} isPending={isPending} />
        </Flex>
      </Flex>
    </Card>
  );
}

export default ScheduleContentPanel;
