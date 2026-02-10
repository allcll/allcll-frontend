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
      <button className="text-gray-600 hover:text-blue-500 cursor-pointer" onClick={onClickHandler}>
        튜토리얼 활성화
      </button>
    )
  );
}

export default VisitTutorialButton;
