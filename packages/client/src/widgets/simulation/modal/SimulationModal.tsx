import { useRef } from 'react';
import SejongUI from '@allcll/sejong-ui';
import CheckBlueSvg from '@/assets/check-blue.svg?react';
import ImportantSvg from '@/assets/important.svg?react';
import { useSimulationModalStore } from '@/features/simulation/model/useSimulationModal.ts';
import useSimulationSubjectStore from '@/features/simulation/model/useSimulationSubject.ts';
import useSimulationProcessStore from '@/features/simulation/model/useSimulationProcess.ts';
import {
  APPLY_STATUS,
  BUTTON_EVENT,
  forceStopSimulation,
  triggerButtonEvent,
} from '@/features/simulation/lib/simulation.ts';
import useLectures from '@/entities/subjects/model/useLectures.ts';

const SIMULATION_MODAL_CONTENTS = [
  {
    status: APPLY_STATUS.PROGRESS,
    topMessage: '선택한 과목을 수강신청 하시겠습니까?',
    description: '교과목명(CourseTitle):',
  },
  {
    status: APPLY_STATUS.SUCCESS,
    topMessage: '과목이 신청 되었습니다. 수강신청내역을 재조회 하시겠습니까?',
    description: `※ 취소를 선택하실 경우 [수강신청내역]이 갱신되지 않습니다. 

      취소를 선택하실 경우 수강신청 최종 완료 후 반드시 [수강신청내역] 재 
      조회를 눌러 신청 내역을 확인하세요. [수강신청내역]에 조회된 과목만이
      정상적으로 수강신청된 과목입니다.`,
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

interface ISimulationModal {
  reloadSimulationStatus: () => void;
}

function SimulationModal({ reloadSimulationStatus }: Readonly<ISimulationModal>) {
  const openModal = useSimulationModalStore(state => state.openModal);
  const closeModal = useSimulationModalStore(state => state.closeModal);
  const { currentSubjectId, setSubjectStatus, subjectStatusMap } = useSimulationSubjectStore();
  const setCurrentSimulation = useSimulationProcessStore(state => state.setCurrentSimulation);
  const { data: lectures } = useLectures();

  const currentSubjectStatus = subjectStatusMap[currentSubjectId]; // useSimulationSubjectStore.subjectStatusMap 여기만 사용함.
  const modalData = SIMULATION_MODAL_CONTENTS.find(data => data.status === currentSubjectStatus);

  const modalStatus = modalData?.status ?? APPLY_STATUS.PROGRESS;
  const skipRefreshApplyStatus = [APPLY_STATUS.FAILED, APPLY_STATUS.DOUBLED, APPLY_STATUS.CAPTCHA_FAILED].includes(
    modalStatus,
  );
  const isCloseDisabled = closeDisabledStatuses.includes(modalStatus);

  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  if (!modalData) return null;

  confirmBtnRef.current?.focus();

  /** 에러 체크 해주고, 에러 있으면 throw */
  const checkErrorValue = (res: Record<string, any>, forceFinish: boolean = false) => {
    if ('errMsg' in res) {
      alert(res.errMsg);

      if (forceFinish) {
        forceStopSimulation().then(() => {
          openModal('result');
        });
      }

      throw new Error(res.errMsg);
    }
  };

  const catchAction = (e: any) => {
    console.error('예외 발생:', e);
    alert('예외 발생:' + e.toString());
  };

  const handleProgress = async (subjectId: number) => {
    const result = await triggerButtonEvent({ eventType: BUTTON_EVENT.SUBJECT_SUBMIT, subjectId }, lectures);
    checkErrorValue(result);
    setSubjectStatus(subjectId, result.status);
    openModal('simulation');
  };

  const handleSuccess = async (subjectId: number) => {
    const result = await triggerButtonEvent({ eventType: BUTTON_EVENT.REFRESH, subjectId }, lectures);
    checkErrorValue(result);

    //refresh
    reloadSimulationStatus();

    if (result.finished) {
      setCurrentSimulation({
        simulationStatus: 'finish',
      });
      console.log('시뮬레이션 완료');
      openModal('result');
    }
  };

  const handleSkipRefresh = async (subjectId: number) => {
    try {
      const result = await triggerButtonEvent({ eventType: BUTTON_EVENT.SKIP_REFRESH, subjectId }, lectures);
      if ('errMsg' in result) {
        alert(result.errMsg);
        await forceStopSimulation();

        setCurrentSimulation({
          simulationStatus: 'finish',
        });
        openModal('result');
      } else if (result.finished) {
        setCurrentSimulation({
          simulationStatus: 'finish',
        });
        openModal('result');
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeModal('simulation');
    }
  };

  /**
   * 확인 버튼 클릭했을 때, 모달의 타입이
   * SUCCESS일때 과목 신청 완료, 시뮬레이션 종료 확인
   */
  const handleClickCheck = async () => {
    try {
      if (modalData.status === APPLY_STATUS.PROGRESS) {
        await handleProgress(currentSubjectId);
      }
      //재조회 확인버튼 클릭
      else if (modalData?.status === APPLY_STATUS.SUCCESS) {
        await handleSuccess(currentSubjectId);
      } else if (skipRefreshApplyStatus) {
        await handleSkipRefresh(currentSubjectId);
      }
    } catch (error) {
      catchAction(error);
    }
  };

  /**
   * 취소 버튼 클릭했을 때, 모달의 타입이
   * SUCCESS일때 과목 신청 완료, 시뮬레이션 종료 확인
   */
  const handleClickCancel = async () => {
    try {
      // APPLY_STATUS.SUCCESS인 경우
      if (modalData?.status === APPLY_STATUS.SUCCESS) {
        const result = await triggerButtonEvent(
          {
            eventType: BUTTON_EVENT.SKIP_REFRESH,
            subjectId: currentSubjectId,
          },
          lectures,
        );

        if ('errMsg' in result) {
          alert(result.errMsg);
          await forceStopSimulation();

          setCurrentSimulation({
            simulationStatus: 'finish',
          });

          openModal('result');
        } else if (result.finished) {
          setCurrentSimulation({
            simulationStatus: 'finish',
          });

          openModal('result');
        } else {
          closeModal('simulation');
        }
      }
      // APPLY_STATUS.PROGRESS인 경우
      else if (modalData?.status === APPLY_STATUS.PROGRESS) {
        const result = await triggerButtonEvent(
          {
            eventType: BUTTON_EVENT.CANCEL_SUBMIT,
            subjectId: currentSubjectId,
          },
          lectures,
        );
        checkErrorValue(result, true);
      }
    } catch (error) {
      catchAction(error);
    }
  };

  const handleClickCloseButton = () => {
    if (!isCloseDisabled) {
      closeModal('simulation');
    }
  };

  return (
    <SejongUI.Modal modalCassName="max-w-md">
      <SejongUI.Modal.Header title="" onClose={handleClickCloseButton} />
      <div className={`px-6 pb-6 items-center flex-col flex ${getMinHeightClass(modalStatus)}`}>
        <div className="flex justify-center mb-2 py-2">
          {modalData.status === APPLY_STATUS.SUCCESS || modalData.status === APPLY_STATUS.PROGRESS ? (
            <CheckBlueSvg className="w-12 h-12" />
          ) : (
            <ImportantSvg className="w-12 h-12" fill="#C4C4C4" />
          )}
        </div>
        <p className="text-gray-700 text-sm mb-4">{modalData.topMessage}</p>

        {modalData.description && (
          <p className="text-sm text-gray-700 whitespace-pre-line text-center">
            {modalData.description}{' '}
            {modalData.status === APPLY_STATUS.PROGRESS && (
              <span>{lectures?.find(lecture => lecture.subjectId === currentSubjectId)?.subjectName}</span>
            )}
          </p>
        )}
      </div>

      <SejongUI.Modal.ButtonContainer className="px-6 py-2 bg-gray-100">
        {modalData.status === APPLY_STATUS.PROGRESS ||
          (modalData.status === APPLY_STATUS.SUCCESS && (
            <SejongUI.Modal.Button variant="cancel" onClick={handleClickCancel}>
              취소
            </SejongUI.Modal.Button>
          ))}
        <SejongUI.Modal.Button variant="primary" onClick={handleClickCheck}>
          확인
        </SejongUI.Modal.Button>
      </SejongUI.Modal.ButtonContainer>
    </SejongUI.Modal>
  );
}

export default SimulationModal;

const getMinHeightClass = (modalStatus: APPLY_STATUS): string => {
  if (modalStatus === APPLY_STATUS.FAILED || modalStatus === APPLY_STATUS.DOUBLED) {
    return 'sm:min-h-[200px] min-h-[80vh]';
  }

  return 'sm:min-h-[230px] min-h-[80vh]';
};
