import { useState } from 'react';
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
import useWishes from '@/hooks/server/useWishes.ts';
import { Button } from '@allcll/common/src/components/Button.tsx';

export function SimulationTestUI() {
  const [log, setLog] = useState('');
  const { data: subjects } = useWishes();

  async function handleLoadSnapshot() {
    const res = await getRecentInterestedSnapshot();
    setLog(JSON.stringify(res));
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
    const res = await startSimulation();
    setLog(JSON.stringify(res));
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
    const res = await triggerButtonEvent({ eventType: BUTTON_EVENT.SEARCH });
    setLog(JSON.stringify(res));
  }

  async function handleApplyEvent() {
    // 과목 ID 예시
    const res = await triggerButtonEvent({
      eventType: BUTTON_EVENT.APPLY,
      subjectId: 101,
    });
    setLog(JSON.stringify(res));
  }

  async function handleEndEvent() {
    // 과목 ID 예시
    const res = await triggerButtonEvent({
      eventType: BUTTON_EVENT.REFRESH,
      subjectId: 101,
      status: APPLY_STATUS.SUCCESS,
    });
    setLog(JSON.stringify(res));
  }

  async function handleStopSim() {
    await forceStopSimulation();
    setLog('Simulation forced to stop');
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <Button onClick={handleLoadSnapshot}>스냅샷 불러오기</Button>
        <Button onClick={handleSaveSnapshot}>랜덤 스냅샷 저장</Button>
        <Button onClick={handleStartSim}>시뮬레이션 시작</Button>
        <Button onClick={handleCheckOngoing}>진행 중 확인</Button>
        <Button onClick={handleSearchEvent}>검색 이벤트</Button>
        <Button onClick={handleApplyEvent}>수강신청 이벤트</Button>
        <Button onClick={handleEndEvent}>리프레시 이벤트</Button>
        <Button onClick={handleStopSim}>강제 종료</Button>
        <Button onClick={handleGetResults}>결과 확인</Button>
      </div>
      <br />
      <p className="block">{log}</p>
    </div>
  );
}
