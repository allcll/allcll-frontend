import { getStausColor } from '@/shared/config/colors.ts';
import { APPLY_STATUS } from '@/features/simulation/lib/simulation.ts';
import { ExtendedResultResponse } from '@/pages/simulation/DashboardDetail.tsx';
import { Table } from '@allcll/allcll-ui';

function SubjectDetailResult({ result }: Readonly<{ result: ExtendedResultResponse }>) {
  const { subject_results, started_at } = result;

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
        {subject_results.map(row => (
          <Table.Row key={'subject-detail-row-' + row.subject_id}>
            <Table.Cell>{row.subjectInfo?.subjectCode + '-' + row.subjectInfo?.classCode}</Table.Cell>
            <Table.Cell>{row.subjectInfo?.subjectName}</Table.Cell>
            <Table.Cell>{row.subjectInfo?.professorName}</Table.Cell>
            <Table.Cell>{row.selected_index}</Table.Cell>
            <Table.Cell>{((row.ended_at - started_at) / 1000).toFixed(2)}초</Table.Cell>
            <Table.Cell>
              <span className={`px-2 py-0.5 rounded-full text-xs ${getStausColor(row.status)}`}>
                {row.status === APPLY_STATUS.SUCCESS ? '성공' : '실패'}
              </span>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default SubjectDetailResult;
