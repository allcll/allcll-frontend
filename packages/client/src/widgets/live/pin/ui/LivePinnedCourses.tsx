import { useState } from 'react';
import { Card, Flex, Heading, IconButton, Tooltip } from '@allcll/allcll-ui';
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

const LivePinnedCourses = () => {
  const [isAlarmSettingOpen, setIsAlarmSettingOpen] = useState(false);
  const { isPiPOpen, openPiP, closePiP, renderPiPPortal } = useDocumentPiP({ width: 380, height: 440 });

  return (
    <Card>
      <AlarmOptionModal isOpen={isAlarmSettingOpen} close={() => setIsAlarmSettingOpen(false)} />
      <NotificationInstructionsModal />

      <PinCoursesHeader
        setIsAlarmSettingOpen={setIsAlarmSettingOpen}
        isPiPOpen={isPiPOpen}
        onTogglePiP={isPiPOpen ? closePiP : openPiP}
      />

      {isPiPOpen ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center my-2">
          <p className="text-sm font-medium text-blue-900 mb-2">
            📺 실시간 여석 모니터링이 Picture-in-Picture (PiP) Floating Window에서 실행 중입니다.
          </p>
          <button
            onClick={closePiP}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            PiP 창 닫기 / 메인 화면으로 돌아오기
          </button>
        </div>
      ) : (
        <PinCoursesBody />
      )}

      {renderPiPPortal(<LivePinnedCoursesPiP onClose={closePiP} />)}
    </Card>
  );
};

function PinCoursesHeader({
  setIsAlarmSettingOpen,
  isPiPOpen,
  onTogglePiP,
}: {
  setIsAlarmSettingOpen: (open: boolean) => void;
  isPiPOpen: boolean;
  onTogglePiP: () => void;
}) {
  const { isAlarm, changeAlarm } = useNotification();
  const { isError, refetch } = useSseData(SSEType.PINNED);

  return (
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

      <Flex align="items-center" gap="gap-2">
        <button
          onClick={onTogglePiP}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
            isPiPOpen
              ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
              : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
          }`}
          title="Picture-in-Picture 화면 고정"
        >
          <span>{isPiPOpen ? '🟢 PiP 띄움 중' : '📺 화면 고정 (PiP)'}</span>
        </button>

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
  );
}

export default LivePinnedCourses;
