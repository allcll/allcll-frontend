import { useCheckAdminSession } from '@/hooks/server/session/useAdminSession';
import { formatDateTime } from '@/utils/formatTime';
import { Badge, Card, LoadingState, Table } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';

function SessionList() {
  const { data: sessionStatus, isLoading, error } = useCheckAdminSession();

  return (
    <section>
      <SectionHeader title="세션 목록" description="현재 활성화된 인증 세션 목록을 확인합니다." />

      <Card>
        <Table>
          <Table.Head>
            <Table.HeaderCell>학번</Table.HeaderCell>
            <Table.HeaderCell>시작 시간</Table.HeaderCell>
            <Table.HeaderCell>인증 세션 활성 여부</Table.HeaderCell>
          </Table.Head>

          <Table.Body>
            {isLoading && (
              <tr>
                <td colSpan={3} className="py-6">
                  <LoadingState />
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-sm">
                  세션 정보를 불러오지 못했습니다.
                </td>
              </tr>
            )}

            {!isLoading && !error && sessionStatus?.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-fg-subtle text-sm">
                  현재 실행 중인 세션이 없습니다.
                </td>
              </tr>
            )}

            {sessionStatus?.map((data, idx) => (
              <Table.Row key={data?.userId ?? idx} className="hover:bg-surface-subtle transition">
                <Table.Cell>{data?.userId}</Table.Cell>
                <Table.Cell>{formatDateTime(data?.startTime ?? '')}</Table.Cell>
                <Table.Cell>
                  <Badge color={data?.isActive ? 'success' : 'danger'}>{data?.isActive ? 'ON' : 'OFF'}</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </section>
  );
}

export default SessionList;
