import useAlarmModalStore from '@/features/live/pin/model/useAlarmModalStore';
import { Button, Flex } from '@allcll/allcll-ui';

function AlarmAddButton() {
  const setIsSearchOpen = useAlarmModalStore(state => state.setIsSearchOpen);

  return (
    <Flex justify="justify-center" align="items-center">
      <Button variant="outlined" size="medium" onClick={() => setIsSearchOpen(true)}>
        + 실시간 과목 핀/알림 추가
      </Button>
    </Flex>
  );
}

export default AlarmAddButton;

