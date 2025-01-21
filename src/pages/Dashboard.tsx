import Navbar from '@/components/Navbar.tsx';
import RealtimeTable from '@/components/RealtimeTable.tsx';
import PinnedCourses from '@/components/PinnedCourses.tsx';
import CardWrap from '@/components/CardWrap.tsx';

function Dashboard() {
  return (
    <div className="max-w-screen-xl mx-auto p-2 mb-8">
      <div className="container p-4 mx-auto">
        <Navbar/>
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-4 mb-4">
          <RealtimeTable title='교양과목'/>
          <RealtimeTable title='전공과목' showSelect/>
        </div>

        <CardWrap>
          <PinnedCourses/>
        </CardWrap>
      </div>
    </div>
  );
}

export default Dashboard;