import { useEffect, useState } from 'react';
import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import ArrowdownSvg from '@/assets/arrow-down-gray.svg?react';
import YouTube from 'react-youtube';
import useMobile from '@/hooks/useMobile';
import Checkbox from '@common/components/checkbox/Checkbox';
import { useTutorial } from '@/hooks/simulation/useTutorial.ts';

const tutorialVideos = [
  {
    id: 1,
    videoId: 'BTNgos01s1o',
    title: '1단계: 연습 과목 선택',
  },
  {
    id: 2,
    videoId: 'yYq-sXZmS9I',
    title: '2단계: 연습 시작 방법',
  },
  {
    id: 3,
    videoId: 'mEi-n2kEs94',
    title: '3단계: 연습 종료',
  },
  {
    id: 4,
    videoId: 'xmD5YuZtJv4',
    title: '4단계: 내 연습 결과 분석',
  },
];

function TutorialModal() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [popupChecked, setPopupChecked] = useState(false);

  const { openModal, closeModal } = useSimulationModalStore();
  const { isTutorialRequired, hideTutorialForAWeek } = useTutorial();

  const isMobile = useMobile();
  const youTubeSize = isMobile ? { width: '250', height: '141' } : { width: '600', height: '338' };

  useEffect(() => {
    if (!isTutorialRequired) {
      openModal('wish');
    }
  }, [isTutorialRequired, openModal]);

  const goToPreviousTutorial = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? tutorialVideos.length - 1 : prevIndex - 1));
  };

  const goToNextTutorial = () => {
    setCurrentIndex(prevIndex => (prevIndex === tutorialVideos.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePopupCheckbox = () => {
    setPopupChecked(!popupChecked);
  };

  const handleCloseModal = () => {
    if (popupChecked) {
      hideTutorialForAWeek();
    }
    closeModal();
  };

  const handleClickSkipTutorial = () => {
    if (popupChecked) {
      hideTutorialForAWeek();
    }
    closeModal();
    openModal('wish');
  };

  const currentVideo = tutorialVideos[currentIndex];

  if (!isTutorialRequired) {
    return null;
  }

  return (
    <Modal onClose={handleCloseModal}>
      <ModalHeader title="올클연습 소개" onClose={handleCloseModal} />
      <div className="w-full flex flex-col p-4">
        <div className="mx-auto" style={{ width: youTubeSize.width + 'px', height: youTubeSize.height + 'px' }}>
          <YouTube
            videoId={currentVideo.videoId}
            opts={{
              width: youTubeSize.width,
              height: youTubeSize.height,
              playerVars: {
                autoplay: 1,
                mute: 1,
                playlist: currentVideo.videoId,
              },
            }}
            onEnd={goToNextTutorial}
          />
        </div>

        <div className="mt-4 flex flex-col justify-center items-center gap-2">
          <div className="flex justify-center items-center gap-5">
            <button className="cursor-pointer w-5 h-5" aria-label="이전 튜토리얼" onClick={goToPreviousTutorial}>
              {currentIndex !== 0 && <ArrowdownSvg className="w-5 h-5 transform rotate-90" />}
            </button>
            <h2 className="text-gray-700 text-xl font-semibold">{currentVideo.title}</h2>
            <button className="cursor-pointer" aria-label="이전 튜토리얼" onClick={goToNextTutorial}>
              {currentIndex < 3 && <ArrowdownSvg className="w-5 h-5 transform -rotate-90" />}
            </button>
          </div>

          <p className="text-gray-500 text-sm">올클연습은 실제 수강신청과 유사한 환경에서 연습할 수 있는 기능입니다.</p>
          <p className="text-gray-500 text-sm">
            각 영상을 통해 연습 과목 선택, 연습 시작 방법, 연습 종료 및 결과 분석 방법을 배울 수 있습니다.
          </p>
          <div className="flex flex-row w-full gap-4 mt-4 justify-end">
            <Checkbox label="일주일 동안 보지 않기" checked={popupChecked} onChange={handlePopupCheckbox} />
            <button
              onClick={handleClickSkipTutorial}
              className="px-4 cursor-pointer text-white py-2 bg-blue-500 hover:bg-blue-600 rounded-md"
            >
              튜토리얼 건너뛰기
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default TutorialModal;
