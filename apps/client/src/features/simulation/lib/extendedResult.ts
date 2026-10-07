import type { Lecture } from '@/entities/subjects/model/useLectures.ts';
import type { ResultResponse } from './result.ts';

/** 수강신청 연습 결과에 과목 정보를 붙인 타입입니다. 결과 상세 화면의 위젯들이 함께 써서 페이지 밖에 둡니다. */
export interface ExtendedResultResponse extends ResultResponse {
  subject_results: (ResultResponse['subject_results'][number] & { subjectInfo?: Lecture })[];
  timeline: (ResultResponse['timeline'][number] & { subjectInfo?: Lecture })[];
  result?: ExtendedResultResponse;
}
