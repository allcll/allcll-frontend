import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import CheckBlueSvg from '@/assets/check-blue.svg?react';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import {
  APPLY_STATUS,
  BUTTON_EVENT,
  forceStopSimulation,
  isSimulationFinished,
  triggerButtonEvent,
} from '@/utils/simulation/simulation';

const SIMULATION_MODAL_CONTENTS = [
  {
    status: APPLY_STATUS.PROGRESS,
    topMessage: '선택한 과목을 수강신청 하시겠습니까?',
    description: '교과목명(CourseTitle):',
  },
  {
    status: APPLY_STATUS.SUCCESS,
    topMessage: '과목이 신청 되었습니다. 수강신청내역을 재 조회 하시겠습니까?',
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
  fetchAndUpdateSimulationStatus: () => void;
}

function SimulationModal({ fetchAndUpdateSimulationStatus }: ISimulationModal) {
  const { closeModal, openModal } = useSimulationModalStore();
  const { currentSubjectId, setSubjectStatus } = useSimulationSubjectStore();
  const { subjectsStatus, setSubjectsStatus, resetSimulation } = useSimulationProcessStore();

  const currentSubjectStatus = subjectsStatus.find(subject => subject.subjectId === currentSubjectId);
  const modalData = SIMULATION_MODAL_CONTENTS.find(data => data.status === currentSubjectStatus?.subjectStatus);

  const skipRefrech = modalData?.status === APPLY_STATUS.FAILED || APPLY_STATUS.DOUBLED;
  const checkFinish = modalData?.status === APPLY_STATUS.FAILED || APPLY_STATUS.DOUBLED || APPLY_STATUS.SUCCESS;

  if (!modalData) return null;

  const handleSubjectResult = async () => {
    if (modalData.status === APPLY_STATUS.PROGRESS) {
      /**
       * 신청하시겠습니까 버튼 이벤트
       */
      triggerButtonEvent({ eventType: BUTTON_EVENT.SUBJECT_SUBMIT, subjectId: currentSubjectId })
        .then(result => {
          if ('errMsg' in result) {
            alert(result.errMsg);
          } else {
            // console.log(result.status, subjectsStatus);

            setSubjectStatus(currentSubjectId, result.status);
            setSubjectsStatus(currentSubjectId, result.status);
            openModal('simulation');
          }
        })
        .catch(e => {
          console.error('예외 발생:', e);
        });
    } else if (modalData?.status === APPLY_STATUS.SUCCESS) {
      /**
       * 과목 신청 완료 -> 과목 담기 종료 이벤트
       *  */
      triggerButtonEvent({
        eventType: BUTTON_EVENT.REFRESH,
        subjectId: currentSubjectId,
      }).then(result => {
        if ('errMsg' in result) {
          alert(result.errMsg);
        }
        fetchAndUpdateSimulationStatus();
        if (result.finished) {
          console.log(result, subjectsStatus);
          forceStopSimulation().then(() => {
            openModal('result');
          });
        }
      });
      // .then(() => {
      //   return isSimulationFinished();
      // })
      // .then(result => {
      //   if (result) {
      //     forceStopSimulation().then(() => {
      //       console.log('실행중 ');
      //       return;
      //     });
      //     openModal('result');
      //   }
      // });

      closeModal('simulation');
    } else if (skipRefrech) {
      triggerButtonEvent({
        eventType: BUTTON_EVENT.SKIP_REFRESH,
        subjectId: currentSubjectId,
      })
        .then(async result => {
          if ('errMsg' in result) {
            alert(result.errMsg);
            forceStopSimulation().then(() => {
              return;
            });
            resetSimulation();
            openModal('result');
          } else {
            // if (currentSubjectStatus?.subjectStatus === APPLY_STATUS.FAILED) {
            //   const isFinishSimulation = await isSimulationFinished();

            //   if (isFinishSimulation) {
            //     forceStopSimulation().then(() => {
            //       openModal('result');
            //     });
            //   }
            // }
            if (result.finished) {
              console.log(result, subjectsStatus);
              forceStopSimulation().then(() => {
                openModal('result');
              });
            }
          }
        })
        .catch(e => {
          console.error('예외 발생:', e);
        });

      closeModal('simulation');
    } else if (checkFinish) {
    }
  };

  const handleClickCancle = async () => {
    /**
     * 취소 버튼 클릭했을 때, 모달의 타입이
     * SUCCESS이거나 FAILED일 때 과목 신청 완료, 시뮬레이션 종료 확인
     */
    if (modalData?.status === APPLY_STATUS.SUCCESS) {
      triggerButtonEvent({
        eventType: BUTTON_EVENT.SKIP_REFRESH,
        subjectId: currentSubjectId,
      })
        .then(async result => {
          if ('errMsg' in result) {
            alert(result.errMsg);
            forceStopSimulation().then(() => {
              console.log(result, subjectsStatus);

              openModal('result');
            });
            resetSimulation();
          } else {
            console.log(result.finished);
            if (result.finished) {
              console.log(result, subjectsStatus);
              forceStopSimulation().then(() => {
                openModal('result');
              });
            }
          }
        })
        .catch(e => {
          console.error('예외 발생:', e);
        });

      closeModal('simulation');
    } else if (modalData?.status === APPLY_STATUS.PROGRESS) {
      triggerButtonEvent({
        eventType: BUTTON_EVENT.CANCEL_SUBMIT,
        subjectId: currentSubjectId,
      }).then(async result => {
        if ('errMsg' in result) {
          alert(result.errMsg);
          forceStopSimulation().then(() => {
            openModal('result');
          });
        }
      });
    } else {
      closeModal('simulation');
    }
  };

  return (
    <Modal>
      <div className="w-full max-w-md overflow-hidden bg-white border-1 border-gray-600">
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
            (APPLY_STATUS.SUCCESS && (
              <button
                onClick={handleClickCancle}
                className="px-4 py-2 bg-white hover:bg-blue-50 rounded-xs border cursor-pointer"
              >
                취소
              </button>
            ))}
          <button
            onClick={handleSubjectResult}
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
