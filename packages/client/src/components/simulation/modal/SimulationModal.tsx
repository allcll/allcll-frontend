import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import CheckBlueSvg from '@/assets/check-blue.svg?react';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import { SubjectStatusType } from '@/utils/types';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { useEffect, useState } from 'react';

const SIMULATION_MODAL_CONTENTS = [
  {
    status: 'PROGRESS',
    topMessage: '선택한 과목을 수강신청 하시겠습니까?',
    description: '교과목명(CourseTitle):',
  },
  {
    status: 'SUCCESS',
    topMessage: '과목이 신청 되었습니다. 수강신청내역을 재 조회 하시겠습니까?',
    description:
      '취소를 선택하실 경우 [수강신청내역]이 갱신되지 않습니다. 취소를 선택하실 경우 수강신청 최종 완료 후 반드시 [수강신청내역] 재 조회를 눌러 신청 내역을 확인하세요. [수강신청내역]에 조회된 과목만이 정상적으로 수강신청된 과목입니다.',
  },
  {
    status: 'FAILED',
    topMessage: '수강 여석이 없습니다!',
  },
  {
    status: 'DOUBLED',
    topMessage: '이미 수강신청 된 과목입니다!',
  },
  {
    status: 'CAPTCHA_FAILED',
    topMessage: '입력하신 코드가 일치하지 않습니다',
  },
  {
    status: 'NOT_ELIGIBLE',
    topMessage: '수강신청 대상 학과가 아닙니다',
  },
];

interface ISimulationModalProps {
  status: SubjectStatusType;
}

function SimulationModal({ status }: ISimulationModalProps) {
  const { closeModal, openModal } = useSimulationModalStore();
  const { currentSubjectId, setSubjectStatus } = useSimulationSubjectStore();
  const { subjectsStatus, setSubjectsStatus } = useSimulationProcessStore();
  const currentSubjectStatus = subjectsStatus.find(subject => subject.subjectId === currentSubjectId);

  const modalData = SIMULATION_MODAL_CONTENTS.find(data => data.status === currentSubjectStatus?.subjectStatus);

  if (!modalData) return null;

  const handleSubjectResult = async () => {
    if (currentSubjectStatus?.subjectStatus === 'PROGRESS') {
      if (currentSubjectStatus.isCaptchaFailed) {
        setSubjectStatus(currentSubjectId, 'CAPTCHA_FAILED');
        setSubjectsStatus(currentSubjectId, 'CAPTCHA_FAILED');
        closeModal('simulation');
        openModal('simulation');
      } else {
        setSubjectStatus(currentSubjectId, 'SUCCESS');
        setSubjectsStatus(currentSubjectId, 'SUCCESS');
        closeModal('simulation');
        openModal('simulation');
      }
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
          {modalData.status !== 'fail' && (
            <button
              onClick={() => {
                closeModal('simulation');
              }}
              className="px-4 py-2 bg-white hover:bg-blue-50 rounded-xs border cursor-pointer"
            >
              취소
            </button>
          )}
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

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
