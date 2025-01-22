import Navbar from '@/components/Navbar.tsx';
import RealtimeTable from '@/components/RealtimeTable.tsx';
import PinnedCourses from '@/components/PinnedCourses.tsx';
import CardWrap from '@/components/CardWrap.tsx';
import useNotification from '@/hooks/useNotification.ts';

function Dashboard() {
  useNotification();

  return (
    <div className="max-w-screen-xl mx-auto p-2 mb-8">
      <div className="container p-4 mx-auto">
        <Navbar/>
        <CardWrap>
          <PinnedCourses/>
        </CardWrap>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 mb-4">
          <RealtimeTable title='교양과목'/>
          <RealtimeTable title='전공과목' showSelect/>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;