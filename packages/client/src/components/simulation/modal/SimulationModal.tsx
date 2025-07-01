import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import CheckBlueSvg from '@/assets/check-blue.svg?react';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { APPLY_STATUS, BUTTON_EVENT, forceStopSimulation, triggerButtonEvent } from '@/utils/simulation/simulation';

const SIMULATION_MODAL_CONTENTS = [
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

interface ISimulationModal {
  reloadSimulationStatus: () => void;
}

function SimulationModal({ reloadSimulationStatus }: ISimulationModal) {
  const { closeModal, openModal } = useSimulationModalStore();
  const { currentSubjectId, setSubjectStatus, subjectStatusMap } = useSimulationSubjectStore();
  const { resetSimulation } = useSimulationProcessStore();

  const currentSubjectStatus = subjectStatusMap[currentSubjectId];
  const modalData = SIMULATION_MODAL_CONTENTS.find(data => data.status === currentSubjectStatus);

  const modalStatus = modalData?.status ?? APPLY_STATUS.PROGRESS;
  const skipRefreshApplyStatus = [APPLY_STATUS.FAILED, APPLY_STATUS.DOUBLED, APPLY_STATUS.CAPTCHA_FAILED].includes(
    modalStatus,
  );

  if (!modalData) return null;

  /** 에러 체크 해주고, 에러 있으면 throw */
  const checkErrorValue = (res: Record<string, any>, forceFinish: boolean = false) => {
    if ('errMsg' in res) {
      alert(res.errMsg);

      if (forceFinish) {
        forceStopSimulation().then(() => {
          openModal('result');
          resetSimulation();
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
    const result = await triggerButtonEvent({ eventType: BUTTON_EVENT.SUBJECT_SUBMIT, subjectId });
    checkErrorValue(result);
    setSubjectStatus(subjectId, result.status);
    openModal('simulation');
  };

  const handleSuccess = async (subjectId: number) => {
    const result = await triggerButtonEvent({ eventType: BUTTON_EVENT.REFRESH, subjectId });
    checkErrorValue(result);

    //refresh
    reloadSimulationStatus();

    if (result.finished) {
      openModal('result');
    }

    closeModal('simulation');
  };

  const handleSkipRefresh = async (subjectId: number) => {
    try {
      const result = await triggerButtonEvent({ eventType: BUTTON_EVENT.SKIP_REFRESH, subjectId });
      if ('errMsg' in result) {
        alert(result.errMsg);
        await forceStopSimulation();
        resetSimulation();

        openModal('result');
      } else if (result.finished) {
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
        const result = await triggerButtonEvent({
          eventType: BUTTON_EVENT.SKIP_REFRESH,
          subjectId: currentSubjectId,
        });

        if ('errMsg' in result) {
          alert(result.errMsg);
          await forceStopSimulation();
          resetSimulation();
          openModal('result');
        } else if (result.finished) {
          openModal('result');
        }

        closeModal('simulation');
      }
      // APPLY_STATUS.PROGRESS인 경우
      else if (modalData?.status === APPLY_STATUS.PROGRESS) {
        const result = await triggerButtonEvent({
          eventType: BUTTON_EVENT.CANCEL_SUBMIT,
          subjectId: currentSubjectId,
        });
        checkErrorValue(result, true);
      }
    } catch (error) {
      catchAction(error);
    }
  };

  return (
    <Modal>
      <div className="w-[95%] h-[95%] sm:h-auto flex flex-col justify-between sm:w-full max-w-md overflow-hidden bg-white border-1 border-gray-600">
        <ModalHeader
          title=""
          onClose={() => {
            closeModal('simulation');
          }}
        />

        <div className="px-6 pb-6 text-center">
          <div className="flex justify-center mb-4 py-5">
            <div className="w-10 h-10">
              <CheckBlueSvg />
            </div>
          </div>

          <p className="text-gray-700 text-base mb-4">{modalData.topMessage}</p>

          {modalData.description && (
            <p className="text-sm text-gray-700 whitespace-pre-line">{modalData.description}</p>
          )}
        </div>

        <div className="flex justify-end  px-6 py-4 gap-3 bg-gray-100 text-xs">
          {modalData.status === APPLY_STATUS.PROGRESS ||
            (modalData.status === APPLY_STATUS.SUCCESS && (
              <button
                onClick={handleClickCancel}
                className="px-4 py-2 bg-white hover:bg-blue-50 rounded-xs border cursor-pointer"
              >
                취소
              </button>
            ))}
          <button
            onClick={handleClickCheck}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xs cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default SimulationModal;
