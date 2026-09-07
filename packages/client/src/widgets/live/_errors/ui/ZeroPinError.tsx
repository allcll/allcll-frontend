import AlarmAddButton from '@/features/live/pin/ui/AlarmAddButton';
import NoneLayout from '@/shared/ui/NoneLayout';
import AlarmIcon from '@/shared/ui/svgs/AlarmIcon.tsx';

function ZeroPinError() {
  return (
    <NoneLayout
      title="등록된 핀 과목이 없습니다"
      description="관심 있는 실시간 과목을 핀으로 등록해보세요. 여석 변동 시 실시간으로 확인하고 알림을 받으실 수 있습니다."
      icon={<AlarmIcon className="w-7 h-7" disabled />}
    >
      <AlarmAddButton />
    </NoneLayout>
  );
}

export default ZeroPinError;

