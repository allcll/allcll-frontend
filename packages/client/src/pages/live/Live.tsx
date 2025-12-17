import { Helmet } from 'react-helmet';
import RealtimeTable from '@/widgets/live/RealtimeTable.tsx';
import PinnedCourses from '@/widgets/live/PinnedCourses.tsx';
import SearchSideBar from '@/widgets/live/SearchSideBar.tsx';
import SearchBottomSheet from '@/widgets/live/SearchBottomSheet.tsx';
import useAlarmModalStore from '@/store/useAlarmModalStore.ts';
import useMobile from '@/shared/lib/useMobile.ts';
import usePreSeatGate from '@/hooks/usePreSeatGate';
import PreSeat from '@/widgets/live/preSeat/PreSeat';
import { Flex, Grid, SupportingText } from '@allcll/allcll-ui';

function Live() {
  const isSearchOpen = useAlarmModalStore(state => state.isSearchOpen);
  const setIsSearchOpen = useAlarmModalStore(state => state.setIsSearchOpen);
  const isMobile = useMobile();
  const { isPreSeatAvailable } = usePreSeatGate();

  return (
    <>
      <Helmet>
        <title>ALLCLL | 실시간 수강 여석</title>
      </Helmet>

      <Flex className="overflow-hidden min-h-screen">
        <Flex direction="flex-col" className="max-w-screen-xl mx-auto p-4 mb-8 container">
          <SupportingText>
            아직 기능이 안정적이지 않을 수 있습니다. 오류 발생 시 &nbsp;
            <a
              href="https://forms.gle/bCDTVujEHunnvHe88"
              target="_blank"
              className="text-blue-500 underline hover:text-blue-600"
            >
              문의사항
            </a>
          </SupportingText>

          {!isPreSeatAvailable && <PinnedCourses />}

          <Grid columns={{ base: 1 }} gap="gap-4">
            {isPreSeatAvailable ? <PreSeat /> : <RealtimeTable title="교양과목" />}
          </Grid>
        </Flex>
        {!isMobile && <SearchSideBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
      </Flex>

      {isMobile && isSearchOpen && <SearchBottomSheet onCloseSearch={() => setIsSearchOpen(false)} />}
    </>
  );
}

export default Live;
