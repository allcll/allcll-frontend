import AlarmIcon from '@/shared/ui/svgs/AlarmIcon';
import AlarmDisabledIcon from '@/assets/alarm-disabled.svg?react';
import { useSSEState } from '@/features/live/board/model/useSseState';
import useNotificationInstruction from '@/features/notification/model/useNotificationInstruction.ts';
import { SSE_STATE } from '@/features/live/board/model/useSseState';
import { AlarmNotification } from '@/features/notification/lib/useNotification.ts';

function AlarmStatusIcon({ isAlarm }: Readonly<{ isAlarm: boolean }>) {
  const sseState = useSSEState(state => state.sseState);
  const isPermitted = useNotificationInstruction(state => state.isPermitted);
  const isRealtime = sseState === SSE_STATE.LIVE;
  const statusTooltip = isRealtime
    ? AlarmNotification.getDeniedMessage()
    : [...AlarmNotification.getDeniedMessage(), '실시간 연결이 끊어졌어요'];

  if (!isAlarm) return <AlarmDisabledIcon className="w-5 h-5" />;

  return isPermitted && isRealtime ? (
    <AlarmIcon className="w-5 h-5 text-primary-500" />
  ) : (
    <>
      <AlarmIcon className="w-5 h-5 text-secondary-500 animate-pulse" />
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

export default AlarmStatusIcon;
