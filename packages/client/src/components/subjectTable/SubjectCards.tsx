import PinCard from '@/components/subjectTable/PinCard.tsx';
import {Subject} from '@/utils/types..ts';

interface ISubjectCards {
  subjects: Subject[];
}

function SubjectCards({subjects}: ISubjectCards) {
  return (
    <div className="flex flex-col gap-2">
      {subjects.map((subject) => (
        <PinCard key={`${subject.subjectCode} ${subject.subjectId} ${subject.professorName}`} subject={subject} seats={-1}/>
      ))}
    </div>
  )
}

export default SubjectCards;