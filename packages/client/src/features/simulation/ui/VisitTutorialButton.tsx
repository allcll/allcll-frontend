import useTutorialStore from '@/features/simulation/model/useTutorialStore.ts';

function VisitTutorialButton() {
  const shouldSkipTutorial = useTutorialStore(state => state.shouldSkipTutorial);
  const resetSkipTutorial = useTutorialStore(state => state.resetVisited);
  
  return (
    shouldSkipTutorial && (
      <button className="text-gray-600 hover:text-blue-500 cursor-pointer" onClick={resetSkipTutorial}>
        튜토리얼 활성화
      </button>
    )
  );
}

export default VisitTutorialButton;