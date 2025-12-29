import { SSEType, useSseData } from '@/features/live/common/api/useSSEManager';
import useSubject, { InitSubject } from '@/entities/subjects/model/useSubject.ts';
import { Subject } from '@/utils/types.ts';

export interface SseSubject extends Subject {
  code?: string;
  name?: string;
  professor?: string | null;
  seat?: number;
  queryTime?: string;
}

// SSE 데이터와, subject 를 결합해주는 훅
function useSSESeats(sseType: SSEType) {
  const { data: subjectData } = useSubject();
  const { data: subjectIds, ...rest } = useSseData(sseType);

  const tableData = subjectIds?.map(pinSeats => {
    const { subjectId, seatCount, queryTime } = pinSeats;
    const subject = subjectData?.find(subject => subject.subjectId === subjectId) || InitSubject;
    const { subjectName, subjectCode, classCode, professorName } = subject;

    return {
      ...subject,
      code: `${subjectCode}-${classCode}`,
      name: subjectName,
      professor: professorName,
      seat: seatCount,
      queryTime,
    };
  }) as SseSubject[] | undefined;

  return { data: tableData, ...rest };
}

export default useSSESeats;
