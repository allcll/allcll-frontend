import { Badge, Card, Heading } from '@allcll/allcll-ui';

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
      <Heading level={3}>서비스 Open 여부</Heading>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {systemOpenStatus.map(({ name, start, end, status }) => (
          <Card key={name}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{name}</span>
              <Badge variant={status === 'OPEN' ? 'success' : 'danger'}>{status}</Badge>
            </div>
            <div className="text-xs text-gray-500">
              <p>시작: {start}</p>
              <p>종료: {end}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default ServiceOpen;
