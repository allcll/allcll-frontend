import { useCheckCrawlerSeat } from '@/hooks/server/clawlers/useSeatClawlers';
import type { SeatUtilsType } from '@/hooks/server/clawlers/useSeatClawlers';
import { useCheckSseScheduler } from '@/hooks/server/sse/useSeatScheduler';

import { useAdminActions } from '@/hooks/useAdminActions';
import ControlRow from './ControlRow';
import { useCheckAdminSession } from '@/hooks/server/session/useAdminSession';
import { Card, ListboxOption } from '@allcll/allcll-ui';
import { Filtering } from '@allcll/common';
import SectionHeader from '../common/SectionHeader';
import { useState } from 'react';

const SEASON_DATE = new Date('2026-06-05T00:00:00+09:00');

const SEAT_UTILS_OPTIONS = [
  { value: 'TOTAL' as const, label: '전체' },
  { value: 'GRADE_1' as const, label: '1학년' },
  { value: 'GRADE_2' as const, label: '2학년' },
  { value: 'GRADE_3' as const, label: '3학년' },
  { value: 'GRADE_4' as const, label: '4학년' },
];

function Control() {
  const serviceActions = useAdminActions();
  const [normalSeatGrade, setNormalSeatGrade] = useState<SeatUtilsType>('TOTAL');
  const [seasonSeatGrade, setSeasonSeatGrade] = useState<SeatUtilsType>('TOTAL');

  const { data: isActiveSession } = useCheckAdminSession();
  const { data: seatStatus } = useCheckCrawlerSeat();
  const { data: isActiveSse } = useCheckSseScheduler();

  const isSeatActive = seatStatus?.isActive ?? false;
  const isBeforeSeasonDeadline = new Date() > SEASON_DATE;

  const toggleSession = () =>
    isActiveSession?.some(session => session.isActive) ? serviceActions.session.stop() : serviceActions.session.start();

  const toggleSeat = (isSeason: boolean) => {
    if (isSeatActive) return serviceActions.seat.stop();
    if (isSeason) return serviceActions.seat.startSeason(seasonSeatGrade);
    return serviceActions.seat.start(normalSeatGrade);
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
          <div>
            <ControlRow label="일반 여석 크롤링" checked={isSeatActive} onToggle={() => toggleSeat(false)} />
            <Filtering
              label={`학년: ${SEAT_UTILS_OPTIONS.find(o => o.value === normalSeatGrade)?.label}`}
              selected={normalSeatGrade !== 'TOTAL'}
            >
              <div className="flex flex-col gap-1 min-w-32">
                {SEAT_UTILS_OPTIONS.map(option => (
                  <ListboxOption
                    key={option.value}
                    selected={normalSeatGrade === option.value}
                    onSelect={() => setNormalSeatGrade(option.value)}
                    left={option.label}
                  />
                ))}
              </div>
            </Filtering>
          </div>
        ) : (
          <div>
            <ControlRow label="계절 여석 크롤링" checked={isSeatActive} onToggle={() => toggleSeat(true)} />
            <Filtering
              label={`학년: ${SEAT_UTILS_OPTIONS.find(o => o.value === seasonSeatGrade)?.label}`}
              selected={seasonSeatGrade !== 'TOTAL'}
            >
              <div className="flex flex-col gap-1 min-w-32">
                {SEAT_UTILS_OPTIONS.map(option => (
                  <ListboxOption
                    key={option.value}
                    selected={seasonSeatGrade === option.value}
                    onSelect={() => setSeasonSeatGrade(option.value)}
                    left={option.label}
                  />
                ))}
              </div>
            </Filtering>
          </div>
        )}
        <ControlRow label="여석 데이터 전송" checked={isActiveSse ?? false} onToggle={toggleSse} />
      </Card.Content>
    </Card>
  );
}

export default Control;
