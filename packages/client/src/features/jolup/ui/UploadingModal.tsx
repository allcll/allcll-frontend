import useUploading from '@/features/jolup/lib/useUploading';
import { Dialog, Flex, SupportingText } from '@allcll/allcll-ui';

import { JolupStepsProps } from '@/features/jolup/model/types.ts';

interface UploadingModalProps extends JolupStepsProps {
  isOpen: boolean;
  onClose: () => void;
}

function UploadingModal({ nextStep, isOpen, onClose }: UploadingModalProps) {
  const { progress, message } = useUploading(nextStep);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="졸업 요건 검사 중">
      <Dialog.Content>
        <Flex direction="flex-col" gap="gap-6" className="py-4">
          <div className="text-center space-y-2">
            <SupportingText className="text-gray-500">
              업로드한 파일을 바탕으로 졸업 요건을 분석하고 있습니다.
              <br />
              잠시만 기다려주세요.
            </SupportingText>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-gray-700">{message}</span>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </Flex>
      </Dialog.Content>
    </Dialog>
  );
}

export default UploadingModal;
