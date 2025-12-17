import SearchBox from '@/features/filtering/ui/SearchBox.tsx';
import useLectures, { Lecture } from '@/hooks/server/useLectures.ts';
import useInfScroll from '@/shared/lib/useInfScroll.ts';
import { disassemble } from 'es-hangul';
import { useState, useEffect } from 'react';

interface ISearchSubjects {
  handleAddSubject: (subject: Lecture) => void;
}

function SearchSubjects({ handleAddSubject }: ISearchSubjects) {
  const [searchKeywords, setSearchKeywords] = useState('');
  const { data: lectures } = useLectures();
  const [filteredData, setFilteredData] = useState<Lecture[]>([]);

  const filteringSearchKeywords = (lectures: Lecture[]): Lecture[] => {
    const clearnSearchInput = searchKeywords.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    const disassembledSearchInput = disassemble(clearnSearchInput).toLowerCase();

    return lectures.filter(subject => {
      const disassembledProfessorName = subject.professorName ? disassemble(subject.professorName).toLowerCase() : '';
      const cleanSubjectName = subject.subjectName.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
      const disassembledSubjectName = disassemble(cleanSubjectName).toLowerCase();

      const matchesProfessor = disassembledProfessorName.includes(disassembledSearchInput);
      const matchesSubject = disassembledSubjectName.includes(disassembledSearchInput);

      return matchesProfessor || matchesSubject;
    });
  };

  useEffect(() => {
    if (!lectures || lectures.length === 0) return;

    const filtered = filteringSearchKeywords(lectures);
    setFilteredData(filtered);
  }, [searchKeywords, lectures]);

  return (
    <div className="overflow-y-auto flex-grow">
      <SearchBox
        value={searchKeywords}
        onChange={e => setSearchKeywords(e.target.value)}
        onDelete={() => setSearchKeywords('')}
      />

      <div className="bg-white mt-6 p-2 shadow-md rounded-lg overflow-x-auto">
        {filteredData.length > 0 ? (
          <Table subjects={filteredData} handleAddSubject={handleAddSubject} />
        ) : (
          <div className="p-6 text-center text-gray-500">검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default SearchSubjects;

const Table = ({
  subjects,
  handleAddSubject,
}: {
  subjects: Lecture[];
  handleAddSubject: (subject: Lecture) => void;
}) => {
  const { visibleRows, loadMoreRef } = useInfScroll(subjects, 'ref');

  return (
    <div className="h-120 flex flex-col gap-2 overflow-y-auto">
      {subjects.slice(0, visibleRows).map(subject => {
        return (
          <div className={`border border-gray-200 rounded-lg p-3 sm:p-4 gap-1 sm:gap-2 flex flex-col cursor-pointer`}>
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">{subject.subjectName}</h3>
              <span className="text-xs ext-gray-500">{subject.professorName}</span>
            </div>
            <span className="text-xs text-gray-500">{subject.lesn_time}</span>
            <span className="text-xs text-gray-500">{subject.lesn_room}</span>
            <span className="text-xs text-gray-500">{subject.departmentName}</span>

            <div className="flex justify-between items-center">
              <button
                onClick={() => handleAddSubject(subject)}
                className="bg-blue-500 border-none cursor-pointer rounded-xl px-2 py-0.5 sm:px-2.5 sm:py-1 text-white text-xs sm:text-sm hover:bg-blue-600"
              >
                추가하기
              </button>
            </div>
          </div>
        );
      })}
      {visibleRows < subjects.length && <div ref={loadMoreRef} className="load-more-trigger w-full h-20"></div>}
    </div>
  );
};
