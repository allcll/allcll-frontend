import AlarmAddButton from '@/widgets/live/pinned/AlarmAddButton';
import NoneLayout from '@/widgets/live/errors/NoneLayout';
import AlarmIcon from '@/shared/ui/svgs/AlarmIcon.tsx';

function ZeroPinError() {
  return (
    <NoneLayout
      title="등록된 알림 과목이 없습니다"
      description="관심있는 과목을 알림 과목으로 등록해보세요. 여석이 생길 시 알림을 보내드려요."
      icon={<AlarmIcon className="w-7 h-7" disabled />}
    >
      <AlarmAddButton />
    </NoneLayout>
  );
}

export default ZeroPinError;
