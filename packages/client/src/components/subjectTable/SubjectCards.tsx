import PinCard from '@/components/subjectTable/PinCard.tsx';
import {Subject} from '@/utils/types..ts';

interface ISubjectCards {
  subjects: Subject[];
}

function SubjectCards({subjects}: ISubjectCards) {
  return (
    <div className="flex flex-col gap-2">
      {subjects.map((subject) => (
        <PinCard key={`${subject.code} ${subject.name} ${subject.professor}`} subject={subject}/>
      ))}
    </div>
  )
}

export default SubjectCards;