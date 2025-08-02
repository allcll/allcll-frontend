import { Lecture } from '@/hooks/server/useLectures';

interface IActionButton {
  simulationSubjects: Lecture[];
  handleStartGame: () => void;
  setToggleTip: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionButtons = ({ simulationSubjects, handleStartGame, setToggleTip }: IActionButton) => (
  <div className="p-6 justify-end flex gap-2">
    <button
      onClick={() => setToggleTip(true)}
      className={`px-6 py-2 ${
        simulationSubjects.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
      } text-white font-semibold cursor-pointer rounded-md`}
    >
      팁 보기
    </button>
    <button
      onClick={handleStartGame}
      disabled={simulationSubjects.length === 0}
      className={`px-6 py-2 ${
        simulationSubjects.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
      } text-white font-semibold cursor-pointer rounded-md`}
    >
      시작하기
    </button>
  </div>
);

export default ActionButtons;
