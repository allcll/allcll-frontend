import { Flex, SupportingText } from '@allcll/allcll-ui';

function AlarmCountAlert() {
  return (
    <Flex justify="center" align="center">
      <SupportingText className="py-2">알림 과목은 최대 5개까지 등록할 수 있어요.</SupportingText>
    </Flex>
  );
}

export default AlarmCountAlert;
