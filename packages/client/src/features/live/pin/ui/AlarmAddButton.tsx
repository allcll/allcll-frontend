import useAlarmModalStore from '@/features/live/pin/model/useAlarmModalStore';
import { AddIcon, Button, Flex } from '@allcll/allcll-ui';

function AlarmAddButton() {
  const setIsSearchOpen = useAlarmModalStore(state => state.setIsSearchOpen);

  return (
    <Flex justify="justify-center" align="items-center">
      <Button variant="ghost" size="medium" onClick={() => setIsSearchOpen(true)}>
        <AddIcon className="w-4 h-4" />
        알림 과목 등록
      </Button>
    </Flex>
  );
}

export default AlarmAddButton;
