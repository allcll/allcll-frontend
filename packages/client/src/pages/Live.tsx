import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar.tsx';
import RealtimeTable from '@/components/live/RealtimeTable.tsx';
import PinnedCourses from '@/components/live/PinnedCourses.tsx';
import CardWrap from '@/components/CardWrap.tsx';
import SystemChecking from '@/components/live/errors/SystemChecking.tsx';

function Live() {
  const isSystemChecking = false;

  return (
    <>
      <Helmet>
        <title>ALLCLL | 실시간 수강 여석</title>
      </Helmet>

      <div className="max-w-screen-xl mx-auto mb-8">
        <div className="container p-4 mx-auto">
          <Navbar />

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
      </div>
    </>
  );
}

export default Live;
