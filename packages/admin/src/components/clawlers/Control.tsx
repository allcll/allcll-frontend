import { useCheckCrawlerSeat } from '@/hooks/server/clawlers/useSeatClawlers';
import { useCheckSseScheduler } from '@/hooks/server/sse/useSeatScheduler';

import { useAdminActions } from '@/hooks/useAdminActions';
import ControlRow from './ControlRow';
import { useCheckAdminSession } from '@/hooks/server/session/useAdminSession';
import { Card } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';

const SEASON_DATE = new Date('2025-12-04T00:00:00+09:00');

function Control() {
  const serviceActions = useAdminActions();

  const { data: isActiveSession } = useCheckAdminSession();
  const { data: seatStatus } = useCheckCrawlerSeat();
  const { data: isActiveSse } = useCheckSseScheduler();

  const isSeatActive = seatStatus?.isActive ?? false;
  const isBeforeSeasonDeadline = new Date() > SEASON_DATE;

  const toggleSession = () =>
    isActiveSession?.some(session => session.isActive) ? serviceActions.session.stop() : serviceActions.session.start();

  const toggleSeat = (isSeason: boolean) => {
    if (isSeatActive) return serviceActions.seat.stop();
    if (isSeason) return serviceActions.seat.startSeason();
    return serviceActions.seat.start();
  };

  const toggleSse = () => (isActiveSse ? serviceActions.sse.stop() : serviceActions.sse.start());

  return (
    <Card>
      <SectionHeader title="크롤러 제어" description="크롤러의 주요 기능을 제어합니다." />

      <Card.Content>
        <ControlRow
          label="인증정보 갱신"
          checked={isActiveSession?.some(session => session.isActive) ?? false}
          onToggle={toggleSession}
        />

        {isBeforeSeasonDeadline ? (
          <ControlRow label="일반 여석 크롤링" checked={isSeatActive} onToggle={() => toggleSeat(false)} />
        ) : (
          <ControlRow label="계절 여석 크롤링" checked={isSeatActive} onToggle={() => toggleSeat(true)} />
        )}
        <ControlRow label="여석 데이터 전송" checked={isActiveSse ?? false} onToggle={toggleSse} />
      </Card.Content>
    </Card>
  );
}

export default Control;
