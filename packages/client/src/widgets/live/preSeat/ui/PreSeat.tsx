import { Helmet } from 'react-helmet';
import { useDeferredValue } from 'react';
import SubjectTable from '@/features/live/preseat/ui/PreseatSubjectTable.tsx';
import useMobile from '@/shared/lib/useMobile.ts';
import useSearchRank from '@/hooks/useSearchRank.ts';
import useWishesPreSeats from '@/hooks/useWishesPreSeats.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects.ts';
import { PRESEAT_CLOSE_DATE } from '@/features/live/preseat/lib/usePreSeatGate.ts';
import { Filters, useAlarmSearchStore } from '@/store/useFilterStore.ts';
import ScrollToTopButton from '@/shared/ui/ScrollTopButton.tsx';
import SubjectCards from '@/widgets/live/pin/ui/PinCards.tsx';
import TableColorInfo from '@/widgets/wishlist/TableColorInfo.tsx';
import SubjectSearches from './SubjectSearches.tsx';
import { Card, Flex, Heading, SupportingText } from '@allcll/allcll-ui';

const TableHeadTitles = [
  { title: '알림', key: 'pin' },
  { title: '학수번호', key: 'code' },
  { title: '개설학과', key: 'departmentName' },
  { title: '과목명', key: 'name' },
  { title: '담당교수', key: 'professor' },
];

export interface ISubjectSearch {
  searchKeyword: string;
  isAlarmWish: boolean;
  selectedDepartment: string;
}

const PreSeatBody = ({ isMobile, filters }: { isMobile: boolean; filters: Filters }) => {
  const { data: wishes, titles, isPending } = useWishesPreSeats(TableHeadTitles);
  const data = useSearchRank(wishes);
  const filteredData = useDeferredValue(useFilteringSubjects(data ?? [], filters));

  return (
    <Card>
      {isMobile ? (
        <SubjectCards subjects={filteredData} isPending={isPending} isLive={true} />
      ) : (
        <SubjectTable titles={titles} subjects={filteredData} isPending={isPending} />
      )}
    </Card>
  );
};

const PreSeat = () => {
  const isMobile = useMobile();

  const filters = useAlarmSearchStore(state => state.filters);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 전체 여석</title>
      </Helmet>

      <Flex direction="flex-col" className="mb-4">
        <Heading level={2}>전체학년 여석</Heading>

        <SupportingText>
          전체 학년 수강신청 전, 전체 학년의 여석을 보여줍니다.
          <br />
          실시간 기능은 {PRESEAT_CLOSE_DATE}, 11:00에 시작될 예정입니다.
        </SupportingText>

        <Card>
          <SubjectSearches />
          <TableColorInfo />
        </Card>

        <PreSeatBody isMobile={isMobile} filters={filters} />
        <ScrollToTopButton right="right-2 sm:right-10" />
      </Flex>
    </>
  );
};

export default PreSeat;
