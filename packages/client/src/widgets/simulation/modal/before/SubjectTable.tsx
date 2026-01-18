import { Lecture } from '@/entities/subjects/model/useLectures.ts';
import SkeletonRows from '@/shared/ui/SkeletonRows';
import { ZeroElementRow } from '@/shared/ui/ZeroElementRow';
import { Button, Flex, Label, SupportingText } from '@allcll/allcll-ui';

interface ISubjectTable {
  isLoadingLectures: boolean;
  subjects: Lecture[];
  handleRemakeSubjects?: () => void;
}

function SubjectTable({ subjects, handleRemakeSubjects, isLoadingLectures }: Readonly<ISubjectTable>) {
  const totalCredit = subjects?.reduce((acc, subject) => {
    if (!subject.tm_num) return acc;

    const credit = subject?.tm_num.split('/')[0] ?? '0';
    const subjectCredit = Number(credit) || 0;

    return acc + subjectCredit;
  }, 0);

  return (
    <>
      <Flex direction="flex-row" justify="justify-between" align="items-center">
        <Flex align="items-center">
          <Label>과목 리스트</Label>

          {handleRemakeSubjects && (
            <Button onClick={handleRemakeSubjects} size="small" variant="text">
              랜덤과목 재생성
            </Button>
          )}
        </Flex>
        <SupportingText>
          <span className="text-blue-500">{totalCredit}</span> 학점
        </SupportingText>
      </Flex>

      <div className="overflow-x-auto overflow-y-auto sm:max-w-full">
        <table className="min-w-full sm:text-sm text-xs text-left whitespace-nowrap border-t border-b border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">학수번호</th>
              <th className="px-4 py-2">분반</th>
              <th className="px-4 py-2">개설학과</th>
              <th className="px-4 py-2">과목명</th>
              <th className="px-4 py-2">교수명</th>
            </tr>
          </thead>
          <SubjectTableBody subjects={subjects} isLoadingLectures={isLoadingLectures} />
        </table>
      </div>
    </>
  );
}

function SubjectTableBody({ subjects, isLoadingLectures }: { subjects: Lecture[]; isLoadingLectures: boolean }) {
  if (isLoadingLectures) {
    return <SkeletonRows col={5} row={8} />;
  }

  if (subjects.length === 0) {
    return (
      <ZeroElementRow
        col={5}
        title="선택된 과목이 없습니다."
        description="과목을 선택하거나 랜덤 과목 생성을 통해 과목을 추가해보세요."
      />
    );
  }

  return (
    <tbody>
      {!isLoadingLectures ? (
        subjects.map((subject, index) => (
          <tr key={subject.subjectId ?? index} className="border border-gray-200">
            <td className="px-4 py-2">{subject.subjectCode}</td>
            <td className="px-4 py-2">{subject.classCode}</td>
            <td className="px-4 py-2">{subject.departmentName}</td>
            <td className="px-4 py-2">{subject.subjectName}</td>
            <td className="px-4 py-2">{subject.professorName}</td>
          </tr>
        ))
      ) : (
        <SkeletonRows col={5} row={8} />
      )}
    </tbody>
  );
}

export default SubjectTable;
