type Step = {
  label: string;
  duration: number; // in seconds
  start: number; // timeline start tick (e.g., 2, 8, 14...)
};

type Subject = {
  name: string;
  code: string;
  steps: Step[];
  color: 'green' | 'blue' | 'gray' | 'red';
};

const timelineTicks = Array.from({ length: 35 }, (_, i) => i + 1);

const subjects: Subject[] = [
  {
    name: '운영체제 이수정',
    code: '004310-004',
    color: 'green',
    steps: [
      { label: '신청 버튼 클릭', start: 2, duration: 1.03 },
      { label: '캡차 입력 시간', start: 8, duration: 2.59 },
    ],
  },
  {
    name: '컴퓨터그래픽스 최수미',
    code: '003281-001',
    color: 'green',
    steps: [{ label: '신청 버튼 클릭', start: 8, duration: 2.59 }],
  },
  {
    name: '운영체제 이수정',
    code: '004310-004',
    color: 'blue',
    steps: [{ label: '수강 신청 처리', start: 14, duration: 5 }],
  },
  {
    name: '컴퓨터그래픽스 최수미',
    code: '003281-001',
    color: 'gray',
    steps: [{ label: '서버 응답 대기', start: 21, duration: 5 }],
  },
  {
    name: '운영체제 이수정',
    code: '004310-004',
    color: 'red',
    steps: [
      { label: '신청 실패 대기', start: 27, duration: 5 },
      { label: '다시 시도', start: 34, duration: 1 },
    ],
  },
];

const getColorClass = (color: Subject['color']) => {
  switch (color) {
    case 'green':
      return 'bg-green-100 border-green-500 text-green-700';
    case 'blue':
      return 'bg-blue-100 border-blue-500 text-blue-700';
    case 'gray':
      return 'bg-gray-100 border-gray-400 text-gray-700';
    case 'red':
      return 'bg-red-100 border-red-500 text-red-700';
    default:
      return '';
  }
};

const Timeline = () => {
  return (
    <>
      <div className="relative overflow-x-auto overflow-y-hidden">
        {/* timeline grid */}
        <div className="absolute top-0 left-[200px] flex h-full">
          {timelineTicks.map(tick => (
            <div key={tick} className="w-[32px] border-r border-gray-200 relative">
              <span className="absolute bottom-0 text-xs text-gray-400 left-1/2 -translate-x-1/2">{tick}</span>
            </div>
          ))}
        </div>

        {/* subject rows */}
        <div>
          {subjects.map((subject, rowIndex) => (
            <div key={rowIndex} className="flex items-center">
              {/* subject info */}
              <div className="w-[200px] py-2 text-sm sticky left-0 z-10 bg-white">
                <div className={`font-semibold ${subject.color === 'red' ? 'text-red-600' : ''}`}>{subject.name}</div>
                <span className={`text-xs ${subject.color === 'red' ? 'text-red-500' : 'text-gray-500'}`}>
                  {subject.code}
                </span>
              </div>

              {/* timeline bars */}
              <div className="flex-1 relative h-8">
                {subject.steps.map((step, i) => {
                  const left = step.start * 32; // width per tick
                  const width = step.duration * 32;

                  return (
                    <div
                      key={i}
                      className={`absolute top-1 h-6 rounded-full px-3 flex items-center gap-1 ${getColorClass(subject.color)}`}
                      style={{ left: `${left}px`, width: `${width}px` }}
                    >
                      <div className="w-2 h-2 bg-white border rounded-full" />
                      {/* Tooltip wrapper */}
                      <div className="relative group cursor-pointer z-10">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          {step.label}
                          <br />
                          {step.duration.toFixed(2)} sec
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Timeline;
