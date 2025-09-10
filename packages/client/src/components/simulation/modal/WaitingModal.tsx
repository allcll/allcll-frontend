import { useState, useEffect, useRef } from 'react';
import Modal from '@/components/simulation/modal/Modal.tsx';
import useLectures from '@/hooks/server/useLectures.ts';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore, { SimulationState } from '@/store/simulation/useSimulationProcess';
import { findLecturesById } from '@/utils/subjectPicker.ts';
import { calculateBehindPeople } from '@/utils/simulationTimes.ts';
import { getSimulateStatus } from '@/utils/simulation/subjects.ts';

function WaitingModal() {
  const [waitTime, setWaitTime] = useState(0);
  const [aheadPeople, setAheadPeople] = useState(0);
  const [behindPeople, setBehindPeople] = useState(1);
  const [timer, setTimer] = useState(0);
  const { data: lectures } = useLectures();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const closeModal = useSimulationModalStore(state => state.closeModal);
  const currentSimulation = useSimulationProcessStore(state => state.currentSimulation);
  const setCurrentSimulation = useSimulationProcessStore(state => state.setCurrentSimulation);

  const unit = 0.2;
  const peoplePerUnit = 98;
  const processedPerUnit = 79;

  //첫 렌더링 시
  useEffect(() => {
    let cumulativeIn = Math.floor(currentSimulation.clickedTime / 0.2) * 100 + 124;

    const waitSec = (cumulativeIn / processedPerUnit) * unit;

    for (let i = 0; i <= Math.floor(currentSimulation.clickedTime / unit); i++) {
      cumulativeIn += i * peoplePerUnit;
    }

    setAheadPeople(cumulativeIn);
    setWaitTime(Math.ceil(waitSec));
  }, []);

  //(타이머)초 후
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        const elapsedTime = prev + 1;

        // 뒷 사람 수 재계산
        const newBehindPeople = calculateBehindPeople(
          elapsedTime,
          currentSimulation.clickedTime,
          unit,
          behindPeople,
          peoplePerUnit,
          processedPerUnit,
        );

        setBehindPeople(newBehindPeople);

        return elapsedTime;
      });

      const cumulativeProcessed = Math.floor((waitTime + currentSimulation.clickedTime) / 0.2) * processedPerUnit;

      if (aheadPeople < 0) {
        setAheadPeople(0);
      } else {
        setAheadPeople(prev => prev - cumulativeProcessed);
      }

      // 대기시간 1초씩 감소
      setWaitTime(prev => {
        const updated = Math.max(prev - 1, 0);
        if (updated === 0 && intervalRef.current) {
          clearInterval(intervalRef.current);
          closeModal();
        }

        return updated;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [waitTime]);

  // 데이터 패칭 시뮬레이션
  useEffect(() => {
    let simulationData: Partial<SimulationState>;
    const { setCurrentSimulation } = useSimulationProcessStore.getState();

    const getLectures = (subjects: { subjectId: number }[]) => {
      return subjects.map(subject => findLecturesById(lectures, subject.subjectId)).filter(s => !!s);
    };

    getSimulateStatus()
      .then(result => {
        if (!result || result.simulationId === -1) throw new Error('No Ongoing Simulation');
        const { simulationId, nonRegisteredSubjects, registeredSubjects } = result;

        simulationData = {
          simulationId,
          nonRegisteredSubjects: getLectures(nonRegisteredSubjects ?? []),
          registeredSubjects: getLectures(registeredSubjects ?? []),
        };
      })
      .catch(error => console.error(error));

    return () => {
      if (simulationData) setCurrentSimulation(simulationData);
    };
  }, []);

  const handleClickStopButton = () => {
    setCurrentSimulation({ simulationStatus: 'before' });
    closeModal();
  };

  return (
    <Modal onClose={() => {}}>
      <div className="sm:w-full max-w-md bg-white rounded-sm shadow-xl p-6 text-center space-y-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          서비스 <span className="text-blue-600 font-bold">접속대기 중</span>입니다.
        </h2>

        <div className="text-sm md:text-base text-gray-600">
          예상대기시간: <span className="text-blue-600 font-bold text-xl">{waitTime}</span>초
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(timer / (waitTime + timer)) * 100}%` }}
          />
        </div>

        <div className="text-gray-700 text-sm md:text-base leading-relaxed">
          고객님 앞에 <span className="text-green-600 font-bold text-xl">{aheadPeople < 0 ? 0 : aheadPeople}</span>명,
          뒤에 <span className="text-green-600 font-bold text-xl">{behindPeople}</span>명의 대기자가 있습니다. <br />
          현재 접속 사용자가 많아 대기 중이며, 잠시만 기다리시면 서비스로 자동 접속 됩니다.
        </div>

        <button
          className="inline-flex items-center justify-center border-2 border-gray-400 text-gray-800 px-2 py-1 hover:bg-gray-100"
          onClick={handleClickStopButton}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          중지
        </button>

        <p className="text-xs md:text-sm text-gray-500">재 접속하시면 대기시간이 더 길어집니다.</p>
      </div>
    </Modal>
  );
}

export default WaitingModal;
