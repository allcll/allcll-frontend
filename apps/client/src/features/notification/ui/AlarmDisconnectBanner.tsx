import { Banner } from '@allcll/allcll-ui';
import useSSECondition from '@/features/live/board/model/useSSECondition.ts';

function AlarmDisconnectBanner() {
  const isAlarm = useSSECondition(state => state.alwaysReload);
  const isError = useSSECondition(state => state.isError);
  const reconnect = useSSECondition(state => state.setForceReload);

  if (!isAlarm || !isError) return null;

  return (
    <Banner variant="danger">
      실시간 여석 연결이 끊겨 알림을 받을 수 없어요. &nbsp;
      <button type="button" onClick={reconnect} className="text-danger-500 underline hover:text-danger-600">
        다시 연결
      </button>
    </Banner>
  );
}

export default AlarmDisconnectBanner;
