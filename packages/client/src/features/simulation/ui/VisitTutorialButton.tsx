import { Button } from '@allcll/allcll-ui';
import useTutorialStore from '@/features/simulation/model/useTutorialStore.ts';

interface IVisitTutorial {
  onClick?: () => void;
}

function VisitTutorialButton({ onClick }: IVisitTutorial) {
  const shouldSkipTutorial = useTutorialStore(state => state.shouldSkipTutorial);
  const resetSkipTutorial = useTutorialStore(state => state.resetVisited);

  const onClickHandler = () => {
    resetSkipTutorial();
    if (onClick) onClick();
  };

  return (
    shouldSkipTutorial && (
      <Button variant="text" color="gray" size="medium" onClick={onClickHandler}>
        튜토리얼 활성화
      </Button>
    )
  );
}

export default VisitTutorialButton;
