import SearchBox from '@/components/common/SearchBox';
import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import FilterSvg from '@/assets/Filter.svg?react';
import { FilteredSubjectCards } from '../subject/FilteredSubjectCards';
import { useEffect, useState } from 'react';
import { Subject } from '@/utils/types';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { disassemble } from 'es-hangul';
import useSubject from '@/hooks/server/useSubject';

function SearchBottomSheet() {
  const [searchKeywords, setSearchKeywords] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Subject[]>([]);
  const { data: subjects, isPending } = useSubject();

  const { openBottomSheet } = useBottomSheetStore();

  const handleClickFiltering = () => {
    openBottomSheet('filter');
  };

  useEffect(() => {
    console.log('searchKeywords', searchKeywords);

    const handler = setTimeout(() => {
      setSearchKeywords(searchKeywords);
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [searchKeywords, setSearchKeywords]);

  useEffect(() => {
    const cleanSearchInput = searchKeywords?.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    const disassembledSearchInput = disassemble(cleanSearchInput).toLowerCase();

    const filtered = (subjects ?? []).filter(subject => {
      const disassembledProfessorName = subject.professorName ? disassemble(subject.professorName).toLowerCase() : '';
      const cleanSubjectName = subject.subjectName.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
      const disassembledSubjectName = disassemble(cleanSubjectName).toLowerCase();

      const matchesProfessor = disassembledProfessorName.includes(disassembledSearchInput);
      const matchesSubject = disassembledSubjectName.includes(disassembledSearchInput);
      return matchesProfessor || matchesSubject;
    });

    setFilteredData(filtered);
  }, [subjects, searchKeywords]);

  return (
    <BottomSheet>
      <BottomSheetHeader
        title="과목검색"
        headerType="add"
        onClose={() => {
          openBottomSheet('edit');
        }}
      />

      <div className="flex items-center flex gap-2 py-3">
        <SearchBox
          type="text"
          placeholder="과목명 및 교수명 검색"
          value={searchKeywords}
          onChange={e => setSearchKeywords(e.target.value)}
          onDelete={() => setSearchKeywords('')}
          className="pl-10 pr-6 py-2 rounded-md w-full bg-white border border-gray-400 text-sm"
        />
        <button className="w-20 justify-center flex cursor-pointer" onClick={handleClickFiltering}>
          <FilterSvg className="w-6 h-6" />
        </button>
      </div>

      <div className="overflow-y-auto max-h-screen">
        <FilteredSubjectCards subjects={filteredData} isPending={isPending} />
      </div>
    </BottomSheet>
  );
}

export default SearchBottomSheet;
