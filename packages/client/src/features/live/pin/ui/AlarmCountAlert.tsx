import { Button, Flex } from '@allcll/allcll-ui';

function AlarmCountAlert() {
  return (
    <Flex justify="justify-center" align="items-center">
      <Button variant="ghost" size="medium" disabled={true}>
        알림 과목은 최대 5개까지 등록할 수 있어요.
      </Button>
    </Flex>
  );
}

export default AlarmCountAlert;
