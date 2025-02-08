// import { useState } from 'react';
import Navbar from '@/components/Navbar.tsx';
import RealtimeTable from '@/components/RealtimeTable.tsx';
import PinnedCourses from '@/components/PinnedCourses.tsx';
import CardWrap from '@/components/CardWrap.tsx';
// import DragCardWrap from '@/components/dashboard/DragCardWrap.tsx';
// import useNotification from '@/hooks/useNotification.ts';
// import useSSEData from "@/hooks/useSSE.ts";

// const initialBoards = [
//   { id: '1', content: <PinnedCourses /> },
//   { id: '2', content: <RealtimeTable title='교양과목' /> },
//   { id: '3', content: <RealtimeTable title='전공과목' showSelect /> },
// ];

function Dashboard() {
  // useNotification();
  // const {data} = useSSEData();
  // console.log(data);

  // const [boards, setBoards] = useState(initialBoards);

  // const moveCard = (dragIndex: number, hoverIndex: number) => {
  //   const updatedBoards = [...boards];
  //   const [draggedBoard] = updatedBoards.splice(dragIndex, 1);
  //   updatedBoards.splice(hoverIndex, 0, draggedBoard);
  //   setBoards(updatedBoards);
  // };

  return (
    <div className="max-w-screen-xl mx-auto p-2 mb-8">
      <div className="container p-4 mx-auto">
        <Navbar/>


        {/*{boards.map((board, index) => (*/}
        {/*  <DragCardWrap key={board.id} id={board.id} index={index} moveCard={moveCard}>*/}
        {/*    <CardWrap>*/}
        {/*      {board.content}*/}
        {/*    </CardWrap>*/}
        {/*  </DragCardWrap>*/}
        {/*))}*/}


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