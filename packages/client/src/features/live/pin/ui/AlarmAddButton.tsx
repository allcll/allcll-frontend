import useAlarmModalStore from '@/features/live/pin/model/useAlarmModalStore';
import { AddIcon, Button, Flex } from '@allcll/allcll-ui';

function AlarmAddButton() {
  const setIsSearchOpen = useAlarmModalStore(state => state.setIsSearchOpen);

  return (
    <Flex justify="center" align="center">
      <Button variant="pill" color="gray" size="medium" onClick={() => setIsSearchOpen(true)}>
        <AddIcon />
        알림 과목 등록
      </Button>
    </Flex>
  );
}

export default AlarmAddButton;
