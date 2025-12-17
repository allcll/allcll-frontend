import { db, SimulationRun, SimulationRunSelections } from '@/shared/config/dbConfig.ts';
import { getInterestedId, getRecentInterestedSnapshot } from '@/utils/simulation/subjects';
import { getAccuracy, getAccuracyScore, getSpeedScore } from '@/utils/simulation/score.ts';
import { checkSubjectResult } from '@/utils/checkSubjectResult.ts';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import { Lecture } from '@/hooks/server/useLectures';

export enum BUTTON_EVENT {
  SEARCH,
  APPLY,
  CAPTCHA,
  CANCEL_SUBMIT, // 수강 신청 전까지의 Cancel 버튼
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

export enum SIMULATION_ERROR {
  SNAPSHOT_NOT_EXIST = 'SNAPSHOT_NOT_EXIST',
  ONGOING_SIMULATION_NOT_FOUND = 'ONGOING_SIMULATION_NOT_FOUND',
  SELECTION_NOT_FOUND = 'SELECTION_NOT_FOUND',
  SIMULATION_NOT_FOUND = 'SIMULATION_NOT_FOUND',
  MULTIPLE_SIMULATION_FOUND = 'MULTIPLE_SIMULATION_FOUND',
  SIMULATION_IS_NOT_FINISHED = 'SIMULATION_IS_NOT_FINISHED',
  MULTIPLE_SIMULATION_RUNNING = 'MULTIPLE_SIMULATION_RUNNING',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export const SIMULATION_TIME_LIMIT = 5 * 60; // 5분
export const SIMULATION_TIME_LIMIT_MS = SIMULATION_TIME_LIMIT * 1000; // 5분, 시뮬레이션 시간 제한

function errMsg(msg: SIMULATION_ERROR) {
  return { errMsg: msg };
}

function CheckError(err: unknown) {
  if (err instanceof Error) {
    return errMsg(err.message as SIMULATION_ERROR);
  }
  return errMsg(SIMULATION_ERROR.UNKNOWN_ERROR);
}

/**
 * 진행 중인 시뮬레이션 확인
 * 현재 진행중인 시뮬레이션이 있는지 확인합니다.
 * 진행중인 시뮬레이션이 있다면 해당 simulation_id 와 진행 정보를 반환하고, 없다면 simulation_id=-1 을 반환합니다.
 * 사용자가 시뮬레이션 페이지에 들어왔을 때 확인합니다. */
export async function checkOngoingSimulation() {
  try {
    const ongoing = await getOngoingSimulation();

    if (!ongoing) return { simulationId: -1 };

    // 진행중인 시뮬레이션 중, 성공 또는 실패한 과목을 불러옵니다.
    const registeredSelections = await db.simulation_run_selections
      .filter(s => submittedFilter(s, ongoing.simulation_run_id))
      .toArray();

    // 진행중인 시뮬레이션의 과목
    const snapshotSubjects = await db.interested_subject.where('snapshot_id').equals(ongoing.snapshot_id).toArray();
    if (!snapshotSubjects) return errMsg(SIMULATION_ERROR.SNAPSHOT_NOT_EXIST);

    // registeredSubjects === successed
    const successed = registeredSelections.filter(s => s.status === APPLY_STATUS.SUCCESS);
    const registeredSubjects = snapshotSubjects
      .filter(subject => successed.some(selection => selection.interested_id === subject.interested_id))
      .map(subject => ({ subjectId: subject.subject_id }));

    const nonRegisteredSubjects = snapshotSubjects
      .filter(subject => !successed.some(selection => selection.interested_id === subject.interested_id))
      .map(subject => ({ subjectId: subject.subject_id }));

    const subjectStatus = registeredSelections.map(selection => {
      const subject = snapshotSubjects.find(subject => subject.interested_id === selection.interested_id);
      if (!subject) return { subjectId: -1, status: APPLY_STATUS.FAILED };

      return {
        subjectId: subject.subject_id,
        status: selection.status,
      };
    });

    return {
      simulationId: ongoing.simulation_run_id,
      userStatus: {
        userPK: ongoing.user_id,
        departmentCode: ongoing.department_code,
        departmentName: ongoing.department_name,
      },
      searchEventAt: ongoing.search_event_at,
      startedAt: ongoing.started_at,
      nonRegisteredSubjects,
      registeredSubjects,
      subjectStatus,
    };
  } catch (e) {
    return CheckError(e);
  }
}

/**
 * 진행중인 시뮬레이션을 반환합니다.
 * 진행중인 시뮬레이션이 없다면, null 을 반환합니다.
 * @throws {Error} 진행중인 시뮬레이션이 2개 이상일 경우
 * @returns {SimulationRun|null} */
export async function getOngoingSimulation(): Promise<SimulationRun | null> {
  const ongoing = await db.simulation_run.filter(run => run.ended_at === -1).toArray();

  if (ongoing && ongoing.length > 1) throw new Error(SIMULATION_ERROR.MULTIPLE_SIMULATION_RUNNING);

  return ongoing[0] ?? null;
}

export async function getSimulationById(simulationId: number) {
  const simulations = await db.simulation_run
    .where('simulation_run_id')
    .equals(simulationId)
    .filter(run => run.ended_at !== -1)
    .toArray();

  if (!simulations.length) throw new Error(SIMULATION_ERROR.SIMULATION_NOT_FOUND);
  if (simulations.length > 1) throw new Error(SIMULATION_ERROR.MULTIPLE_SIMULATION_FOUND);

  return simulations[0];
}

/**
 * 시뮬레이션 시작
 * 진행 중인 시뮬레이션을 확인 후,
 * 진행 중인 시뮬레이션이 존재하면, 해당 simulation_id 를 반환,
 * 진행 중인 시뮬레이션이 존재하지 않으면, 새로운 simulation_id 반환 후 시뮬레이션 테이블 생성
 * @returns { simulation_id: number, isRunning?: true } */
export async function startSimulation(userPK: string, departmentCode: string, departmentName: string) {
  const ongoing = await checkOngoingSimulation();

  if (ongoing && 'errMsg' in ongoing) {
    return ongoing;
  }

  if (ongoing.simulationId !== -1) {
    return { simulationId: ongoing.simulationId, isRunning: true };
  }

  const recent = await getRecentInterestedSnapshot();

  if (!recent) return errMsg(SIMULATION_ERROR.SNAPSHOT_NOT_EXIST);

  await db.interested_snapshot.update(recent.snapshot_id, { simulated: true });

  // 시뮬레이션 시작
  const subjects = recent.subjects;
  const newId = await db.simulation_run.add({
    snapshot_id: recent.snapshot_id,
    user_id: userPK,
    department_code: departmentCode,
    department_name: departmentName,
    success_subject_count: 0,
    subject_count: subjects.length,
    accuracy: -1,
    score: -1,
    total_elapsed: -1,
    search_event_at: -1,
    started_at: Date.now(),
    ended_at: -1,
  });

  return { simulationId: newId, started_at: Date.now(), isRunning: true };
}

// 타입 정의
type ButtonEventSearchReq = {
  eventType: BUTTON_EVENT.SEARCH;
};
type ButtonEventSubmitReq = {
  eventType: BUTTON_EVENT.SUBJECT_SUBMIT;
  subjectId: number;
};
type ButtonEventApplyReq = {
  eventType: Exclude<
    BUTTON_EVENT,
    BUTTON_EVENT.REFRESH | BUTTON_EVENT.SKIP_REFRESH | BUTTON_EVENT.SEARCH | BUTTON_EVENT.SUBJECT_SUBMIT
  >;
  subjectId: number;
};
type ButtonEventEndReq = {
  eventType: BUTTON_EVENT.REFRESH | BUTTON_EVENT.SKIP_REFRESH;
  subjectId: number;
};

/**
 * 버튼 이벤트 실행
 * 시뮬레이션에 있는 버튼을 클릭 할 때 마다 발생시켜야 하는 이벤트
 * */
export async function triggerButtonEvent(
  input: ButtonEventSearchReq,
  lectures: Lecture[],
): Promise<{ elapsed_time: number }>;
export async function triggerButtonEvent(
  input: ButtonEventSubmitReq,
  lectures: Lecture[],
): Promise<{ status: APPLY_STATUS }>;
export async function triggerButtonEvent(input: ButtonEventApplyReq, lectures: Lecture[]): Promise<{}>;
export async function triggerButtonEvent(input: ButtonEventEndReq, lectures: Lecture[]): Promise<{ finished: boolean }>;
export async function triggerButtonEvent(
  input: ButtonEventSearchReq | ButtonEventSubmitReq | ButtonEventApplyReq | ButtonEventEndReq,
  lectures: Lecture[],
) {
  const { eventType } = input;
  console.log('BUTTON EVENT', input);
  let ongoing;
  try {
    ongoing = await getOngoingSimulation();

    if (!ongoing) throw new Error(SIMULATION_ERROR.ONGOING_SIMULATION_NOT_FOUND);
  } catch (e) {
    return CheckError(e);
  }

  const latestSimulationId = ongoing.simulation_run_id;
  if (eventType === BUTTON_EVENT.SEARCH) {
    // Todo: 검색 버튼을 2번 이상 눌렀을 때, 방안 생각해보기
    const time = Date.now();
    await db.simulation_run.update(latestSimulationId, {
      search_event_at: time,
    });

    return { elapsed_time: time - ongoing.started_at };
  }

  const { subjectId } = input as ButtonEventApplyReq;
  if (eventType === BUTTON_EVENT.APPLY) {
    const selectedIndex = await db.simulation_run_selections
      .filter(run => run.simulation_run_id === ongoing.simulation_run_id && run.ended_at >= 0)
      .count();

    const selectionId = await db.simulation_run_selections.add({
      simulation_run_id: ongoing.simulation_run_id,
      interested_id: await getInterestedId(ongoing.snapshot_id, subjectId),
      selected_index: selectedIndex + 1,
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
    .filter(selection => selection.simulation_run_id === latestSimulationId)
    .toArray();
  const latestSelection = selections.filter(s => s.ended_at === -1).sort((a, b) => b.started_at - a.started_at)[0];
  if (!latestSelection) return errMsg(SIMULATION_ERROR.SELECTION_NOT_FOUND);
  const now = Date.now();

  await db.simulation_run_events.add({
    simulation_section_id: latestSelection.run_selections_id,
    event_type: eventType,
    timestamp: now,
  });

  if (eventType === BUTTON_EVENT.SUBJECT_SUBMIT) {
    // 과목 결과 불러오는 로직
    // 과목 중 simulationId, Section 중 started_at 이 가장 늦은 Section 을 가져옵니다.

    const interestedId = await getInterestedId(ongoing.snapshot_id, subjectId);
    const selection = await db.simulation_run_selections
      .filter(
        selection => selection.simulation_run_id === latestSimulationId && selection.interested_id === interestedId,
      )
      .last();

    if (!selection) return errMsg(SIMULATION_ERROR.SELECTION_NOT_FOUND);

    const saveStatus = async (status: APPLY_STATUS) => {
      await db.simulation_run_selections.update(latestSelection.run_selections_id, { status });
      console.log('saved section', latestSelection.run_selections_id, status);
      return { status };
    };

    // 캡차 상태를 확인합니다.
    const isCaptchaFailed = useSimulationSubjectStore.getState().isCaptchaFailed;

    if (isCaptchaFailed) {
      return await saveStatus(APPLY_STATUS.CAPTCHA_FAILED);
    }

    // 이미 failed 상태인지 확인합니다. 이미 failed 상태라면, doubled 처리하고, UI만 fail로 표시합니다.
    const alreadyFailed = selections.some(s => s.interested_id === interestedId && s.status === APPLY_STATUS.FAILED);
    if (alreadyFailed) {
      await saveStatus(APPLY_STATUS.DOUBLED);
      return { status: APPLY_STATUS.FAILED };
    }

    // 과목 중복 여부를 확인합니다.
    const isDouble = selections.some(
      s => s.interested_id === interestedId && s.ended_at >= 0 && submittedFilter(s, latestSimulationId),
    );
    if (isDouble) {
      return await saveStatus(APPLY_STATUS.DOUBLED);
    }

    // 과목 성공 실패를 확인합니다.
    const elapsedTime = Math.floor(now - ongoing.started_at) / 1000;
    const isSuccess = checkSubjectResult(lectures, subjectId, elapsedTime);
    if (isSuccess) {
      return await saveStatus(APPLY_STATUS.SUCCESS);
    }

    return await saveStatus(APPLY_STATUS.FAILED);
  }

  if (eventType === BUTTON_EVENT.CANCEL_SUBMIT) {
    await db.simulation_run_selections.update(latestSelection.run_selections_id, {
      status: APPLY_STATUS.CANCELED,
      ended_at: Date.now(),
    });
  }

  if (eventType === BUTTON_EVENT.REFRESH || eventType === BUTTON_EVENT.SKIP_REFRESH) {
    await db.simulation_run_selections.update(latestSelection.run_selections_id, { ended_at: Date.now() });

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

  // 정확도, 점수 계산
  const selections = await db.simulation_run_selections
    .filter(selection => selection.simulation_run_id === lastRun.simulation_run_id)
    .toArray();

  const triedCount = selections.filter(s => submittedFilter(s, lastRun.simulation_run_id)).length;
  const canceledTry = selections.filter(s => notSubmittedFilter(s, lastRun.simulation_run_id));
  const canceledTime = canceledTry.reduce((acc, cur) => {
    if (cur.ended_at === -1) return acc + 4600;
    return acc + (cur.ended_at - cur.started_at);
  }, 0);

  const totalElapsed = Date.now() - lastRun.started_at;
  const accuracy = getAccuracy(totalElapsed / 1000, canceledTime / 1000);
  const score = getSpeedScore(totalElapsed / 1000 / triedCount) + getAccuracyScore(accuracy);

  await db.simulation_run.update(lastRun.simulation_run_id, {
    ended_at: Date.now(),
    accuracy: accuracy,
    score: Math.min(100, Math.max(0, score)),
    total_elapsed: totalElapsed,
  });

  await fixSimulation(lastRun);
}

/**
 * 시뮬레이션 요약 결과 → 마지막 모달
 * 시뮬레이션이 모두 끝난 뒤에, 시뮬레이션에 대한 요약 결과를 반환합니다.
 * 시뮬레이션이 끝나지 않았다면, 에러메세지를 반환합니다.
 * @returns { accuracy: number, score: number, total_elapsed: string }
 * */
export async function getSummaryResult({ simulationId }: { simulationId: number }) {
  const run = await db.simulation_run.get(simulationId);
  if (!run) return errMsg(SIMULATION_ERROR.SIMULATION_NOT_FOUND);

  if (run.ended_at === -1) return errMsg(SIMULATION_ERROR.SIMULATION_IS_NOT_FINISHED);

  return {
    accuracy: run.accuracy,
    score: run.score,
    total_elapsed: run.total_elapsed,
  };
}

/**
 * 시뮬레이션이 끝났는지 확인합니다.
 * @deprecated
 * 수강 신청이 끝난 과목과 숫자가 같으면, 종료로 판단합니다. */
export async function isSimulationFinished() {
  let ongoing;

  try {
    ongoing = await getOngoingSimulation();
  } catch {
    return true;
  }

  if (!ongoing) {
    return true;
  }

  const subjects = await db.simulation_run_selections
    .filter(s => submittedFilter(s, ongoing.simulation_run_id))
    .toArray();

  // debug 추가

  return ongoing.subject_count <= subjects.length;
}

/**
 * 시뮬레이션이 잘못된 경우 삭제 또는 수정합니다.
 * 시뮬레이션이 삭제되는 경우 true 를 반환합니다.
 */
async function fixSimulation(run: SimulationRun) {
  const runId = run.simulation_run_id;

  // 시작이 안된 경우 -> 시뮬레이션 삭제
  if (run.search_event_at < 0) {
    await db.simulation_run_selections.where('simulation_run_id').equals(runId).delete();
    await db.simulation_run.delete(runId);

    return true;
  }

  // 5분 이상 지난 경우 -> 시뮬레이션 강제 종료
  if (run.started_at + SIMULATION_TIME_LIMIT_MS < Date.now()) {
    await db.simulation_run.update(runId, { ended_at: Date.now() });
  }

  return false;
}

const isOngoingSection = (sections: SimulationRunSelections, simulationId: number) =>
  sections.simulation_run_id === simulationId;

const submittedFilter = (sections: SimulationRunSelections, simulationId: number) =>
  isOngoingSection(sections, simulationId) && [APPLY_STATUS.SUCCESS, APPLY_STATUS.FAILED].includes(sections.status);

const notSubmittedFilter = (sections: SimulationRunSelections, simulationId: number) =>
  isOngoingSection(sections, simulationId) && ![APPLY_STATUS.SUCCESS, APPLY_STATUS.FAILED].includes(sections.status);
