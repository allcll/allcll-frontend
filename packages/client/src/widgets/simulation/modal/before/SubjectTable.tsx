import { Lecture } from '@/entities/subjects/model/useLectures.ts';
import SkeletonRows from '@/shared/ui/SkeletonRows';
import { ZeroElementRow } from '@/shared/ui/ZeroElementRow';
import { Button, Flex, Label, SupportingText, Table } from '@allcll/allcll-ui';

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
    <Flex direction="flex-col" gap="gap-1.5">
      <Flex direction="flex-row" justify="justify-between" align="items-center">
        <Flex align="items-center" gap="gap-1">
          <Label>수강신청 연습 과목 리스트</Label>

          {handleRemakeSubjects && (
            <Button onClick={handleRemakeSubjects} size="small" variant="text" className="-my-1.5">
              랜덤 과목 재생성
            </Button>
          )}
        </Flex>
        <SupportingText>
          <span className="text-primary-500">{totalCredit}</span> 학점
        </SupportingText>
      </Flex>

      <Table scrollClassName="h-[290px] overflow-y-auto">
        <Table.Head sticky>
          <Table.HeaderCell>학수번호</Table.HeaderCell>
          <Table.HeaderCell>분반</Table.HeaderCell>
          <Table.HeaderCell>개설학과</Table.HeaderCell>
          <Table.HeaderCell>과목명</Table.HeaderCell>
          <Table.HeaderCell>교수명</Table.HeaderCell>
        </Table.Head>
        <Table.Body>
          <SubjectTableBody subjects={subjects} isLoadingLectures={isLoadingLectures} />
        </Table.Body>
      </Table>
    </Flex>
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
    <>
      {subjects.map((subject, index) => (
        <Table.Row key={subject.subjectId ?? index}>
          <Table.Cell>{subject.subjectCode}</Table.Cell>
          <Table.Cell>{subject.classCode}</Table.Cell>
          <Table.Cell>{subject.departmentName}</Table.Cell>
          <Table.Cell>{subject.subjectName}</Table.Cell>
          <Table.Cell>{subject.professorName}</Table.Cell>
        </Table.Row>
      ))}
    </>
  );
}

export default SubjectTable;
