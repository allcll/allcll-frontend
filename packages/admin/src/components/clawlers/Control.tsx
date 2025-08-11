import Card from '@allcll/common/components/Card';
import Toggle from '../common/Toggle';
import { useCancelSessionKeepAlive, useStartSessionKeepAlive } from '@/hooks/server/session/useSessionKeepAlive';
import { useState } from 'react';
import {
  useCancelCrawlersSeat,
  useCheckCrawlerSeat,
  useStartCrawlersSeat,
} from '@/hooks/server/clawlers/useSeatClawlers';
import { useCancelSseScheduler, useCheckSseScheduler, useStartSseScheduler } from '@/hooks/server/sse/useSeatScheduler';
import UpdateData from './UpdateData';
import { useCheckSessionAlive } from '@/hooks/server/session/useCheckService';

function Control() {
  const { mutate: startSessionKeepAlive } = useStartSessionKeepAlive();
  const { mutate: cancelSessionKeepAlive } = useCancelSessionKeepAlive();

  const { mutate: startClawlersSeat } = useStartCrawlersSeat();
  const { mutate: cancelClawlerSeat } = useCancelCrawlersSeat();

  const { mutate: startSseScheduler } = useStartSseScheduler();
  const { mutate: cancelSseScheduler } = useCancelSseScheduler();

  const { data: isActiveSession } = useCheckSessionAlive();
  const { data: isActiveSeat } = useCheckCrawlerSeat();
  const { data: isSentSseData } = useCheckSseScheduler();

  const [checked, setChecked] = useState({
    session: isActiveSession ?? false,
    seat: isActiveSeat ?? false,
    sseData: isSentSseData ?? false,
  });

  const toggleSessionKeepAlive = () => {
    if (checked.session) {
      cancelSessionKeepAlive();
      setChecked({
        ...checked,
        session: false,
      });
      return;
    }

    if (!checked.session) {
      startSessionKeepAlive();
      setChecked({
        ...checked,
        session: true,
      });
    }
  };

  const toggleSeatKeepAlive = () => {
    if (checked.seat) {
      cancelClawlerSeat();

      setChecked({
        ...checked,
        seat: false,
      });
      return;
    }

    if (!checked.seat) {
      startClawlersSeat();

      setChecked({
        ...checked,
        seat: true,
      });
    }
  };

  const toggleSseSchedule = () => {
    if (checked.sseData) {
      cancelSseScheduler();
      setChecked({
        ...checked,
        sseData: false,
      });
      return;
    }
    if (!checked.sseData) {
      startSseScheduler();

      setChecked({
        ...checked,
        sseData: true,
      });
    }
  };

  return (
    <Card>
      <h3 className="text-md font-semibold mb-3">크롤러 실행 제어</h3>
      <p className="text-sm text-gray-500 mb-4">크롤러의 특정 기능을 제어하고 데이터를 업데이트합니다.</p>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">인증정보 갱신 기능 제어</span>
          <Toggle checked={checked.session} onChange={toggleSessionKeepAlive} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">여석 크롤링 제어</span>
          <Toggle checked={checked.seat} onChange={toggleSeatKeepAlive} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">여석 데이터 전송 제어</span>
          <Toggle checked={checked.sseData} onChange={toggleSseSchedule} />
        </div>

        <UpdateData />
      </div>
    </Card>
  );
}

export default Control;
