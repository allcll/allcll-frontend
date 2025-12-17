import { useState } from 'react';
import AlarmOptionModal from '@/features/notification/ui/AlarmOptionModal.tsx';
import RealtimeCard from '@/components/live/subjectTable/RealtimeCard.tsx';
import NetworkError from '@/components/live/errors/NetworkError.tsx';
import ZeroPinError from '@/components/live/errors/ZeroPinError.tsx';
import NotificationInstructionsModal from '@/features/notification/ui/NotificationInstructionsModal.tsx';
import useFindWishes from '@/hooks/useFindWishes.ts';
import { SSEType, useSseData } from '@/hooks/useSSEManager.ts';
import useNotification, { AlarmNotification } from '@/features/notification/lib/useNotification.ts';
import AlarmSvg from '@/assets/alarm.svg?react';
import AlarmDisabledIcon from '@/assets/alarm-disabled.svg?react';
import SettingSvg from '@/assets/settings.svg?react';
import ReloadSvg from '@/assets/reload-blue.svg?react';
import AlarmAddButton from './AlarmAddButton.tsx';
import useNotificationInstruction from '@/features/notification/model/useNotificationInstruction.ts';
import { SSE_STATE, useSSEState } from '@/store/useSseState.ts';
import { usePinned } from '@/hooks/server/usePinned.ts';
import { Card, Flex, Heading, IconButton, Tooltip } from '@allcll/allcll-ui';

const PinnedCourses = () => {
  const [isAlarmSettingOpen, setIsAlarmSettingOpen] = useState(false);
  const { isAlarm, changeAlarm } = useNotification();
  const { isError, refetch } = useSseData(SSEType.PINNED);

  return (
    <Card>
      <AlarmOptionModal isOpen={isAlarmSettingOpen} close={() => setIsAlarmSettingOpen(false)} />
      <NotificationInstructionsModal />

      <Flex direction="flex-row" justify="justify-between" align="align-top" className="mb-4">
        <Flex align="items-center" justify="justify-center" gap="gap-2">
          <Heading level={3}>여석 과목 알림</Heading>
          <Tooltip>
            <p className="text-sm">
              여석이 생기면 알림을 보내드려요 <br />
              <span className="text-red-500">* 탭을 닫으면 알림이 울리지 않아요</span>
            </p>
          </Tooltip>
        </Flex>

        <Flex align="items-center" gap="gap-1">
          {isError && (
            <IconButton
              icon={<ReloadSvg className="w-5 h-5" />}
              aria-label="알림 재연결"
              label="알림 재연결"
              onClick={refetch}
            />
          )}
          <IconButton
            icon={<SettingSvg className="w-5 h-5" />}
            aria-label="알림 설정"
            label="알림 설정"
            onClick={() => setIsAlarmSettingOpen(true)}
          />
          <IconButton
            icon={<AlarmIcon isAlarm={isAlarm} />}
            aria-label={isAlarm ? '알림 끄기' : '알림 켜기'}
            label={isAlarm ? '알림 끄기' : '알림 켜기'}
            onClick={changeAlarm}
          />
        </Flex>
      </Flex>

      <CoursesArea />
    </Card>
  );
};

function AlarmIcon({ isAlarm }: Readonly<{ isAlarm: boolean }>) {
  const sseState = useSSEState(state => state.sseState);
  const isPermitted = useNotificationInstruction(state => state.isPermitted);
  const isRealtime = sseState === SSE_STATE.LIVE;
  const statusTooltip = isRealtime
    ? AlarmNotification.getDeniedMessage()
    : [...AlarmNotification.getDeniedMessage(), '실시간 연결이 끊어졌어요'];

  if (!isAlarm) return <AlarmDisabledIcon className="w-5 h-5" />;

  return isPermitted && isRealtime ? (
    <AlarmSvg className="w-5 h-5 text-blue-500" />
  ) : (
    <>
      <AlarmSvg className="w-5 h-5 text-red-500 animate-pulse" />
      {statusTooltip.length > 0 && (
        <span className="absolute left-full -bottom-2 transform -translate-x-full translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm p-2 rounded w-64 h-fit text-center pointer-events-none">
          {statusTooltip.map((line, idx) => (
            <p key={'tooltip-line-' + idx} className="pt-1 first:pt-0">
              {line}
            </p>
          ))}
        </span>
      )}
    </>
  );
}

function CoursesArea() {
  const { data, isPending, isError, refetch } = usePinned();
  const { data: pinnedSeats } = useSseData(SSEType.PINNED);

  const pinnedWishes = useFindWishes(data?.map(pinned => pinned.subjectId) ?? []);

  const getSeats = (subjectId: number) => {
    const pinned = pinnedSeats?.find(pinnedSeat => pinnedSeat.subjectId === subjectId);
    return pinned?.seatCount ?? -1;
  };

  const getQueryTime = (subjectId: number) => {
    const pinned = pinnedSeats?.find(pinnedSeat => pinnedSeat.subjectId === subjectId);
    return pinned?.queryTime ?? '';
  };

  if (isPending) {
    return (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 0, 0].map((_, idx) => (
          <div key={'skeleton-card-' + idx} className="bg-gray-300 shadow-sm rounded-lg p-4 h-24" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <NetworkError onReload={refetch} />;
  }

  if (!pinnedWishes || pinnedWishes.length === 0) {
    return <ZeroPinError />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {pinnedWishes.map(subject => (
        <RealtimeCard
          key={`${subject.subjectId}_${subject.subjectCode}_${subject.professorName}`}
          subject={subject}
          seats={getSeats(subject.subjectId)}
          queryTime={getQueryTime(subject.subjectId)}
        />
      ))}
      {pinnedWishes.length < 5 ? <AlarmAddButton /> : <AlarmCountAlert />}
    </div>
  );
}

function AlarmCountAlert() {
  return (
    <div className="p-2 rounded-full flex items-center justify-center">
      <p className="bg-gray-50 rounded-full px-4 py-2 text-sm border border-gray-200">
        알림 과목은 최대 5개까지 등록할 수 있어요.
      </p>
    </div>
  );
}

export default PinnedCourses;
