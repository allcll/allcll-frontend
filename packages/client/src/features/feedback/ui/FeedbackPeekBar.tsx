import { Button, Flex, SupportingText } from '@allcll/allcll-ui';

type Props = {
  message: string;
  onOpen: () => void;
  onClose: () => void;
};

export default function FeedbackPeekBar({ message, onOpen, onClose }: Props) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-overlay">
      <div className="rounded-xl bg-white shadow-md border border-gray-100 px-3 py-2">
        <Flex justify="justify-between" align="items-center" className="gap-2">
          <SupportingText className="text-sm">{message}</SupportingText>
          <Flex align="items-center" className="gap-1">
            <Button variant="text" size="small" textColor="gray" onClick={onClose}>
              닫기
            </Button>
            <Button variant="primary" size="small" onClick={onOpen}>
              제보하기
            </Button>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}
