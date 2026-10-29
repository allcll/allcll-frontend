import React from 'react';
import { Lecture } from '@/entities/subjects/model/useLectures.ts';
import { Button } from '@allcll/allcll-ui';

interface IActionButton {
  simulationSubjects: Lecture[];
  handleStartGame: () => void;
  setToggleTip: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionButtons = ({ simulationSubjects, handleStartGame, setToggleTip }: IActionButton) => (
  <div className="flex justify-end gap-2 px-2 pb-2 sm:px-6 sm:pb-6">
    <Button variant="primary" size="medium" onClick={() => setToggleTip(true)}>
      팁 보기
    </Button>

    <Button variant="outlined" size="medium" onClick={handleStartGame} disabled={simulationSubjects.length === 0}>
      시작하기
    </Button>
  </div>
);

export default ActionButtons;
