import { Lecture } from '@/entities/subjects/model/useLectures.ts';
import { Button } from '@allcll/allcll-ui';

interface IActionButton {
  simulationSubjects: Lecture[];
  handleStartGame: () => void;
}

const ActionButtons = ({ simulationSubjects, handleStartGame }: IActionButton) => (
  <>
    <Button variant="solid" size="medium" onClick={handleStartGame} disabled={simulationSubjects.length === 0}>
      시작하기
    </Button>
  </>
);

export default ActionButtons;
