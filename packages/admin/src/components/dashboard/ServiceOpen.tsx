import Card from '@allcll/common/components/Card';
import InfoChip from '@allcll/common/components/chip/InfoChip';
import { getDateLocale } from '@/utils/time.ts';

const isDevServer = import.meta.env.VITE_DEV_SERVER === 'true';
const systemOpenStatus = [
  {
    name: '시간표',
    start: '2025-07-18 09:00',
    end: '2025-12-31 23:59',
  },
  {
    name: '과목분석',
    start: '2025-07-18 09:00',
    end: '2025-12-31 23:59',
  },
  {
    name: '올클연습',
    start: '2025-07-18 09:00',
    end: '2025-12-31 23:59',
  },
  {
    name: '실시간',
    start: `${isDevServer ? '2025-08-01' : '2025-08-11'} 09:00`,
    end: '2025-09-30 23:59',
  },
];

function ServiceOpen() {
  const now = new Date();
  const SYSTEM_STATUS = systemOpenStatus.map(rest => {
    const isOpen = getDateLocale(rest.start) <= now && now < getDateLocale(rest.end);
    return { ...rest, status: isOpen ? 'OPEN' : 'CLOSED' };
  });

  return (
    <section>
      <h2 className="text-lg text-gray-700 font-bold mb-4">서비스 Open 여부</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SYSTEM_STATUS.map(({ name, start, end, status }) => (
          <Card key={name} className="h-[120px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{name}</span>
              <InfoChip label={status} type={status === 'OPEN' ? 'success' : 'error'} />
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
