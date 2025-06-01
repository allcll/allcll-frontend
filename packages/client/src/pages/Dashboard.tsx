// import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar.tsx';
import RealtimeTable from '@/components/RealtimeTable.tsx';
import PinnedCourses from '@/components/PinnedCourses.tsx';
import CardWrap from '@/components/CardWrap.tsx';
import SystemChecking from '@/components/dashboard/errors/SystemChecking.tsx';
// import DragCardWrap from '@/components/dashboard/DragCardWrap.tsx';

// const initialBoards = [
//   { id: '1', content: <PinnedCourses /> },
//   { id: '2', content: <RealtimeTable title='교양과목' /> },
//   { id: '3', content: <RealtimeTable title='전공과목' showSelect /> },
// ];

function Dashboard() {
  // const [boards, setBoards] = useState(initialBoards);

  // const moveCard = (dragIndex: number, hoverIndex: number) => {
  //   const updatedBoards = [...boards];
  //   const [draggedBoard] = updatedBoards.splice(dragIndex, 1);
  //   updatedBoards.splice(hoverIndex, 0, draggedBoard);
  //   setBoards(updatedBoards);
  // };

  const isSystemChecking = false;

  return (
    <>
      <Helmet>
        <title>ALLCLL | 실시간 수강 여석</title>
      </Helmet>

      <div className="max-w-screen-xl mx-auto mb-8">
        <div className="container p-4 mx-auto">
          <Navbar />

          {/*{boards.map((board, index) => (*/}
          {/*  <DragCardWrap key={board.id} id={board.id} index={index} moveCard={moveCard}>*/}
          {/*    <CardWrap>*/}
          {/*      {board.content}*/}
          {/*    </CardWrap>*/}
          {/*  </DragCardWrap>*/}
          {/*))}*/}

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

              {/* lg:grid-cols-2 */}
              <div className="grid grid-cols-1 gap-x-4 mb-4">
                <RealtimeTable title="교양과목" />
                {/*<RealtimeTable title='전공과목' showSelect/>*/}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
