import { useState } from 'react';
import { SEAT_UTILS_OPTIONS, useCheckCrawlerSeat } from '@/hooks/server/clawlers/useSeatClawlers';
import type { SeatUtilsType } from '@/hooks/server/clawlers/useSeatClawlers';
import { useCheckSseScheduler } from '@/hooks/server/sse/useSeatScheduler';

import { useAdminActions } from '@/hooks/useAdminActions';
import ControlRow from './ControlRow';
import { useCheckAdminSession } from '@/hooks/server/session/useAdminSession';
import { Card, Chip, Flex } from '@allcll/allcll-ui';
import { CRAWLER_SEASON_DATE } from '@allcll/common';
import SectionHeader from '../common/SectionHeader';

const SEASON_DATE = new Date(CRAWLER_SEASON_DATE);

function Control() {
  const serviceActions = useAdminActions();
  const [seatGrade, setSeatGrade] = useState<SeatUtilsType>('TOTAL');

  const { data: isActiveSession } = useCheckAdminSession();
  const { data: seatStatus } = useCheckCrawlerSeat();
  const { data: isActiveSse } = useCheckSseScheduler();

  const isSeatActive = seatStatus?.isActive ?? false;
  const isBeforeSeasonDeadline = new Date() > SEASON_DATE;

  const toggleSession = () =>
    isActiveSession?.some(session => session.isActive) ? serviceActions.session.stop() : serviceActions.session.start();

  const toggleSeat = () => {
    if (isSeatActive) return serviceActions.seat.stop();
    if (isBeforeSeasonDeadline) return serviceActions.seat.start(seatGrade);
    return serviceActions.seat.startSeason(seatGrade);
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

        <div className="space-y-3">
          <ControlRow
            label={isBeforeSeasonDeadline ? '일반 여석 크롤링' : '계절 여석 크롤링'}
            checked={isSeatActive}
            onToggle={toggleSeat}
          />
          {/* 실행 중 학년 변경은 진행 중인 크롤링에 반영되지 않으므로 비활성화 */}
          <Flex gap="gap-2" className={`flex-wrap ${isSeatActive ? 'opacity-50 pointer-events-none' : ''}`}>
            {SEAT_UTILS_OPTIONS.map(({ value, label }) => (
              <Chip
                key={value}
                label={label}
                selected={seatGrade === value}
                disabled={isSeatActive}
                onClick={() => setSeatGrade(value)}
              />
            ))}
          </Flex>
        </div>
        <ControlRow label="여석 데이터 전송" checked={isActiveSse ?? false} onToggle={toggleSse} />
      </Card.Content>
    </Card>
  );
}

export default Control;
