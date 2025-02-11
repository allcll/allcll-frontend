import PinCard from '@/components/subjectTable/PinCard.tsx';
import useInfScroll from '@/hooks/useInfScroll.ts';
import {Subject} from '@/utils/types.ts';
import SearchSvg from '@/assets/search.svg?react';

interface ISubjectCards {
  subjects: Subject[];
  isPending?: boolean;
}

function SubjectCards({subjects, isPending=false}: ISubjectCards) {
  const {visibleRows} = useInfScroll(subjects);

  return (
    <div className="flex flex-col gap-2">
      { isPending || !subjects ? (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 0, 0].map((_, idx) => (
            <div key={idx} className="bg-gray-300 shadow-sm rounded-lg p-4 h-24"/>
          ))}
        </div>
      ) : !subjects.length ? (
        <div className="text-center py-4">
          <div className="flex flex-col items-center">
            <SearchSvg className="w-12 h-12"/>
            <p className="text-gray-500 font-bold mt-4">검색된 과목이 없습니다.</p>
            <p className="text-gray-400 text-xs mt-1">다른 검색어로 다시 시도해보세요.</p>
          </div>
        </div>
      ) : subjects.slice(0, visibleRows).map((subject) => (
        <PinCard key={subject.subjectId} subject={subject} seats={-1}/>
      ))}
      <div className="load-more-trigger"></div>
    </div>
  )
}

export default SubjectCards;