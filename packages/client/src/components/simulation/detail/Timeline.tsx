import { ExtendedResultResponse } from '@/pages/simulation/DashboardDetail.tsx';
import { BUTTON_EVENT } from '@/utils/simulation/simulation.ts';
import { APPLY_STATUS } from '@/utils/simulation/simulation.ts';

interface TimelineData {
  name: string;
  code: string;
  color: string;
  timelines: {
    color: string;
    start: number;
    duration: number;
    events: Step[];
  }[];
}

type Step = {
  event: BUTTON_EVENT;
  duration: number; // in seconds
  start: number; // timeline start tick (e.g., 2, 8, 14...)
};

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

function getSubjectData(result: ExtendedResultResponse): TimelineData[] {
  const { timeline, started_at, subject_results } = result;

  // subject -> timelines -> events

  return subject_results.map(subject => ({
    name: subject.subjectInfo?.subjectName,
    code: subject.subjectInfo?.subjectCode + '-' + subject.subjectInfo?.classCode,
    color: getColorCode(subject.status),
    timelines: timeline
      .filter(sel => sel.subject_id === subject.subject_id)
      .map(sel => ({
        color: getColorCode(sel.status),
        start: (sel.started_at - started_at) / 1000,
        duration: (sel.ended_at - sel.started_at) / 1000,
        events: sel.events.reduce<Step[]>(
          (acc, evt, index) => [
            ...acc,
            {
              event: evt.event,
              duration: index == 0 ? 0 : (evt.timestamp - sel.events[index - 1].timestamp) / 1000,
              start: (evt.timestamp - started_at) / 1000,
            },
          ],
          [],
        ),
      })),
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

const TICK_WIDTH = 32;
const HEADER_WIDTH = 200;

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
        <div className={`absolute top-0 flex h-full`} style={{ left: `${HEADER_WIDTH}px` }}>
          {timelineTicks.map(tick => (
            <div key={tick} className="border-r border-gray-200 relative" style={{ width: `${TICK_WIDTH}px` }}>
              <span className="absolute bottom-0 text-xs text-gray-400 left-1/2 -translate-x-1/2">{tick}</span>
            </div>
          ))}
        </div>

        {/* subject rows */}
        {/*<div>*/}
        {subjects.map((subject, rowIndex) => (
          <div key={rowIndex} className="flex items-center">
            {/* subject info */}
            <div className={`py-2 text-sm sticky left-0 right-0 z-10 bg-white`} style={{ width: `${HEADER_WIDTH}px` }}>
              <div className={`font-semibold text-${subject.color}-600`}>{subject.name}</div>
              <span className={`text-xs text-${subject.color}-500`}>{subject.code}</span>
            </div>

            {/* timeline bars */}
            <div className="flex-1 relative h-8">
              <TimelineBar timelines={subject.timelines} />
            </div>
          </div>
        ))}
      </div>
      {/*</div>*/}
    </>
  );
}

// Timeline component
function TimelineBar({ timelines }: { timelines: TimelineData['timelines'] }) {
  return timelines.map((timeline, i) => {
    const left = timeline.start * TICK_WIDTH - 12;
    const width = timeline.duration * TICK_WIDTH + 12 * 2;

    return (
      <div
        key={i}
        className={`relative top-1 h-6 rounded-full px-3 ${getColorClass(timeline.color)}`}
        style={{ left: `${left}px`, width: `${width}px` }}
      >
        {timeline.events.map((event, j) => (
          <TimelineDot key={j} event={event} startAt={timeline.start} color={timeline.color} />
        ))}
      </div>
    );
  });
}

// Timeline Dot component
function TimelineDot({ event, startAt, color }: { event: Step; startAt: number; color: string }) {
  const left = (event.start - startAt) * TICK_WIDTH + 6;

  return (
    <div className={`absolute top-1.5`} style={{ left: `${left}px` }}>
      <div className={`w-3 h-3 text-${color}-500 bg-white border-2 border-${color}-500 rounded-full`} />

      {/* Tooltip wrapper */}
      <div className="relative group cursor-pointer z-10">
        <div className="absolute w-30 -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
          {getEventLabel(event.event)}
          <br />
          {(event.duration + startAt).toFixed(2)} sec
        </div>
      </div>
    </div>
  );
}

export default Timeline;
