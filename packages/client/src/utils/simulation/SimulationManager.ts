import { SimulationRun, SimulationRunSelections } from '@/utils/dbConfig.ts';
import SimulationRunService from '@/utils/simulation/SimulationRunService.ts';
import SimulationSelectionService from '@/utils/simulation/SimulationSelectionService.ts';
import SimulationEventService from '@/utils/simulation/SimulationEventService.ts';
import SnapshotService, { SnapshotWithSubjects } from '@/utils/simulation/SnapshotService.ts';
import { getAccuracy, getAccuracyScore, getSpeedScore } from '@/utils/simulation/score.ts';
import { checkSubjectResult } from '@/utils/checkSubjectResult.ts';
import { Lecture } from '@/hooks/server/useLectures';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject.ts';
import {
  APPLY_STATUS,
  BUTTON_EVENT,
  SIMULATION_ERROR,
  SIMULATION_TIME_LIMIT_MS,
} from '@/utils/simulation/simulation.ts';

class SimulationManager {
  private constructor(
    public run: SimulationRun,
    public selections: SimulationRunSelections[],
    public snapshot: SnapshotWithSubjects,
  ) {}

  // ==================================================================================================
  // 정적 팩토리 메서드 (인스턴스 생성)
  // ==================================================================================================

  /**
   * 새로운 시뮬레이션을 시작하고 Manager 인스턴스를 생성합니다.
   */
  public static async start(
    userPK: string,
    departmentCode: string,
    departmentName: string,
  ): Promise<SimulationManager | null> {
    if (await SimulationRunService.isRunning()) {
      const ongoingRun = await SimulationRunService.getOngoing();
      if (ongoingRun) return this.load(ongoingRun.simulation_run_id);
      return null;
    }

    const recentSnapshot = await SnapshotService.getRecent();
    if (!recentSnapshot) {
      throw new Error(SIMULATION_ERROR.SNAPSHOT_NOT_EXIST);
    }
    await SnapshotService.markAsSimulated(recentSnapshot.snapshot_id);

    const newRunId = await SimulationRunService.create({
      snapshot_id: recentSnapshot.snapshot_id,
      user_id: userPK,
      department_code: departmentCode,
      department_name: departmentName,
      success_subject_count: 0,
      subject_count: recentSnapshot.subjects.length,
      accuracy: -1,
      score: -1,
      total_elapsed: -1,
      search_event_at: -1,
      started_at: Date.now(),
      ended_at: -1,
    });

    return this.load(newRunId);
  }

  /**
   * 기존 시뮬레이션을 로드하여 Manager 인스턴스를 생성합니다.
   */
  public static async load(simulationId: number): Promise<SimulationManager> {
    const run = await SimulationRunService.getById(simulationId);
    const selections = await SimulationSelectionService.getByRunId(simulationId);
    const snapshot = await SnapshotService.getById(run.snapshot_id);

    if (!snapshot) {
      throw new Error(SIMULATION_ERROR.SNAPSHOT_NOT_EXIST);
    }

    return new SimulationManager(run, selections, snapshot);
  }

  // ==================================================================================================
  // 인스턴스 메서드 (핵심 로직)
  // ==================================================================================================

  /**
   * 시뮬레이션 내 버튼 이벤트를 처리합니다.
   */
  public async triggerButtonEvent(input: any, lectures: Lecture[]) {
    const { eventType } = input;

    if (eventType === BUTTON_EVENT.SEARCH) {
      return this.handleSearchEvent();
    }

    const { subjectId } = input;
    if (eventType === BUTTON_EVENT.APPLY) {
      return this.handleApplyEvent(subjectId);
    }

    const latestSelection = this.getLatestInProgressSelection();
    if (!latestSelection) throw new Error(SIMULATION_ERROR.SELECTION_NOT_FOUND);

    await SimulationEventService.create({
      simulation_section_id: latestSelection.run_selections_id,
      event_type: eventType,
      timestamp: Date.now(),
    });

    if (eventType === BUTTON_EVENT.SUBJECT_SUBMIT) {
      const { isCaptchaFailed } = useSimulationSubjectStore.getState();
      return this.handleSubmitEvent(latestSelection, subjectId, isCaptchaFailed, lectures);
    }

    if (eventType === BUTTON_EVENT.CANCEL_SUBMIT) {
      await SimulationSelectionService.update(latestSelection.run_selections_id, {
        status: APPLY_STATUS.CANCELED,
        ended_at: Date.now(),
      });
    }

    if (eventType === BUTTON_EVENT.REFRESH || eventType === BUTTON_EVENT.SKIP_REFRESH) {
      await SimulationSelectionService.update(latestSelection.run_selections_id, { ended_at: Date.now() });

      const isFinished = await this.isFinished();
      if (isFinished) {
        await this.end();
      }
      return { finished: isFinished };
    }

    return {};
  }

