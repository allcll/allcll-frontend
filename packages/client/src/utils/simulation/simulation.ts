import { db } from '@/utils/dbConfig.ts';
import { getRecentInterestedSnapshot } from '@/utils/simulation/subjects.ts';

export enum BUTTON_EVENT {
  SEARCH,
  APPLY,
  CAPTCHA,
  CANCEL_SUBMIT,
  SUBJECT_SUBMIT,
  REFRESH,
  SKIP_REFRESH,
}

export enum APPLY_STATUS {
  PROGRESS,
  SUCCESS,
  FAILED,
  DOUBLED,
  CAPTCHA_FAILED,
  NOT_ELIGIBLE,
  CANCELED,
}

/**
 * 진행 중인 시뮬레이션 확인
 * 현재 진행중인 시뮬레이션이 있는지 확인합니다.
 * 진행중인 시뮬레이션이 있다면 해당 simulation_id 를 반환하고, 없다면 simulation_id=-1 을 반환합니다
 * 사용자가 시뮬레이션 페이지에 들어왔을 때 확인합니다.
 * @returns { simulation_id: number } */
export async function checkOngoingSimulation() {
  const ongoing = await getOngoingSimulation();

  return {
    simulation_id: ongoing ? ongoing.simulation_run_id : -1,
  };
}

/**
 * 진행중인 시뮬레이션을 반환합니다.
 * 진행중인 시뮬레이션이 없다면, null 을 반환합니다.
 * @returns {SimulationRun|null} */
async function getOngoingSimulation() {
  const ongoing = await db.simulation_run.filter(run => run.ended_at === -1).last();

  return ongoing ?? null;
}

/**
 * 시뮬레이션 시작
 * 진행 중인 시뮬레이션을 확인 후,
 * 진행 중인 시뮬레이션이 존재하면, 해당 simulation_id 를 반환,
 * 진행 중인 시뮬레이션이 존재하지 않으면, 새로운 simulation_id 반환 후 시뮬레이션 테이블 생성
 * @returns { simulation_id: number, isRunning?: true } */
export async function startSimulation() {
  const ongoing = await checkOngoingSimulation();
  if (ongoing.simulation_id !== -1) {
    return { simulation_id: ongoing.simulation_id, isRunning: true };
  }

  const recent = await getRecentInterestedSnapshot();
  if (!recent) {
    return {
      errMsg: 'SNAPSHOT_NOT_EXIST',
    };
  }

  await db.interested_snapshot.update(recent.snapshot_id, { simulated: true });

  // 시뮬레이션 시작
  const subjects = recent.subjects;
  const newId = await db.simulation_run.add({
    snapshot_id: recent.snapshot_id,
    user_id: 'Todo: user',
    success_subject_count: 0,
    subject_count: subjects.length,
    accuracy: -1,
    score: -1,
    total_elapsed: -1,
    search_event_at: -1,
    started_at: Date.now(),
    ended_at: -1,
  });

  return { simulation_id: newId, isRunning: true };
}

// 타입 정의
type ButtonEventSearchReq = {
  eventType: BUTTON_EVENT.SEARCH;
};
type ButtonEventApplyReq = {
  eventType: Exclude<BUTTON_EVENT, BUTTON_EVENT.REFRESH | BUTTON_EVENT.SKIP_REFRESH | BUTTON_EVENT.SEARCH>;
  subjectId: number;
};
type ButtonEventEndReq = {
  eventType: BUTTON_EVENT.REFRESH | BUTTON_EVENT.SKIP_REFRESH;
  subjectId: number;
  status: APPLY_STATUS;
};

/**
 * 버튼 이벤트 실행
 * 시뮬레이션에 있는 버튼을 클릭 할 때 마다 발생시켜야 하는 이벤트
 * */
