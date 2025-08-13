import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import CardWrap from '@/components/CardWrap.tsx';
import RealtimeTable from '@/components/live/RealtimeTable.tsx';
import PinnedCourses from '@/components/live/PinnedCourses.tsx';
import SystemChecking from '@/components/live/errors/SystemChecking.tsx';
import SearchSideBar from '@/components/live/SearchSideBar.tsx';
import SearchBottomSheet from '@/components/live/SearchBottomSheet.tsx';
import useWindowSize from '@/hooks/useWindowSize.ts';
import useAlarmSearchStore from '@/store/useAlarmSearchStore.ts';

const isSystemChecking = false;

function Live() {
  const isSearchOpen = useAlarmSearchStore(state => state.isSearchOpen);
  const setIsSearchOpen = useAlarmSearchStore(state => state.setIsSearchOpen);
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 768;

  return (
    <>
      <Helmet>
        <title>ALLCLL | 실시간 수강 여석</title>
      </Helmet>

      <div className="flex justify-between overflow-hidden">
        <div className="max-w-screen-xl mx-auto p-4 mb-8 container">
          {isSystemChecking ? (
            <CardWrap>
              <SystemChecking />
            </CardWrap>
          ) : (
            <>
              <p className="text-xs font-bold text-gray-500 mb-4">
                아직 기능이 안정적이지 않을 수 있습니다. 오류 발생 시&nbsp;
                <Link to="/survey" className="text-blue-500 underline hover:text-blue-600">
                  문의사항
                </Link>
                으로 연락주세요.
              </p>

              <CardWrap>
                <PinnedCourses />
              </CardWrap>

              <div className="grid grid-cols-1 gap-x-4 mb-4">
                <RealtimeTable title="교양과목" />
              </div>
            </>
          )}
        </div>
        {!isMobile && <SearchSideBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
      </div>

      {isMobile && isSearchOpen && <SearchBottomSheet onCloseSearch={() => setIsSearchOpen(false)} />}
    </>
  );
}

export default Live;
