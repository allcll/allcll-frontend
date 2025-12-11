import { Grid } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';
import StatusCard from './StatusCard';
import { useSystemStatus } from '@/hooks/useSystemStatus';

export enum SystemStatusKey {
  SESSION = 'SESSION',
  SEAT = 'SEAT',
  SSE_CONNECTION = 'SSE_CONNECTION',
  SSE_DATA = 'SSE_DATA',
}

export const STATUS_CONFIG = {
  [SystemStatusKey.SESSION]: { title: '인증 세션' },
  [SystemStatusKey.SEAT]: { title: '여석 크롤링' },
  [SystemStatusKey.SSE_CONNECTION]: { title: 'SSE 연결' },
  [SystemStatusKey.SSE_DATA]: { title: 'SSE 여석 데이터' },
} as const;

function SystemChecking() {
  const statusData = useSystemStatus();

  return (
    <section>
      <SectionHeader title="시스템 상태 점검" description="시스템의 상태를 확인합니다." />

      <Grid columns={{ sm: 2, md: 4 }} gap="gap-4">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const { active, description } = statusData[key as SystemStatusKey];
          return <StatusCard key={key} title={config.title} status={active ? 'ON' : 'OFF'} description={description} />;
        })}
      </Grid>
    </section>
  );
}

export default SystemChecking;
