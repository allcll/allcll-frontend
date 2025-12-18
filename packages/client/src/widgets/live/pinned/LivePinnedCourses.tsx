import { useState } from 'react';
import AlarmOptionModal from '@/features/notification/ui/AlarmOptionModal.tsx';
import NotificationInstructionsModal from '@/features/notification/ui/NotificationInstructionsModal.tsx';
import { SSEType, useSseData } from '@/hooks/useSSEManager.ts';
import useNotification from '@/features/notification/lib/useNotification.ts';
import SettingSvg from '@/assets/settings.svg?react';
import ReloadSvg from '@/assets/reload-blue.svg?react';
import { Card, Flex, Heading, IconButton, Tooltip } from '@allcll/allcll-ui';
import CoursesArea from './CoursesArea.tsx';
import AlarmStatusIcon from './AlarmStatusIcon.tsx';

/**
 * widget
 * @returns
 */
const LivePinnedCourses = () => {
  const [isAlarmSettingOpen, setIsAlarmSettingOpen] = useState(false);
  const { isAlarm, changeAlarm } = useNotification();
  const { isError, refetch } = useSseData(SSEType.PINNED);

  return (
    <Card>
      <AlarmOptionModal isOpen={isAlarmSettingOpen} close={() => setIsAlarmSettingOpen(false)} />
      <NotificationInstructionsModal />

      <Flex direction="flex-row" justify="justify-between" align="align-top" className="mb-4">
        <Flex align="items-center" justify="justify-center" gap="gap-2">
          <Heading level={3}>여석 과목 알림</Heading>
          <Tooltip>
            <p className="text-sm">
              여석이 생기면 알림을 보내드려요 <br />
              <span className="text-red-500">* 탭을 닫으면 알림이 울리지 않아요</span>
            </p>
          </Tooltip>
        </Flex>

        <Flex align="items-center" gap="gap-1">
          {isError && (
            <IconButton
              icon={<ReloadSvg className="w-5 h-5" />}
              aria-label="알림 재연결"
              label="알림 재연결"
              onClick={refetch}
            />
          )}
          <IconButton
            icon={<SettingSvg className="w-5 h-5" />}
            aria-label="알림 설정"
            label="알림 설정"
            onClick={() => setIsAlarmSettingOpen(true)}
          />
          <IconButton
            icon={<AlarmStatusIcon isAlarm={isAlarm} />}
            aria-label={isAlarm ? '알림 끄기' : '알림 켜기'}
            label={isAlarm ? '알림 끄기' : '알림 켜기'}
            onClick={changeAlarm}
          />
        </Flex>
      </Flex>

      <CoursesArea />
    </Card>
  );
};

export default LivePinnedCourses;
