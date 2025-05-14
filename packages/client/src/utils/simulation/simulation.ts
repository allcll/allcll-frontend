import { db } from '@/utils/dbConfig.ts';
import { getInterestedId, getRecentInterestedSnapshot } from '@/utils/simulation/subjects';
import { getAccuracy, getAccuracyScore, getSpeedScore } from '@/utils/simulation/score.ts';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess.ts';
import { checkSubjectResult } from '@/utils/checkSubjectResult.ts';

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
 * 사용자가 시뮬레이션 페이지에 들어왔을 때 확인합니다.
 * @returns { simulationId: number } */
export async function checkOngoingSimulation() {
  try {
    const ongoing = await getOngoingSimulation();

    if (!ongoing) return { simulationId: -1 };

    const registeredSelections = await db.simulation_run_selections
      .filter(
        selection =>
          selection.simulation_run_id === ongoing.simulation_run_id &&
          [APPLY_STATUS.SUCCESS, APPLY_STATUS.FAILED].includes(selection.status),
      )
      .toArray();

    const snapshotSubjects = await db.interested_subject.where('snapshot_id').equals(ongoing.snapshot_id).toArray();
    if (!snapshotSubjects) return errMsg(SIMULATION_ERROR.SNAPSHOT_NOT_EXIST);

    const registeredSubjects = snapshotSubjects
      .filter(subject => registeredSelections.some(selection => selection.interested_id === subject.interested_id))
      .map(subject => ({ subjectId: subject.subject_id }));

    const nonRegisteredSubjects = snapshotSubjects
      .filter(subject => !registeredSelections.some(selection => selection.interested_id === subject.interested_id))
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
export async function getOngoingSimulation() {
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
export async function triggerButtonEvent(input: ButtonEventSearchReq): Promise<{ elapsed_time: number }>;
export async function triggerButtonEvent(input: ButtonEventSubmitReq): Promise<{ status: APPLY_STATUS }>;
export async function triggerButtonEvent(input: ButtonEventApplyReq): Promise<{}>;
export async function triggerButtonEvent(input: ButtonEventEndReq): Promise<{ finished: boolean }>;
export async function triggerButtonEvent(
  input: ButtonEventSearchReq | ButtonEventSubmitReq | ButtonEventApplyReq | ButtonEventEndReq,
) {
  const { eventType } = input;
  let ongoing;
  try {
    ongoing = await getOngoingSimulation();

    if (!ongoing) throw new Error(SIMULATION_ERROR.ONGOING_SIMULATION_NOT_FOUND);
  } catch (e) {
    return CheckError(e);
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

  // const selections = await db.simulation_run_selections
  //   .filter(selection => selection.simulation_run_id === latestSimulationId && selection.interested_id === subjectId)
  //   .toArray();
  const selections = await db.simulation_run_selections
    .filter(selection => selection.simulation_run_id === latestSimulationId)
    .toArray();
  const latestSelection = selections[selections.length - 1]; //마지막이 나올까요?
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
      return { status };
    };

    // 캡차 상태를 확인합니다.
    const currentSubjectStatus = useSimulationProcessStore
      .getState()
      .subjectsStatus.find(subject => subject.subjectId === subjectId);
    const isCaptchaFailed = currentSubjectStatus?.isCaptchaFailed;

    if (isCaptchaFailed) {
      return await saveStatus(APPLY_STATUS.CAPTCHA_FAILED);
    }

    // 과목 중복 여부를 확인합니다.
    const isDouble = selections.some(
      s => s.interested_id === interestedId && [APPLY_STATUS.SUCCESS, APPLY_STATUS.FAILED].includes(s.status),
    );
    if (isDouble) {
      return await saveStatus(APPLY_STATUS.DOUBLED);
    }

    // 과목 성공 실패를 확인합니다.
    const elapsedTime = Math.floor((now - latestSelection.started_at) / 1000);
    const isSuccess = checkSubjectResult(subjectId, elapsedTime);
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

  const triedCount = selections.filter(selection =>
    [APPLY_STATUS.SUCCESS, APPLY_STATUS.FAILED].includes(selection.status),
  ).length;
  const canceledTry = selections.filter(
    selection => ![APPLY_STATUS.SUCCESS, APPLY_STATUS.FAILED].includes(selection.status),
  );
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
 * 수강 신청이 끝난 과목과 숫자가 같으면, 종료로 판단합니다. */
export async function isSimulationFinished() {
  let ongoing;

  try {
    ongoing = await getOngoingSimulation();
  } catch (e) {
    return true;
  }

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

  return ongoing.subject_count <= subjects.length;
}
