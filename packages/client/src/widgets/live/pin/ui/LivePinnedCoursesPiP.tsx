import { Badge, Button, Flex, Heading } from '@allcll/allcll-ui';
import PinCoursesBody from './PinCoursesBody';

interface ILivePinnedCoursesPiPProps {
  onClose: () => void;
}

export function LivePinnedCoursesPiP({ onClose }: ILivePinnedCoursesPiPProps) {
  return (
    <Flex direction="flex-col" gap="gap-3" className="p-3 bg-white min-h-full">
      <Flex direction="flex-row" justify="justify-between" align="items-center" className="pb-2 border-b border-gray-200">
        <Flex align="items-center" gap="gap-2">
          <Badge variant="success">LIVE</Badge>
          <Heading level={4} className="text-base font-bold text-gray-900">
            실시간 과목 여석 모니터링
          </Heading>
        </Flex>
        <Button variant="secondary" size="small" onClick={onClose} aria-label="PiP 닫기">
          닫기
        </Button>
      </Flex>

      <div className="flex-1 overflow-y-auto">
        <PinCoursesBody />
      </div>
    </Flex>
  );
}

export default LivePinnedCoursesPiP;