export async function triggerButtonEvent(input: ButtonEventSearchReq): Promise<{ elapsed_time: number }>;
export async function triggerButtonEvent(input: ButtonEventApplyReq): Promise<{}>;
export async function triggerButtonEvent(input: ButtonEventEndReq): Promise<{ finished: boolean }>;
export async function triggerButtonEvent(input: ButtonEventSearchReq | ButtonEventApplyReq | ButtonEventEndReq) {
  const { eventType } = input;
  const ongoing = await getOngoingSimulation();

  if (!ongoing) {
    return {
      errMsg: 'ONGOING_SIMULATION_NOT_FOUND',
    };
  }

  const latestSimulationId = ongoing.simulation_run_id;
  if (eventType === BUTTON_EVENT.SEARCH) {
    const time = Date.now();
    await db.simulation_run.update(latestSimulationId, {
      search_event_at: time,
    });

    return { elapsed_time: time - ongoing.started_at };
  }

  const { subjectId } = input as ButtonEventApplyReq;
  if (eventType === BUTTON_EVENT.APPLY) {
    const selected = await db.simulation_run_selections.filter(run => run.ended_at === eventType).toArray();

    const selectionId = await db.simulation_run_selections.add({
      simulation_run_id: ongoing.simulation_run_id,
      interested_id: subjectId,
      selected_index: selected.length + 1, // ???
      status: APPLY_STATUS.PROGRESS,
      started_at: Date.now(),
      ended_at: -1,
    });

    await db.simulation_run_events.add({
      simulation_section_id: selectionId,
      event_type: eventType,
      timestamp: Date.now(),
    });

    return {};
  }

  const selections = await db.simulation_run_selections
    .filter(selection => selection.simulation_run_id === latestSimulationId && selection.interested_id === subjectId)
    .toArray();
  const latestSelection = selections[selections.length - 1]; //마지막이 나올까요?
  if (!latestSelection) {
    return {
      errMsg: 'SELECTION_NOT_FOUND',
    };
  }

  await db.simulation_run_events.add({
    simulation_section_id: latestSelection.run_selections_id,
    event_type: eventType,
    timestamp: Date.now(),
  });

  if (eventType === BUTTON_EVENT.REFRESH || eventType === BUTTON_EVENT.SKIP_REFRESH) {
    const { status } = input as ButtonEventEndReq;

    await db.simulation_run_selections.update(latestSelection.run_selections_id, {
      status,
      ended_at: Date.now(),
    });

    const isFinished = await isSimulationFinished();
    if (isFinished) {
      await endCurrentSimulation();
    }

    return { finished: isFinished };
  }

  return {};
}

/**
 * 시뮬레이션 강제 종료
 * 시뮬레이션을 강제로 종료시켜줍니다.
 * 진행 중인 시뮬레이션이 없다면, 아무런 행동을 하지 않습니다.
 * (기획상 시뮬레이션을 종료하지 않으면, 게임이 종료되지 않습니다.)
 * */
export async function forceStopSimulation() {
  await endCurrentSimulation();
}

// 시뮬레이션 종료 처리
async function endCurrentSimulation() {
  const lastRun = await db.simulation_run.filter(run => run.ended_at <= -1).last();

  if (!lastRun) return;

  await db.simulation_run.update(lastRun.simulation_run_id, {
    ended_at: Date.now(),
    accuracy: lastRun.success_subject_count / lastRun.subject_count,
    score: lastRun.success_subject_count * 1000,
    total_elapsed: Date.now() - lastRun.started_at,
  });
}

/**
 * 시뮬레이션 요약 결과 → 마지막 모달
 * 시뮬레이션이 모두 끝난 뒤에, 시뮬레이션에 대한 요약 결과를 반환합니다.
 * 시뮬레이션이 끝나지 않았다면, 에러메세지를 반환합니다.
 * @returns { accuracy: number, score: number, total_elapsed: string }
 * */
export async function getSummaryResult({ simulationId }: { simulationId: number }) {
  const run = await db.simulation_run.get(simulationId);
  if (!run) {
    return {
      errMsg: 'SIMULATION NOT FOUND',
    };
  }

  if (run.ended_at === -1) {
    return {
      errMsg: 'SIMULATION IS NOT FINISHED',
    };
  }

  return {
    accuracy: run.accuracy,
    score: run.score,
    total_elapsed: run.total_elapsed,
  };
}

/**
 * 시뮬레이션이 끝났는지 확인합니다.
 * 수강 신청이 끝난 과목과 숫자가 같으면, 종료로 판단합니다. */
export async function isSimulationFinished() {
  const ongoing = await getOngoingSimulation();
  if (!ongoing) {
    return true;
  }

  const subjects = await db.simulation_run_selections
    .filter(
      selection =>
        selection.simulation_run_id === ongoing.simulation_run_id &&
        [APPLY_STATUS.SUCCESS, APPLY_STATUS.FAILED].includes(selection.status),
    )
    .toArray();
  console.log(subjects.length);

  return ongoing.subject_count <= subjects.length;
}
