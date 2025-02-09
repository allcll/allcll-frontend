import PinCard from '@/components/subjectTable/PinCard.tsx';
import {Subject} from '@/utils/types.ts';
import useInfScroll from '@/hooks/useInfScroll.ts';

interface ISubjectCards {
  subjects: Subject[];
}

function SubjectCards({subjects}: ISubjectCards) {
  const {visibleRows} = useInfScroll(subjects);

  return (
    <div className="flex flex-col gap-2">
      {subjects.slice(0, visibleRows).map((subject) => (
        <PinCard key={subject.subjectId} subject={subject} seats={-1}/>
      ))}
      <div className="load-more-trigger"></div>
    </div>
  )
}

export default SubjectCards;