import { useState } from 'react';
import YouTube from 'react-youtube';
import { useSimulationModalStore } from '@/features/simulation/model/useSimulationModal.ts';
import ArrowdownSvg from '@/assets/arrow-down-gray.svg?react';
import useMobile from '@/shared/lib/useMobile.ts';
import Checkbox from '@common/components/checkbox/Checkbox.tsx';
import SejongUI from '../../../../../../sejong-ui';
import { VisitTutorial } from '@/features/simulation/lib/VisitTutorial.ts';
import { Dialog } from '@allcll/allcll-ui';

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

  const openModal = useSimulationModalStore(state => state.openModal);
  const closeModal = useSimulationModalStore(state => state.closeModal);
  const isMobile = useMobile();
  const youTubeSize = isMobile ? { width: '250', height: '141' } : { width: '600', height: '338' };
  const showTutorial = VisitTutorial.get();

  if (!showTutorial) {
    openModal('wish');
  }

  const goToPreviousTutorial = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? tutorialVideos.length - 1 : prevIndex - 1));
  };

  const goToNextTutorial = () => {
    setCurrentIndex(prevIndex => (prevIndex === tutorialVideos.length - 1 ? 0 : prevIndex + 1));
  };

  const hidePopupForAWeek = () => {
    if (!popupChecked) {
      return;
    }

    VisitTutorial.set();
    setPopupChecked(true);
  };

  const currentVideo = tutorialVideos[currentIndex];

  const handleCloseModal = () => {
    closeModal();
  };

  const handleClickSkipTutorial = () => {
    hidePopupForAWeek();
    closeModal();
    openModal('wish');
  };

  return (
    <Dialog title="올클연습 소개" onClose={handleCloseModal} isOpen={showTutorial}>
      <Dialog.Content>
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

            <p className="text-gray-500 text-sm">
              올클연습은 실제 수강신청과 유사한 환경에서 연습할 수 있는 기능입니다.
            </p>
            <p className="text-gray-500 text-sm">
              각 영상을 통해 연습 과목 선택, 연습 시작 방법, 연습 종료 및 결과 분석 방법을 배울 수 있습니다.
            </p>
            <SejongUI.Modal.ButtonContainer className="mt-4">
              <Checkbox
                label="일주일 동안 보지 않기"
                checked={popupChecked}
                onChange={() => setPopupChecked(!popupChecked)}
              />
              <button
                onClick={handleClickSkipTutorial}
                className="px-4 cursor-pointer text-white py-2 bg-blue-500 hover:bg-blue-600 rounded-md"
              >
                튜토리얼 건너뛰기
              </button>
            </SejongUI.Modal.ButtonContainer>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

export default TutorialModal;
