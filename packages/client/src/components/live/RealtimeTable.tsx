import { useEffect, useRef, useState } from 'react';
import useWishes from '@/hooks/server/useWishes.ts';
import { SSEType, useSseData } from '@/hooks/useSSEManager.ts';
import useTick from '@/hooks/useTick.ts';
import CardWrap from '@/components/CardWrap.tsx';
import SkeletonRows from '@/components/live/skeletons/SkeletonRows.tsx';
import NetworkError from '@/components/live/errors/NetworkError.tsx';
import ZeroListError from '@/components/live/errors/ZeroListError.tsx';
import useSSECondition from '@/store/useSSECondition.ts';
import { getTimeDiffString } from '@/utils/stringFormats.ts';
import { getSeatColor } from '@/utils/colors.ts';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Tooltip from '@/components/common/Tooltip.tsx';

interface IRealtimeTable {
  title: string;
  showSelect?: boolean;
}

const TableHeadTitles = [
  { title: '과목코드', key: 'code' },
  { title: '과목명', key: 'name' },
  { title: '담당교수', key: 'professor' },
  { title: '여석', key: 'seat' },
  { title: '최근갱신', key: 'queryTime' },
];

interface ITableData {
  code?: string;
  name?: string;
  professor?: string | null;
  seat?: number;
  queryTime?: string;
}

const RealtimeTable = ({ title = '교양과목' }: Readonly<IRealtimeTable>) => {
  return (
    <CardWrap>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="font-bold text-lg p-2">{title} 실시간</h2>
          <Tooltip>
            <p className="text-sm">
              <b className="text-green-500">전체 과목 실시간 여석</b>을 <br />
              제공하고 있어요
            </p>
          </Tooltip>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg text-sm">
          <thead>
            <tr className="bg-gray-50 sticky top-0 z-10 text-nowrap">
              {TableHeadTitles.map(({ title }) => (
                <th key={title} className="px-4 py-2">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SubjectBody />
          </tbody>
        </table>
      </div>
    </CardWrap>
  );
};

function SubjectBody() {
  // major list API fetch
  // subject list SSE API fetch
  const { data: subjectIds } = useSseData(SSEType.NON_MAJOR);
  const { data: subjectData } = useWishes();

  const isPendingSSE = useSSECondition(state => state.isPending);
  const isError = useSSECondition(state => state.isError);
  const setForceReload = useSSECondition(state => state.setForceReload);

  const tableData: ITableData[] =
    subjectIds?.map(subject => {
      const { subjectId, seatCount, queryTime } = subject;
      const { subjectName, subjectCode, classCode, professorName } =
        subjectData?.find(subject => subject.subjectId === subjectId) || {};
      return {
        code: `${subjectCode}-${classCode}`,
        name: subjectName,
        professor: professorName,
        seat: seatCount,
        queryTime,
      };
    }) ?? [];

  if (isError) {
    return (
      <tr>
        <td colSpan={TableHeadTitles.length}>
          <NetworkError onReload={setForceReload} />
        </td>
      </tr>
    );
  }

  if (isPendingSSE) {
    return <SkeletonRows row={5} col={TableHeadTitles.length} />;
  }

  if (!tableData.length) {
    return (
      <tr>
        <td colSpan={TableHeadTitles.length} className="text-center">
          <ZeroListError />
        </td>
      </tr>
    );
  }

  return (
    <TransitionGroup component={null}>
      {tableData.map(subject => (
        <CSSTransition key={subject.code} timeout={500} classNames="row-change">
          <SubjectRow key={subject.code} subject={subject} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}

function SubjectRow({ subject }: Readonly<{ subject: ITableData }>) {
  const prevSeat = useRef(subject.seat);
  const [seatChanged, setSeatChanged] = useState(false);

  useEffect(() => {
    if (prevSeat.current !== subject.seat) {
      setSeatChanged(true);
      const timer = setTimeout(() => setSeatChanged(false), 1000);
      prevSeat.current = subject.seat;
      return () => clearTimeout(timer);
    }
  }, [subject.seat]);

  return (
    <tr
      className={`border-t border-gray-200 text-black transition-colors duration-500 ${
        seatChanged ? 'bg-blue-50' : ''
      }`}
    >
      {TableHeadTitles.map(({ key }) => {
        switch (key) {
          case 'seat':
            return (
              <td key={key} className="px-4 py-2 text-center">
                <span className={'px-3 py-1 rounded-full text-xs font-bold ' + getSeatColor(subject.seat ?? -1)}>
                  {subject[key]}
                </span>
              </td>
            );
          case 'queryTime':
            return <QueryTimeTd key={key} queryTime={subject.queryTime} />;
          default:
            return (
              <td key={key} className="px-4 py-2 text-center">
                {subject[key as keyof ITableData]}
              </td>
            );
        }
      })}
    </tr>
  );
}

function QueryTimeTd({ queryTime }: Readonly<{ queryTime?: string }>) {
  useTick();

  return (
    <td className="px-4 py-2 text-center text-xs">
      <span className="px-3 py-1 rounded-full text-gray-500">{getTimeDiffString(queryTime)}</span>
    </td>
  );
}

export default RealtimeTable;
