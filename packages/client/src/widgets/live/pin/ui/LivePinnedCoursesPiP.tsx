import { useState } from 'react';
import { Badge, Button, Chip, Flex, Heading } from '@allcll/allcll-ui';
import PinCoursesBody from './PinCoursesBody';
import RealtimeTable from '../../board/ui/RealtimeTable';

interface ILivePinnedCoursesPiPProps {
  onClose: () => void;
}

export function LivePinnedCoursesPiP({ onClose }: ILivePinnedCoursesPiPProps) {
  const [activeTab, setActiveTab] = useState<'pinned' | 'live'>('pinned');

  return (
    <Flex direction="flex-col" gap="gap-3" className="p-3 bg-white min-h-full">
      <Flex direction="flex-row" justify="justify-between" align="items-center" className="pb-2 border-b border-gray-200">
        <Flex align="items-center" gap="gap-2">
          <Badge variant="success">LIVE</Badge>
          <Heading level={4} className="text-base font-bold text-gray-900">
            실시간 여석 모니터링
          </Heading>
        </Flex>
        <Button variant="secondary" size="small" onClick={onClose} aria-label="PiP 닫기">
          닫기
        </Button>
      </Flex>

      <Flex direction="flex-row" gap="gap-2">
        <Chip
          label="📌 핀 과목 (알림)"
          selected={activeTab === 'pinned'}
          onClick={() => setActiveTab('pinned')}
        />
        <Chip
          label="📚 실시간 과목"
          selected={activeTab === 'live'}
          onClick={() => setActiveTab('live')}
        />
      </Flex>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'pinned' ? <PinCoursesBody /> : <RealtimeTable title="실시간 과목" />}
      </div>
    </Flex>
  );
}

export default LivePinnedCoursesPiP;


