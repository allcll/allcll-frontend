import { ExtendedResultResponse } from '@/pages/simulation/DashboardDetail.tsx';
import { BUTTON_EVENT } from '@/utils/simulation/simulation.ts';
import { APPLY_STATUS } from '@/utils/simulation/simulation.ts';

type Step = {
  label: string;
  duration: number; // in seconds
  start: number; // timeline start tick (e.g., 2, 8, 14...)
};

// type Subject = {
//   name: string;
//   code: string;
//   steps: Step[];
//   color: 'green' | 'blue' | 'gray' | 'red';
// };

// const subjects: Subject[] = [
//   {
//     name: '운영체제 이수정',
//     code: '004310-004',
//     color: 'green',
//     steps: [
//       { label: '신청 버튼 클릭', start: 2, duration: 1.03 },
//       { label: '캡차 입력 시간', start: 8, duration: 2.59 },
//     ],
//   },
//   {
//     name: '컴퓨터그래픽스 최수미',
//     code: '003281-001',
//     color: 'green',
//     steps: [{ label: '신청 버튼 클릭', start: 8, duration: 2.59 }],
//   },
//   {
//     name: '운영체제 이수정',
//     code: '004310-004',
//     color: 'blue',
//     steps: [{ label: '수강 신청 처리', start: 14, duration: 5 }],
//   },
//   {
//     name: '컴퓨터그래픽스 최수미',
//     code: '003281-001',
//     color: 'gray',
//     steps: [{ label: '서버 응답 대기', start: 21, duration: 5 }],
//   },
//   {
//     name: '운영체제 이수정',
//     code: '004310-004',
//     color: 'red',
//     steps: [
//       { label: '신청 실패 대기', start: 27, duration: 5 },
//       { label: '다시 시도', start: 34, duration: 1 },
//     ],
//   },
// ];

function getColorCode(status: APPLY_STATUS) {
  switch (status) {
    case APPLY_STATUS.SUCCESS:
      return 'green';
    case APPLY_STATUS.FAILED:
      return 'red';
    case APPLY_STATUS.CAPTCHA_FAILED:
      return 'orange';
    case APPLY_STATUS.PROGRESS:
      return 'yellow';
    default:
      return 'gray';
  }
}

function getSubjectData(result: ExtendedResultResponse) {
  const { timeline, started_at } = result;

  return timeline.map(sel => ({
    name: sel.subjectInfo?.subjectName,
    code: sel.subjectInfo?.subjectCode + '-' + sel.subjectInfo?.classCode,
    color: getColorCode(sel.status),
    steps: sel.events.reduce<Step[]>(
      (acc, evt, index) => [
        ...acc,
        {
          label: getEventLabel(evt.event),
          duration: index == 0 ? 0 : (evt.timestamp - sel.events[index - 1].timestamp) / 1000,
          start: (evt.timestamp - started_at) / 1000,
        },
      ],
      [],
    ),
  }));
}

function getEventLabel(eventType: BUTTON_EVENT) {
  switch (eventType) {
    case BUTTON_EVENT.SEARCH:
      return '검색 버튼 클릭';
    case BUTTON_EVENT.APPLY:
      return '신청 버튼 클릭';
    case BUTTON_EVENT.CAPTCHA:
      return '코드 입력 버튼 클릭';
    case BUTTON_EVENT.SUBJECT_SUBMIT:
      return '수강 신청 버튼 클릭';
    case BUTTON_EVENT.SKIP_REFRESH:
      return '재조회 취소';
    case BUTTON_EVENT.REFRESH:
      return '재조회 버튼 클릭';
    case BUTTON_EVENT.CANCEL_SUBMIT:
      return '수강 신청 취소';
  }
}

const getColorClass = (color: string) => {
  if (!color) return '';

  return `bg-${color}-100 border-${color}-500 text-${color}-700`;
};

function Timeline({ result }: { result: ExtendedResultResponse }) {
  const subjects = getSubjectData(result);
  console.log(result.timeline);
  console.log(subjects);

  const totalDuration = (result.ended_at - result.started_at) / 1000;
  const timelineTicks = Array.from({ length: Math.floor(totalDuration) + 5 }, (_, i) => i + 1);

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
                      <div className="relative group cursor-pointer z-5">
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
}

export default Timeline;
