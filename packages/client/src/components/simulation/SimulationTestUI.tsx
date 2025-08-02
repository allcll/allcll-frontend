import React, { useState, useRef } from 'react';
import useWishes from '@/hooks/server/useWishes.ts';
import {
  startSimulation,
  checkOngoingSimulation,
  getSummaryResult,
  triggerButtonEvent,
  forceStopSimulation,
  BUTTON_EVENT,
  APPLY_STATUS,
} from '@/utils/simulation/simulation.ts';
import { getRecentInterestedSnapshot, saveInterestedSnapshot } from '@/utils/simulation/subjects.ts';
import { InterestedSubject } from '@/utils/dbConfig.ts';
import { backupDatabase, restoreDatabase } from '@/utils/simulation/backupData.ts';
import useLectures from '@/hooks/server/useLectures';

export function SimulationTestUI() {
  const [log, setLog] = useState('');
  const { data: subjects } = useWishes();
  const snapshots = useRef<InterestedSubject[] | null>(null);
  const clickIndex = useRef(0);
  const lectures = useLectures();

  async function handleLoadSnapshot() {
    const res = await getRecentInterestedSnapshot();
    setLog(JSON.stringify(res));

    snapshots.current = res?.subjects ?? null;
    clickIndex.current = 0;
  }

  async function handleSaveSnapshot() {
    let subjectIds: number[] = [];
    if (subjects) {
      const shuffled = subjects.sort(() => 0.5 - Math.random());
      subjectIds = shuffled.slice(0, 7).map(s => s.subjectId);
    }
    const res = await saveInterestedSnapshot(subjectIds);
    setLog(JSON.stringify(res));
  }

  async function handleStartSim() {
    const res = await startSimulation('TestPK', 'DEPT_CODE', 'Test 학과');
    setLog(JSON.stringify(res));

    clickIndex.current = 0;
  }

  async function handleCheckOngoing() {
    const res = await checkOngoingSimulation();
    setLog(JSON.stringify(res));
  }

  async function handleGetResults() {
    // 1번 시뮬레이션 결과 예시
    const res = await getSummaryResult({ simulationId: 1 });
    setLog(JSON.stringify(res));
  }

  async function handleSearchEvent() {
    const res = await triggerButtonEvent({ eventType: BUTTON_EVENT.SEARCH }, lectures);
    setLog(JSON.stringify(res));
  }

  async function handleApplyEvent() {
    // 과목 ID 예시
    const res = await triggerButtonEvent(
      {
        eventType: BUTTON_EVENT.APPLY,
        subjectId: snapshots.current?.[clickIndex.current % 7].subject_id ?? -1,
      },
      lectures,
    );
    setLog(JSON.stringify(res));
  }

  // 과목 신청 이벤트
  async function handleSubmitSubject() {
    const res = await triggerButtonEvent(
      {
        eventType: BUTTON_EVENT.SUBJECT_SUBMIT,
        subjectId: snapshots.current?.[clickIndex.current % 7].subject_id ?? -1,
      },
      lectures,
    );
    setLog(getApplyStatusName(res.status));
  }

  // 과목 한번 더 담는 시뮬
  async function handleEndAgainEvent() {
    const res = await triggerButtonEvent(
      {
        eventType: BUTTON_EVENT.SKIP_REFRESH,
        subjectId: snapshots.current?.[clickIndex.current % 7].subject_id ?? -1,
      },
      lectures,
    );
    setLog(JSON.stringify(res));
  }

  async function handleEndEvent() {
    // 과목 ID 예시
    const res = await triggerButtonEvent(
      {
        eventType: BUTTON_EVENT.REFRESH,
        subjectId: snapshots.current?.[clickIndex.current++ % 7].subject_id ?? -1,
      },
      lectures,
    );
    setLog(JSON.stringify(res));
  }

  async function handleStopSim() {
    await forceStopSimulation();
    setLog('Simulation forced to stop');
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      restoreDatabase(file).then();
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <Button onClick={handleLoadSnapshot}>스냅샷 불러오기</Button>
        <Button onClick={handleSaveSnapshot}>랜덤 스냅샷 저장</Button>
        <Button onClick={handleStartSim}>시뮬레이션 시작</Button>
        <Button onClick={handleCheckOngoing}>진행 중 확인</Button>
        <Button onClick={handleSearchEvent}>검색 이벤트</Button>
        <Button onClick={handleApplyEvent}>APPLY 이벤트</Button>
        <Button onClick={handleSubmitSubject}>SUBJECT_SUBMIT 이벤트</Button>
        <Button onClick={handleEndAgainEvent}>SKIP_REFRESH 이벤트</Button>
        <Button onClick={handleEndEvent}>REFRESH 이벤트</Button>
        <Button onClick={handleStopSim}>강제 종료</Button>
        <Button onClick={handleGetResults}>결과 확인</Button>
        <Button onClick={backupDatabase}>데이터베이스 다운로드</Button>
        <input type="file" placeholder="데이터베이스 업로드" multiple={false} onChange={handleFileUpload} />
      </div>
      <br />
      <p className="block">{log}</p>
    </div>
  );
}

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ children, className, variant = 'primary', ...props }: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-xl font-semibold transition-colors duration-200 focus:outline-none';
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  };

  return (
    <button className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </button>
  );
};

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

function getApplyStatusName(status: APPLY_STATUS) {
  switch (status) {
    case APPLY_STATUS.PROGRESS:
      return '진행 중';
    case APPLY_STATUS.SUCCESS:
      return '신청 완료';
    case APPLY_STATUS.FAILED:
      return '신청 실패';
    case APPLY_STATUS.CANCELED:
      return '신청 취소';
    case APPLY_STATUS.CAPTCHA_FAILED:
      return 'CAPTCHA 실패';
    case APPLY_STATUS.NOT_ELIGIBLE:
      return '신청 자격 없음';
    default:
      return '알 수 없음';
  }
}
