import { Flex, Heading } from '@allcll/allcll-ui';
import PinCoursesBody from './PinCoursesBody';

interface LivePinnedCoursesPiPProps {
  onClose: () => void;
}

export function LivePinnedCoursesPiP({ onClose }: LivePinnedCoursesPiPProps) {
  return (
    <div className="flex flex-col gap-3 min-h-full">
      <Flex direction="flex-row" justify="justify-between" align="items-center" className="pb-2 border-b border-gray-200">
        <Flex align="items-center" gap="gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <Heading level={4} className="text-base font-bold text-gray-900">
            실시간 여석 모니터링
          </Heading>
        </Flex>
        <button
          onClick={onClose}
          className="px-2 py-1 text-xs text-gray-600 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          aria-label="PiP 닫기"
        >
          닫기
        </button>
      </Flex>

      <div className="flex-1 overflow-y-auto">
        <PinCoursesBody />
      </div>
    </div>
  );
}

export default LivePinnedCoursesPiP;