  /**
   * 시뮬레이션을 종료 처리하고 최종 결과를 계산 및 저장합니다.
   */
  public async end() {
    if (this.run.ended_at > -1) return; // 이미 종료된 경우

    const selections = await SimulationSelectionService.getByRunId(this.run.simulation_run_id);
    const submitted = selections.filter(s => [APPLY_STATUS.SUCCESS, APPLY_STATUS.FAILED].includes(s.status));
    const notSubmitted = selections.filter(s => ![APPLY_STATUS.SUCCESS, APPLY_STATUS.FAILED].includes(s.status));

    const canceledTime = notSubmitted.reduce((acc, cur) => {
      if (cur.ended_at === -1) return acc + 4600; // 비정상 종료 페널티
      return acc + (cur.ended_at - cur.started_at);
    }, 0);

    const totalElapsed = Date.now() - this.run.started_at;
    const accuracy = getAccuracy(totalElapsed / 1000, canceledTime / 1000);
    const score = getSpeedScore(totalElapsed / 1000 / submitted.length) + getAccuracyScore(accuracy);

    await SimulationRunService.update(this.run.simulation_run_id, {
      ended_at: Date.now(),
      accuracy: accuracy,
      score: Math.min(100, Math.max(0, score)),
      total_elapsed: totalElapsed,
    });

    await this.fix();
  }

  /**
   * 비정상적으로 종료된 시뮬레이션 데이터를 수정하거나 정리합니다.
   */
  public async fix() {
    // 시작도 안한 경우 (검색 이벤트 없음) -> 데이터 삭제
    if (this.run.search_event_at < 0) {
      await SimulationSelectionService.deleteByRunId(this.run.simulation_run_id);
      await SimulationRunService.deleteById(this.run.simulation_run_id);
      return true;
    }

    // 5분 이상 지난 경우 -> 강제 종료 처리
    if (this.run.started_at + SIMULATION_TIME_LIMIT_MS < Date.now()) {
      await SimulationRunService.update(this.run.simulation_run_id, { ended_at: Date.now() });
    }

    return false;
  }

  // ==================================================================================================
  // 내부 헬퍼 메서드
  // ==================================================================================================

  private async handleSearchEvent() {
    const time = Date.now();
    await SimulationRunService.update(this.run.simulation_run_id, {
      search_event_at: time,
    });
    this.run.search_event_at = time; // 내부 상태 업데이트
    return { elapsed_time: time - this.run.started_at };
  }

  private async handleApplyEvent(subjectId: number) {
    const submittedCount = await SimulationSelectionService.countSubmitted(this.run.simulation_run_id);
    const interestedId = await SnapshotService.getInterestedId(this.snapshot.snapshot_id, subjectId);

    const selectionId = await SimulationSelectionService.create({
      simulation_run_id: this.run.simulation_run_id,
      interested_id: interestedId,
      selected_index: submittedCount + 1,
      status: APPLY_STATUS.PROGRESS,
      started_at: Date.now(),
      ended_at: -1,
    });

    await SimulationEventService.create({
      simulation_section_id: selectionId,
      event_type: BUTTON_EVENT.APPLY,
      timestamp: Date.now(),
    });

    return {};
  }

  private async handleSubmitEvent(
    latestSelection: SimulationRunSelections,
    subjectId: number,
    isCaptchaFailed: boolean,
    lectures: Lecture[],
  ) {
    const saveStatus = async (status: APPLY_STATUS) => {
      await SimulationSelectionService.update(latestSelection.run_selections_id, { status });
      return { status };
    };

    if (isCaptchaFailed) {
      return saveStatus(APPLY_STATUS.CAPTCHA_FAILED);
    }

    const interestedId = await SnapshotService.getInterestedId(this.snapshot.snapshot_id, subjectId);
    const isDoubled = this.selections.some(
      s =>
        s.interested_id === interestedId &&
        s.run_selections_id !== latestSelection.run_selections_id &&
        [APPLY_STATUS.SUCCESS, APPLY_STATUS.FAILED].includes(s.status),
    );

    if (isDoubled) {
      return saveStatus(APPLY_STATUS.DOUBLED);
    }

    const elapsedTime = (Date.now() - this.run.started_at) / 1000;
    const isSuccess = checkSubjectResult(lectures, subjectId, elapsedTime);

    return saveStatus(isSuccess ? APPLY_STATUS.SUCCESS : APPLY_STATUS.FAILED);
  }

  private getLatestInProgressSelection(): SimulationRunSelections | undefined {
    return this.selections.filter(s => s.ended_at === -1).sort((a, b) => b.started_at - a.started_at)[0];
  }

  private async isFinished(): Promise<boolean> {
    const submittedSelections = await SimulationSelectionService.getSubmittedByRunId(this.run.simulation_run_id);
    return this.run.subject_count <= submittedSelections.length;
  }
}

export default SimulationManager;
