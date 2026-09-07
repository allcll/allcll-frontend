import { useState } from 'react';
import { Banner, Button, Card, Chip, Flex, Heading, IconButton, Tooltip } from '@allcll/allcll-ui';
import SettingSvg from '@/assets/settings.svg?react';
import ReloadSvg from '@/assets/reload-blue.svg?react';

import AlarmOptionModal from '@/features/notification/ui/AlarmOptionModal.tsx';
import NotificationInstructionsModal from '@/features/notification/ui/NotificationInstructionsModal.tsx';
import { SSEType, useSseData } from '@/features/live/common/api/useSSEManager.ts';
import useNotification from '@/features/notification/lib/useNotification.ts';
import AlarmStatusIcon from '@/features/live/pin/ui/AlarmStatusIcon.tsx';
import useDocumentPiP from '@/shared/lib/useDocumentPiP';

import PinCoursesBody from './PinCoursesBody.tsx';
import LivePinnedCoursesPiP from './LivePinnedCoursesPiP.tsx';
import RealtimeTable from '../../board/ui/RealtimeTable.tsx';

const LivePinnedCourses = () => {
  const [isAlarmSettingOpen, setIsAlarmSettingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pinned' | 'live'>('pinned');
  const { isPiPOpen, openPiP, closePiP, renderPiPPortal } = useDocumentPiP({ width: 420, height: 500 });

  return (
    <Card variant="elevated">
      <AlarmOptionModal isOpen={isAlarmSettingOpen} close={() => setIsAlarmSettingOpen(false)} />
      <NotificationInstructionsModal />

      <PinCoursesHeader
        setIsAlarmSettingOpen={setIsAlarmSettingOpen}
        isPiPOpen={isPiPOpen}
        onTogglePiP={isPiPOpen ? closePiP : openPiP}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {isPiPOpen ? (
        <Flex direction="flex-col" align="items-center" gap="gap-3" className="py-4 px-2 my-2">
          <Banner variant="info" deleteBanner={closePiP}>
            실시간 과목 모니터링이 Picture-in-Picture (PiP) 모드에서 진행 중입니다.
          </Banner>
          <Button variant="outlined" size="small" onClick={closePiP}>
            메인 화면으로 돌아오기
          </Button>
        </Flex>
      ) : activeTab === 'pinned' ? (
        <PinCoursesBody />
      ) : (
        <RealtimeTable title="실시간 과목" />
      )}

      {renderPiPPortal(<LivePinnedCoursesPiP onClose={closePiP} />)}
    </Card>
  );
};

interface IPinCoursesHeaderProps {
  setIsAlarmSettingOpen: (open: boolean) => void;
  isPiPOpen: boolean;
  onTogglePiP: () => void;
  activeTab: 'pinned' | 'live';
  setActiveTab: (tab: 'pinned' | 'live') => void;
}

function PinCoursesHeader({
  setIsAlarmSettingOpen,
  isPiPOpen,
  onTogglePiP,
  activeTab,
  setActiveTab,
}: IPinCoursesHeaderProps) {
  const { isAlarm, changeAlarm } = useNotification();
  const { isError, refetch } = useSseData(SSEType.PINNED);

  return (
    <Flex direction="flex-col" gap="gap-3" className="mb-4">
      <Flex direction="flex-row" justify="justify-between" align="align-top">
        <Flex align="items-center" justify="justify-center" gap="gap-2">
          <Heading level={3}>실시간 수강 여석 모니터링</Heading>
          <Tooltip>
            <p className="text-sm">
              등록한 과목의 실시간 여석을 확인하고 알림을 받아보세요. <br />
              <span className="text-red-500">* 탭을 닫으면 알림이 울리지 않습니다.</span>
            </p>
          </Tooltip>
        </Flex>

        <Flex align="items-center" gap="gap-2">
          <Button
            variant={isPiPOpen ? 'primary' : 'ghost'}
            size="small"
            onClick={onTogglePiP}
            title="Picture-in-Picture 화면 고정"
          >
            {isPiPOpen ? '🟢 PiP 활성화 중' : '📺 화면 고정 (PiP)'}
          </Button>

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
            label={isAlarm ? '알림 켜기' : '알림 끄기'}
            onClick={changeAlarm}
          />
        </Flex>
      </Flex>

      <Flex direction="flex-row" gap="gap-2">
        <Chip
          label="📌 핀 과목 (알림)"
          selected={activeTab === 'pinned'}
          onClick={() => setActiveTab('pinned')}
        />
        <Chip
          label="📚 실시간 전체 과목"
          selected={activeTab === 'live'}
          onClick={() => setActiveTab('live')}
        />
      </Flex>
    </Flex>
  );
}

export default LivePinnedCourses;


