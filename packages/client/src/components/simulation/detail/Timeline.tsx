import { ExtendedResultResponse } from '@/pages/simulation/DashboardDetail.tsx';
import { BUTTON_EVENT } from '@/utils/simulation/simulation.ts';
import { getStatusColorCode } from '@/utils/colors.ts';

interface TimelineData {
  name: string;
  code: string;
  color: string;
  timelines: {
    color: string;
    start: number;
    duration: number;
    isTop: boolean;
    events: Step[];
  }[];
}

type Step = {
  event: BUTTON_EVENT;
  duration: number; // in seconds
  start: number; // timeline start tick (e.g., 2, 8, 14...)
};

const TICK_WIDTH = 32;
const HEADER_WIDTH = 200;

function Timeline({ result }: Readonly<{ result: ExtendedResultResponse }>) {
  const subjects = getSubjectData(result);

  const totalDuration = (result.ended_at - result.started_at) / 1000;
  const timelineTicks = Array.from({ length: Math.floor(totalDuration) + 5 }, (_, i) => i + 1);

  return (
    <div className="relative">
      <div className="relative overflow-x-auto overflow-y-hidden">
        {/* timeline grid */}
        <div className="absolute top-0 flex h-full" style={{ left: `${HEADER_WIDTH}px` }}>
          {timelineTicks.map(tick => (
            <div key={tick} className="border-r border-gray-200 relative" style={{ width: `${TICK_WIDTH}px` }}>
              <span className="absolute text-xs text-gray-400 bg-white bottom-0 right-0 translate-x-1/2">{tick}</span>
            </div>
          ))}
        </div>

        {/* subject rows */}
        {subjects.map((subject, rowIndex) => (
          <div
            key={'timeline-row-' + rowIndex}
            className="flex items-center"
            style={{ width: `${TICK_WIDTH * timelineTicks.length}px` }}
          >
            {/* subject info */}
            <div className="py-2 text-sm md:sticky left-0 right-0 z-10 bg-white" style={{ width: `${HEADER_WIDTH}px` }}>
              <div className={`font-semibold ${getTextColor600(subject.color)}`}>{subject.name}</div>
              <span className={`text-xs ${getTextColor500(subject.color)}`}>{subject.code}</span>
            </div>

            {/* timeline bars */}
            <div className="flex-1 relative h-8">
              <TimelineBar timelines={subject.timelines} />
            </div>
          </div>
        ))}
      </div>

      {/* 그라데이션 */}
      <div className="pointer-events-none absolute inset-y-4 left-0 md:left-[200px] w-3 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-4 right-0 w-3 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}

// Timeline component
function TimelineBar({ timelines }: Readonly<{ timelines: TimelineData['timelines'] }>) {
  return timelines.map((timeline, i) => {
    const left = timeline.start * TICK_WIDTH - 12;
    const width = timeline.duration * TICK_WIDTH + 12 * 2;

    return (
      <div
        key={'timeline-bar-' + i}
        className={`absolute top-1 h-6 rounded-full px-3 ${getColorClass(timeline.color)}`}
        style={{ left: `${left}px`, width: `${width}px` }}
      >
        {timeline.events.map((event, j) => (
          <TimelineDot
            key={'timeline-dot-' + j}
            event={event}
            startAt={timeline.start}
            color={timeline.color}
            isTop={timeline.isTop}
          />
        ))}
      </div>
    );
  });
}

// Timeline Dot component
function TimelineDot({
  event,
  startAt,
  color,
  isTop,
}: Readonly<{ event: Step; startAt: number; color: string; isTop: boolean }>) {
  const left = (event.start - startAt) * TICK_WIDTH + 6;
  const eventTitle = getEventLabel(event.event);
  const duration = event.start;
  const tooltipPos = isTop ? 'top-4' : 'bottom-4';

  return (
    <div className="absolute top-1.5" style={{ left: `${left}px` }}>
      <div
        className={`w-3 h-3 peer bg-white border-2 rounded-full hover:shadow cursor-pointer ${getColorBorderText(color)}`}
      />

      {/* Tooltip wrapper */}
      <div
        className={`absolute z-10 ${tooltipPos} left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black text-white text-nowrap text-xs text-center opacity-0 peer-hover:opacity-100 transition-opacity duration-200`}
      >
        {eventTitle}
        <br />
        {duration.toFixed(2)} sec
      </div>
    </div>
  );
}

// Timeline Line component

function getColorClass(color: string) {
  switch (color) {
    case 'green':
      return 'bg-green-100 border-green-500 text-green-700';
    case 'red':
      return 'bg-red-100 border-red-500 text-red-700';
    case 'orange':
      return 'bg-orange-100 border-orange-500 text-orange-700';
    case 'yellow':
      return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    default:
      return 'bg-gray-100 border-gray-500 text-gray-700';
  }
}

function getColorBorderText(color: string) {
  switch (color) {
    case 'green':
      return 'border-green-500 text-green-500 shadow-green-500';
    case 'red':
      return 'border-red-500 text-red-500 shadow-red-500';
    case 'orange':
      return 'border-orange-500 text-orange-500 shadow-orange-500';
    case 'yellow':
      return 'border-yellow-500 text-yellow-500 shadow-yellow-500';
    default:
      return 'border-gray-500 text-gray-500 shadow-gray-500';
  }
}

function getTextColor500(color: string) {
  switch (color) {
    case 'green':
      return 'text-green-500';
    case 'red':
      return 'text-red-500';
    case 'orange':
      return 'text-orange-500';
    case 'yellow':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
}

function getTextColor600(color: string) {
  switch (color) {
    case 'green':
      return 'text-green-600';
    case 'red':
      return 'text-red-600';
    case 'orange':
      return 'text-orange-600';
    case 'yellow':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
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

function getSubjectData(result: ExtendedResultResponse): TimelineData[] {
  const { timeline, started_at, subject_results } = result;

  // subject -> timelines -> events

  return subject_results.map(subject => ({
    name: subject.subjectInfo?.subjectName,
    code: subject.subjectInfo?.subjectCode + '-' + subject.subjectInfo?.classCode,
    color: getStatusColorCode(subject.status),
    timelines: timeline
      .filter(sel => sel.subject_id === subject.subject_id)
      .map(sel => ({
        color: getStatusColorCode(sel.status),
        start: (sel.started_at - started_at) / 1000,
        duration: (sel.ended_at - sel.started_at) / 1000,
        isTop: subject_results[0].subject_id === sel.subject_id,
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

export default Timeline;
