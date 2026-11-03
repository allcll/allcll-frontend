import { AggregatedResultResponse, ISubjectsAnalysis } from '@/features/simulation/lib/result.ts';
import useWishes from '@/entities/wishes/model/useWishes.ts';
import { Wishes } from '@/shared/model/types.ts';
import { useMemo } from 'react';
import { Table } from '@allcll/allcll-ui';

function SubjectAllResult({ result }: Readonly<{ result: AggregatedResultResponse }>) {
  const { data: subjectNames } = useWishes();
  const resultInfo = useMemo(() => joinSubjectInfo(subjectNames, result.subjects), [subjectNames, result]);

  return (
    <Table>
      <Table.Head>
        <Table.HeaderCell>학수번호</Table.HeaderCell>
        <Table.HeaderCell>과목명</Table.HeaderCell>
        <Table.HeaderCell>교수명</Table.HeaderCell>
        <Table.HeaderCell>순위</Table.HeaderCell>
        <Table.HeaderCell>관심 시간</Table.HeaderCell>
        <Table.HeaderCell>성공/실패</Table.HeaderCell>
      </Table.Head>
      <Table.Body>
        {resultInfo.map(row => (
          <Table.Row key={row.subjectId}>
            <Table.Cell>{row.subjectCode + '-' + row.classCode}</Table.Cell>
            <Table.Cell>{row.subjectName}</Table.Cell>
            <Table.Cell>{row.professorName}</Table.Cell>
            <Table.Cell>{row.avgIndex.toFixed(2)}</Table.Cell>
            <Table.Cell>{row.avgCompletionTime.toFixed(2) + ' sec'}</Table.Cell>
            <Table.Cell>
              <span className="px-1 py-0.5 rounded-full text-xs font-bold text-green-500">{row.successCount}</span>/
              <span className="px-1 py-0.5 rounded-full text-xs font-bold text-danger-500">{row.failedCount}</span>/
              <span className="px-1 py-0.5 rounded-full text-xs font-bold text-gray-500">{row.doubledCount}</span>/
              <span className="px-1 py-0.5 rounded-full text-xs font-bold">{row.totalCount}</span>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

interface ISubjectAnalysis extends ISubjectsAnalysis {
  subjectName: string;
  departmentName: string;
  departmentCode: string;
  subjectCode: string;
  classCode: string;
  professorName: string | null;
}

function joinSubjectInfo(subjectNames?: Wishes[], result?: ISubjectsAnalysis[]): ISubjectAnalysis[] {
  if (!result || !subjectNames) return [];

  const findSubjectsById = (subjectId: number) => {
    return subjectNames.find(subject => subject.subjectId === subjectId);
  };

  return result.map(item => {
    const subjectInfo = findSubjectsById(item.subjectId);
    return {
      ...item,
      subjectName: subjectInfo?.subjectName || '',
      departmentName: subjectInfo?.departmentName || '',
      departmentCode: subjectInfo?.departmentCode || '',
      subjectCode: subjectInfo?.subjectCode || '',
      classCode: subjectInfo?.classCode || '',
      professorName: subjectInfo?.professorName || null,
    };
  });
}

export default SubjectAllResult;
