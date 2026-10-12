import NoneLayout from '@/shared/ui/NoneLayout';
import { Button, NotificationIcon } from '@allcll/allcll-ui';

function PreSeatWillAvailable() {
  return (
    <NoneLayout
      title="수강 정정 기간이 종료되었습니다"
      description="수강 신청 고생 많으셨습니다. 다음 학기에 만나요."
      icon={NotificationIcon}
    >
      <Button asChild variant="ghost" size="medium">
        <a href="https://open.kakao.com/o/g3MztXfh">공지 채팅방 바로가기</a>
      </Button>
    </NoneLayout>
  );
}

export default PreSeatWillAvailable;
