import Card from '@allcll/common/components/Card';

import { useCheckSessionAlive } from '@/hooks/server/session/useCheckService';
import { useCheckCrawlerSeat } from '@/hooks/server/clawlers/useSeatClawlers';
import { useCheckSseScheduler } from '@/hooks/server/sse/useSeatScheduler';

import UpdateData from './UpdateData';
import { useAdminActions } from '@/hooks/useAdminActions';
import ControlRow from './ControlRow';

const SEASON_DATE = new Date('2025-12-04T00:00:00+09:00');

function Control() {
  const serviceActions = useAdminActions();

  const { data: isActiveSession } = useCheckSessionAlive();
  const { data: seatStatus } = useCheckCrawlerSeat();
  const { data: isActiveSse } = useCheckSseScheduler();

  const isSeatActive = seatStatus?.isActive ?? false;
  const isBeforeSeasonDeadline = new Date() > SEASON_DATE;

  const toggleSession = () => (isActiveSession ? serviceActions.session.stop() : serviceActions.session.start());

  const toggleSeat = (isSeason: boolean) => {
    if (isSeatActive) return serviceActions.seat.stop();
    if (isSeason) return serviceActions.seat.startSeason();
    return serviceActions.seat.start();
  };

  const toggleSse = () => (isActiveSse ? serviceActions.sse.stop() : serviceActions.sse.start());

  return (
    <Card>
      <h3 className="text-md font-semibold mb-3">크롤러 실행 제어</h3>
      <p className="text-sm text-gray-500 mb-4">크롤러의 특정 기능을 제어합니다.</p>

      <div className="space-y-4">
        <ControlRow label="인증정보 갱신" checked={isActiveSession ?? false} onToggle={toggleSession} />

        {isBeforeSeasonDeadline ? (
          <ControlRow label="일반 여석 크롤링" checked={isSeatActive} onToggle={() => toggleSeat(false)} />
        ) : (
          <ControlRow label="계절 여석 크롤링" checked={isSeatActive} onToggle={() => toggleSeat(true)} />
        )}
        <ControlRow label="여석 데이터 전송" checked={isActiveSse ?? false} onToggle={toggleSse} />
        <UpdateData />
      </div>
    </Card>
  );
}

export default Control;
