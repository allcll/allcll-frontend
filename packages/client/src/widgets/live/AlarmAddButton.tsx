import useAlarmModalStore from '@/store/useAlarmModalStore.ts';
import { Button, Flex } from '../../../../allcll-ui';

function AlarmAddButton() {
  const setIsSearchOpen = useAlarmModalStore(state => state.setIsSearchOpen);

  return (
    <Flex justify="justify-center" align="items-center">
      <Button variant="ghost" size="medium" onClick={() => setIsSearchOpen(true)}>
        + 알림 과목 등록
      </Button>
    </Flex>
  );
}

export default AlarmAddButton;
