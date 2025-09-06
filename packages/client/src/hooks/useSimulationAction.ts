import { useMemo } from 'react';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { APPLY_STATUS, BUTTON_EVENT, forceStopSimulation, triggerButtonEvent } from '@/utils/simulation/simulation';
import { useReloadSimulation } from '@/hooks/useReloadSimulation';
import useLectures from '@/hooks/server/useLectures';

interface ModalContent {
  status: APPLY_STATUS;
  topMessage: string;
  description?: string;
}

const SIMULATION_MODAL_CONTENTS: ModalContent[] = [
  {
    status: APPLY_STATUS.PROGRESS,
    topMessage: '선택한 과목을 수강신청 하시겠습니까?',
    description: '교과목명(CourseTitle):',
  },
  {
    status: APPLY_STATUS.SUCCESS,
    topMessage: '과목이 신청 되었습니다. 수강신청내역을 재조회 하시겠습니까?',
    description:
      '※ 취소를 선택하실 경우 [수강신청내역]이 갱신되지 않습니다. 취소를 선택하실 경우 수강신청 최종 완료 후 반드시 [수강신청내역] 재 조회를 눌러 신청 내역을 확인하세요. [수강신청내역]에 조회된 과목만이 정상적으로 수강신청된 과목입니다.',
  },
  {
    status: APPLY_STATUS.FAILED,
    topMessage: '수강 여석이 없습니다!',
  },
  {
    status: APPLY_STATUS.DOUBLED,
    topMessage: '이미 수강신청 된 과목입니다!',
  },
  {
    status: APPLY_STATUS.CAPTCHA_FAILED,
    topMessage: '입력하신 코드가 일치하지 않습니다',
  },
  {
    status: APPLY_STATUS.NOT_ELIGIBLE,
    topMessage: '수강신청 대상 학과가 아닙니다',
  },
];

const closeDisabledStatuses = [
  APPLY_STATUS.PROGRESS,
  APPLY_STATUS.SUCCESS,
  APPLY_STATUS.FAILED,
  APPLY_STATUS.CAPTCHA_FAILED,
];

export const useSimulationAction = () => {
  const { openModal, closeModal } = useSimulationModalStore();
  const { currentSubjectId, setSubjectStatus, subjectStatusMap } = useSimulationSubjectStore();
  const { setCurrentSimulation } = useSimulationProcessStore();

  const { data: lectures } = useLectures();
  const { reloadSimulationStatus } = useReloadSimulation();

  const currentSubjectStatus = subjectStatusMap[currentSubjectId];
  const modalData = useMemo(() => {
    const content = SIMULATION_MODAL_CONTENTS.find(data => data.status === currentSubjectStatus);

    if (content?.status === APPLY_STATUS.PROGRESS) {
      const currentLecture = lectures?.find(lec => lec.subjectId === currentSubjectId);
      return {
        ...content,
        description: content.description + ` ${currentLecture?.subjectName}`,
      };
    }

    return content;
  }, [currentSubjectStatus]);
  const modalStatus = modalData?.status ?? APPLY_STATUS.PROGRESS;

  const isCloseDisabled = useMemo(() => closeDisabledStatuses.includes(modalStatus), [modalStatus]);

  const checkErrorValue = (res: Record<string, any>, forceFinish = false) => {
    if ('errMsg' in res) {
      alert(res.errMsg);
      if (forceFinish) {
        forceStopSimulation().then(() => openModal('result'));
      }
      throw new Error(res.errMsg);
    }
  };

  const handleActionError = (e: any) => {
    console.error('예외 발생:', e);
    alert('예외 발생:' + e.toString());
  };

  const handleProgress = async () => {
    const result = await triggerButtonEvent(
      { eventType: BUTTON_EVENT.SUBJECT_SUBMIT, subjectId: currentSubjectId },
      lectures,
    );
    checkErrorValue(result);
    setSubjectStatus(currentSubjectId, result.status);
    openModal('simulation');
  };

  const handleSuccess = async () => {
    const result = await triggerButtonEvent({ eventType: BUTTON_EVENT.REFRESH, subjectId: currentSubjectId }, lectures);
    checkErrorValue(result);

    reloadSimulationStatus();

    if (result.finished) {
      setCurrentSimulation({ simulationStatus: 'finish' });
      openModal('result');
    }
  };

  const handleSkipRefreshAndCheckFinish = async () => {
    try {
      const result = await triggerButtonEvent(
        { eventType: BUTTON_EVENT.SKIP_REFRESH, subjectId: currentSubjectId },
        lectures,
      );
      if ('errMsg' in result) {
        alert(result.errMsg);
        await forceStopSimulation();
        setCurrentSimulation({ simulationStatus: 'finish' });
        openModal('result');
      } else if (result.finished) {
        setCurrentSimulation({ simulationStatus: 'finish' });
        openModal('result');
      } else {
        closeModal('simulation');
      }
    } catch (error) {
      handleActionError(error);
    }
  };

  const handleConfirm = async () => {
    try {
      if (modalStatus === APPLY_STATUS.PROGRESS) {
        await handleProgress();
      } else if (modalStatus === APPLY_STATUS.SUCCESS) {
        await handleSuccess();
      } else if ([APPLY_STATUS.FAILED, APPLY_STATUS.DOUBLED, APPLY_STATUS.CAPTCHA_FAILED].includes(modalStatus)) {
        await handleSkipRefreshAndCheckFinish();
      }
    } catch (error) {
      handleActionError(error);
    }
  };

  const handleCancel = async () => {
    try {
      if (modalStatus === APPLY_STATUS.SUCCESS) {
        await handleSkipRefreshAndCheckFinish();
      } else if (modalStatus === APPLY_STATUS.PROGRESS) {
        const result = await triggerButtonEvent(
          { eventType: BUTTON_EVENT.CANCEL_SUBMIT, subjectId: currentSubjectId },
          lectures,
        );
        checkErrorValue(result, true);
        closeModal('simulation');
      }
    } catch (error) {
      handleActionError(error);
    }
  };

  const handleClose = () => {
    if (!isCloseDisabled) {
      closeModal('simulation');
    }
  };

  return {
    modalData,
    isCloseDisabled,
    handleConfirm,
    handleCancel,
    handleClose,
  };
};
