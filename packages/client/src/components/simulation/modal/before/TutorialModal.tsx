import { useState } from 'react';
import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import ArrowdownSvg from '@/assets/arrow-down-gray.svg?react';

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
  const { closeModal, openModal } = useSimulationModalStore();

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? tutorialVideos.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex === tutorialVideos.length - 1 ? 0 : prevIndex + 1));
  };

  const currentVideo = tutorialVideos[currentIndex];

  return (
    <Modal
      onClose={() => {
        closeModal();
      }}
    >
      <ModalHeader
        title="올클 소개"
        onClose={() => {
          closeModal();
        }}
      />
      <div className="w-full flex flex-col p-4">
        <div className="flex justify-center items-center gap-5">
          <button className="cursor-pointer w-5 h-5" onClick={goToPrevious}>
            {currentIndex !== 0 && <ArrowdownSvg className="w-5 h-5 transform rotate-90" />}
          </button>

          <iframe
            key={currentVideo.id}
            data-testid="video-player"
            width={600}
            height={338}
            src={`https://www.youtube.com/embed/${currentVideo.videoId}?loop=1&playlist=${currentVideo.videoId}`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <button className="cursor-pointer" onClick={goToNext}>
            {currentIndex < 3 && <ArrowdownSvg className="w-5 h-5 transform -rotate-90" />}
          </button>
        </div>

        <div className="mt-4 flex flex-col justify-center items-center gap-2">
          <h2 className="text-gray-700 text-xl font-semibold">{currentVideo.title}</h2>
          <p className="text-gray-500 text-sm">
            올클 연습은 실제 수강신청과 유사한 환경에서 연습할 수 있는 기능입니다.
          </p>
          <p className="text-gray-500 text-sm">
            각 영상을 통해 연습 과목 선택, 연습 시작 방법, 연습 종료 및 결과 분석 방법을 배울 수 있습니다.
          </p>
          <div className="flex gap-4 mt-4 justify-end">
            <button
              onClick={() => {
                closeModal();
                openModal('wish');
              }}
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
