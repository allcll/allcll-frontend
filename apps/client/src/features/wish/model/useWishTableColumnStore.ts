import { IPreRealSeat } from '@/entities/seat/api/usePreRealSeats';
import { createColumnStore, HeadTitle } from '@/shared/model/createColumnStore';
import { Wishes } from '@/shared/model/types.ts';

const WishesColumns: HeadTitle<Wishes & IPreRealSeat>[] = [
  { title: '학수번호', visible: true, key: 'subjectCode' },
  { title: '분반', visible: true, key: 'classCode' },
  { title: '개설 학과', visible: true, key: 'departmentName' },
  { title: '과목명', visible: true, key: 'subjectName' },
  { title: '교수명', visible: true, key: 'professorName' },
  { title: '관심', visible: true, key: 'totalCount' },
  { title: '여석', visible: true, key: 'seat' },

  { title: '수강학년', visible: false, key: 'studentYear' },
  { title: '수업시간', visible: false, key: 'lesnTime' },
  { title: '강의실', visible: false, key: 'lesnRoom' },
  { title: '학점', visible: false, key: 'tmNum' },
  { title: '비고', visible: false, key: 'remark' },
  { title: '수업유형', visible: false, key: 'curiTypeCdNm' },
  { title: '수업언어', visible: false, key: 'curiLangNm' },
];

export const useWishesTableStore = createColumnStore('wishes', WishesColumns);
