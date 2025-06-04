import AlarmButton from '@/components/AlarmButton';
import NoneLayout from '@/components/dashboard/NoneLayout.tsx';
import AlarmIcon from '@/components/svgs/AlarmIcon.tsx';

function ZeroPinError() {
  return (
    <NoneLayout
      title="핀 고정된 과목이 없습니다"
      description="관심있는 과목을 찾아 핀으로 고정해보세요. 핀으로 고정된 과목은 여석이 생길 시 알림이 울려요."
      icon={<AlarmIcon className="w-7 h-7" disabled />}
    >
      <AlarmButton />
    </NoneLayout>
  );
}

export default ZeroPinError;
