import { Badge, Card, Flex, Grid } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';

const systemOpenStatus = [
  {
    name: '시간표',
    start: '2025-02-01 09:00',
    end: '2025-06-30 23:59',
    status: 'OPEN',
  },
  {
    name: '과목분석',
    start: '2025-02-01 09:00',
    end: '2025-06-30 23:59',
    status: 'OPEN',
  },
  {
    name: '올클연습',
    start: '2025-02-15 09:00',
    end: '2025-06-30 23:59',
    status: 'CLOSED',
  },
  {
    name: '실시간',
    start: '2025-02-01 09:00',
    end: '2025-06-30 23:59',
    status: 'OPEN',
  },
];

function ServiceOpen() {
  return (
    <section>
      <SectionHeader title="서비스 오픈 현황" description="각 서비스의 오픈 상태를 확인합니다." />

      <Grid columns={{ base: 2, sm: 4 }} gap="gap-4">
        {systemOpenStatus.map(({ name, start, end, status }) => (
          <Card key={name}>
            <Flex align="items-start" justify="justify-between">
              <span className="text-sm font-medium text-gray-700">{name}</span>
              <Badge variant={status === 'OPEN' ? 'success' : 'danger'}>{status}</Badge>
            </Flex>

            <p className="text-sm text-gray-500">시작: {start}</p>
            <p className="text-sm text-gray-500">종료: {end}</p>
          </Card>
        ))}
      </Grid>
    </section>
  );
}

export default ServiceOpen;
