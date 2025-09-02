import { useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CardWrap from '@/components/CardWrap.tsx';
import SkeletonRows from '@/components/live/skeletons/SkeletonRows.tsx';
import NetworkError from '@/components/live/errors/NetworkError.tsx';
import ZeroListError from '@/components/live/errors/ZeroListError.tsx';
import PreSeatWillAvailable from '@/components/live/errors/PreSeatWillAvailable.tsx';
import useTick from '@/hooks/useTick.ts';
import { SSEType } from '@/hooks/useSSEManager.ts';
import useSSESeats, { SseSubject } from '@/hooks/server/useSSESeats.ts';
import { getTimeDiffString } from '@/utils/stringFormats.ts';
import { getSeatColor } from '@/utils/colors.ts';
import TableColorInfo from '@/components/wishTable/TableColorInfo.tsx';
import Modal from '@/components/simulation/modal/Modal.tsx';
import DraggableList from '@/components/live/subjectTable/DraggableList.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import ListSvg from '@/assets/list.svg?react';
import useBackSignal from '@/hooks/useBackSignal.ts';
import SystemChecking from './errors/SystemChecking';
import { getDateLocale } from '@/utils/time.ts';
import { SSE_STATE, useSSEState } from '@/store/useSseState.ts';
import { HeadTitle, useLiveTableStore } from '@/store/useTableColumnStore.ts';

interface IRealtimeTable {
  title: string;
  showSelect?: boolean;
}

const RealtimeTable = ({ title = '교양과목' }: Readonly<IRealtimeTable>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setTableTitles = useLiveTableStore(state => state.setTableTitles);
  const tableTitles = useLiveTableStore(state => state.tableTitles);

  return (
    <CardWrap>
      {isModalOpen && (
        <LiveTableTitleModal
          initialItems={tableTitles}
          onChange={setTableTitles}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-bold text-lg">{title} 실시간</h2>
          {/*<Tooltip>*/}
          {/*  <p className="text-sm">*/}
          {/*    <b className="text-green-500">전체 과목 실시간 여석</b>을 <br />*/}
          {/*    제공하고 있어요*/}
          {/*  </p>*/}
          {/*</Tooltip>*/}
        </div>
        <button
          className="p-3 rounded-full hover:bg-blue-100"
          aria-label="테이블 수정"
          onClick={() => setIsModalOpen(true)}
        >
          <ListSvg className="w-4 h-4 text-gray-600 hover:text-blue-500 transition-colors" />
        </button>
      </div>
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
    </CardWrap>
  );
};

const MAINTENANCE = false;

function SubjectBody({ tableTitles }: Readonly<{ tableTitles: HeadTitle<SseSubject>[] }>) {
  const { data: tableData, isError, isPending, refetch } = useSSESeats(SSEType.NON_MAJOR);
  const HeadTitles = tableTitles.filter(t => t.visible);

  // Todo: 추후 변수처리 할 것
  const isFinishLive = new Date() > getDateLocale('2025-09-05T17:00:00');
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

interface ITableTitleModal {
  initialItems: HeadTitle<SseSubject>[];
  onChange: (items: HeadTitle<SseSubject>[]) => void;
  onClose: () => void;
}

function LiveTableTitleModal({ initialItems, onChange, onClose }: ITableTitleModal) {
  useBackSignal({
    enabled: true,
    onClose: onClose,
  });

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="테이블 설정" onClose={onClose} />
      <div className="p-4">
        <DraggableList initialItems={initialItems} onChange={onChange} />
      </div>
    </Modal>
  );
}

export default RealtimeTable;
