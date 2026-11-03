import React from 'react';
import { Lecture } from '@/entities/subjects/model/useLectures.ts';
import { Button } from '@allcll/allcll-ui';

interface IActionButton {
  simulationSubjects: Lecture[];
  handleStartGame: () => void;
  setToggleTip: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionButtons = ({ simulationSubjects, handleStartGame, setToggleTip }: IActionButton) => (
  <>
    <Button variant="solid" color="gray" size="medium" onClick={() => setToggleTip(true)}>
      팁 보기
    </Button>

    <Button variant="solid" size="medium" onClick={handleStartGame} disabled={simulationSubjects.length === 0}>
      시작하기
    </Button>
  </>
);

export default ActionButtons;
