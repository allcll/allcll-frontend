import AlarmAddButton from '@/features/live/pin/ui/AlarmAddButton';
import NoneLayout from '@/shared/ui/NoneLayout';
import { NotificationFilledIcon } from '@allcll/allcll-ui';

function ZeroPinError() {
  return (
    <NoneLayout
      title="등록된 알림 과목이 없습니다"
      description="관심있는 과목을 알림 과목으로 등록해보세요. 여석이 생길 시 알림을 보내드려요."
      icon={<NotificationFilledIcon className="w-7 h-7 text-gray-400" />}
    >
      <AlarmAddButton />
    </NoneLayout>
  );
}

export default ZeroPinError;
