import { useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ListSvg from '@/assets/list.svg?react';
import { Card, Flex, Heading, IconButton } from '@allcll/allcll-ui';

import SkeletonRows from '@/shared/ui/SkeletonRows.tsx';
import { getTimeDiffString } from '@/shared/lib/stringFormats.ts';
import { getSeatColor } from '@/shared/config/colors.ts';
import TableColorInfo from '@/shared/ui/TableColorInfo.tsx';
import LiveTableTitleModal from '@/shared/ui/TableTitleSettingModal.tsx';
import { HeadTitle } from '@/shared/model/createColumnStore.ts';

import useSSESeats, { SseSubject } from '@/entities/subjectAggregate/model/useSSESeats.ts';

import useTick from '@/features/live/board/lib/useTick.ts';
import { SSE_STATE, useSSEState } from '@/features/live/board/model/useSseState.ts';
import { SSEType } from '@/features/live/common/api/useSSEManager.ts';

import NetworkError from '../../_errors/ui/NetworkError.tsx';
import ZeroListError from '../../_errors/ui/ZeroListError.tsx';
import PreSeatWillAvailable from '../../_errors/ui/PreSeatWillAvailable.tsx';
import SystemChecking from '../../_errors/ui/SystemChecking';
import { useLiveTableStore } from '../model/useLiveTableColumnStore.ts';
import useServiceSemester from '@/entities/semester/model/useServiceSemester.ts';

interface IRealtimeTable {
  title: string;
  showSelect?: boolean;
}

const RealtimeTable = ({ title = '교양과목' }: Readonly<IRealtimeTable>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setTableTitles = useLiveTableStore(state => state.setTableTitles);
  const tableTitles = useLiveTableStore(state => state.tableTitles);

  return (
    <Card>
      {isModalOpen && (
        <LiveTableTitleModal
          initialItems={tableTitles}
          onChange={setTableTitles}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <Flex justify="justify-between" align="items-center" className="mb-2">
        <Heading level={3}>{title} 실시간</Heading>

        <IconButton
          label="테이블 수정"
          variant="plain"
          aria-label="테이블 수정"
          icon={<ListSvg className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        />
      </Flex>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg text-sm">
          <thead>
            <tr className="bg-gray-50 sticky top-0 z-10 text-nowrap">
              {tableTitles
                .filter(t => t.visible)
                .map(({ title }) => (
                  <th key={title} className="px-4 py-2">
                    {title}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            <SubjectBody tableTitles={tableTitles} />
          </tbody>
        </table>
      </div>

      <TableColorInfo />
    </Card>
  );
};

const MAINTENANCE = false;

function SubjectBody({ tableTitles }: Readonly<{ tableTitles: HeadTitle<SseSubject>[] }>) {
  const { data: tableData, isError, isPending, refetch } = useSSESeats(SSEType.NON_MAJOR);
  const HeadTitles = tableTitles.filter(t => t.visible);
  const { data } = useServiceSemester('live');

  const isFinishLive = data && 'service' in data && data.service && !data.service.withinPeriod ? data.service : null;
  const sseState = useSSEState(state => state.sseState);

  if (MAINTENANCE) {
    return (
      <tr>
        <td colSpan={HeadTitles.length}>
          <SystemChecking />;
        </td>
      </tr>
    );
  }

  if (isError) {
    return (
      <tr>
        <td colSpan={HeadTitles.length}>
          <NetworkError onReload={refetch} />
        </td>
      </tr>
    );
  }

  if (isPending || !tableData) {
    return <SkeletonRows row={5} col={HeadTitles.length} />;
  }

  if (sseState === SSE_STATE.IDLE && isFinishLive) {
    return (
      <tr>
        <td colSpan={HeadTitles.length} className="text-center">
          <PreSeatWillAvailable />
        </td>
      </tr>
    );
  }

  if (!tableData.length) {
    return (
      <tr>
        <td colSpan={HeadTitles.length} className="text-center">
          <ZeroListError />
        </td>
      </tr>
    );
  }

  return (
    <TransitionGroup component={null}>
      {tableData.map(subject => (
        <CSSTransition key={subject.code} timeout={500} classNames="row-change">
          <SubjectRow key={subject.code} subject={subject} HeadTitles={HeadTitles} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}

function SubjectRow({ subject, HeadTitles }: Readonly<{ subject: SseSubject; HeadTitles: HeadTitle<SseSubject>[] }>) {
  const prevSeat = useRef(subject.seat);
  const [seatChanged, setSeatChanged] = useState(false);

  const isDeleted = subject.isDeleted;
  const isEng = subject.curiLangNm === '영어';
  const bgColor = seatChanged ? 'bg-blue-50' : isDeleted ? 'bg-gray-100' : isEng ? 'bg-green-50' : '';

  useEffect(() => {
    if (prevSeat.current !== subject.seat) {
      setSeatChanged(true);
      const timer = setTimeout(() => setSeatChanged(false), 1000);
      prevSeat.current = subject.seat;
      return () => clearTimeout(timer);
    }
  }, [subject.seat]);

  return (
    <tr className={`border-t border-gray-200 text-black transition-colors duration-500 text-nowrap ${bgColor}`}>
      {HeadTitles.map(({ key }) => {
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
                {subject[key as keyof SseSubject]}
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
    <td className="w-18 px-4 py-2 text-center text-xs">
      <span className="text-gray-500">{getTimeDiffString(queryTime)}</span>
    </td>
  );
}

export default RealtimeTable;
