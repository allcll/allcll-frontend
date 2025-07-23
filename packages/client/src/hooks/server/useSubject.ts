import { fetchJsonOnAPI } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

// export const TableHeaderNames = [
//   { name: 'id', key: 'subjectId' },
//   { name: '과목코드', key: 'subjectCode' },
//   { name: '과목명', key: 'subjectName' },
//   { name: '분반', key: 'classCode' },
//   { name: '담당교수', key: 'professorName' },
//   { name: '학점', key: 'credit' },
// ];

export interface Subject {
  subjectId: number; // 과목 ID
  subjectName: string; // 과목명
  departmentName: string; // 학과명
  departmentCode: string; // 학과 코드
  subjectCode: string; // 과목코드
  classCode: string; // 분반
  professorName: string; // 교수명
  totalCount: number; // 총 수강 인원
  //새로 추가되는 필드
  language: string; // 수업 언어
  subjectType: string; // 수업 유형
  semester_at: number; // 학기
  lesn_time: string; // 수업 시간
  lesn_room: string; // 수업실
  tm_num: string; // 학점
}

// hook 수정
// export const useSubjectTable = () => {
//   const [data, setData] = useState<Subject[]>([]);
//   const [isPending, setIsPending] = useState(true);

//   useEffect(() => {
//     fetch('/api/subjects')
//       .then(response => response.json())
//       .then(data => {
//         setData(data);
//         setIsPending(false);
//       });
//   }, []);

//   return {
//     subjects: data,
//     isPending,
//   };
// };

type SubjectResponse = {
  default: Subject[];
  subjects: Subject[];
};

const fetchSubjects = async () => {
  return await fetchJsonOnAPI<SubjectResponse>('/api/subjects');
};

function useSubject() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
    staleTime: Infinity,
    select: data => data.subjects,
  });
}

export default useSubject;
