import usePreSeatGate from '@/features/live/preseat/lib/usePreSeatGate';
import useMobile from '@/shared/lib/useMobile';
import useAlarmModalStore from '@/features/live/pin/model/useAlarmModalStore';
import SearchBottomSheet from '@/widgets/filtering/search/ui/ScheduleSearchBottomSheet';
import LivePinnedCourses from '@/widgets/live/pin/ui/LivePinnedCourses';
import PreSeat from '@/widgets/live/preSeat/ui/PreSeat';
import RealtimeTable from '@/features/live/board/ui/RealtimeTable';
import SearchSideBar from '@/widgets/live/pin/ui/SearchSideBar';
import { Flex, Grid, Heading, SupportingText } from '@allcll/allcll-ui';
import { Helmet } from 'react-helmet';

function Live() {
  const isSearchOpen = useAlarmModalStore(state => state.isSearchOpen);
  const setIsSearchOpen = useAlarmModalStore(state => state.setIsSearchOpen);
  const isMobile = useMobile();
  const { isPreSeatAvailable } = usePreSeatGate();

  const shouldShowPinnedCourses = !isPreSeatAvailable;

  return (
    <>
      <Helmet>
        <title>ALLCLL | 실시간 수강 여석</title>
      </Helmet>

      <Flex className="overflow-hidden min-h-screen">
        <Flex direction="flex-col" className="max-w-screen-xl mx-auto p-4 mb-8 container">
          <Flex direction="flex-col" gap="gap-0">
            <Heading level={1}>실시간 수강 여석</Heading>
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
          </Flex>

          {shouldShowPinnedCourses && <LivePinnedCourses />}

          <Grid columns={{ base: 1 }} gap="gap-4">
            <LiveMainContent isPreSeatAvailable={isPreSeatAvailable} />
          </Grid>
        </Flex>

        <SearchOverlay isMobile={isMobile} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </Flex>
    </>
  );
}

export default Live;

function SearchOverlay({ isMobile, isOpen, onClose }: { isMobile: boolean; isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return isMobile ? <SearchBottomSheet onCloseSearch={onClose} /> : <SearchSideBar isOpen={isOpen} onClose={onClose} />;
}

function LiveMainContent({ isPreSeatAvailable }: { isPreSeatAvailable: boolean }) {
  if (isPreSeatAvailable) {
    return <PreSeat />;
  }

  return <RealtimeTable title="교양과목" />;
}
