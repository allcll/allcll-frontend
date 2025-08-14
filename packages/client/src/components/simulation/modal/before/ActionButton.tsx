import React from 'react';
import { Lecture } from '@/hooks/server/useLectures';
import Button from '@allcll/common/src/components/Button.tsx';

interface IActionButton {
  simulationSubjects: Lecture[];
  handleStartGame: () => void;
  setToggleTip: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionButtons = ({ simulationSubjects, handleStartGame, setToggleTip }: IActionButton) => (
  <div className="flex justify-end gap-2 px-2 pb-2 sm:px-6 sm:pb-6">
    <Button
      variants="primary"
      onClick={() => setToggleTip(true)}
      className="font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      팁 보기
    </Button>

    <Button
      variants="primary"
      onClick={handleStartGame}
      disabled={simulationSubjects.length === 0}
      className="font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      시작하기
    </Button>
  </div>
);

export default ActionButtons;
