import { Button, Flex, SupportingText } from '@allcll/allcll-ui';

interface IFeedbackPeekBarProps {
  message: string;
  onOpen: () => void;
  onClose: () => void;
}

export default function FeedbackPeekBar({ message, onOpen, onClose }: IFeedbackPeekBarProps) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-floating">
      <div className="rounded-xl bg-white shadow-md border border-gray-100 px-3 py-2">
        <Flex justify="between" align="center">
          <SupportingText className="text-sm">{message}</SupportingText>
          <Flex align="center">
            <Button variant="text" size="small" color="gray" onClick={onClose}>
              닫기
            </Button>
            <Button variant="solid" size="small" onClick={onOpen}>
              제보하기
            </Button>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}
