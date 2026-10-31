import { Dialog, Button, Flex, LoadingState } from '@allcll/allcll-ui';
import { EnglishCriteriaContent } from '@allcll/common';
import type { CertificationCriteriaData } from '@/entities/graduation/api/graduation';

interface ICertificationEditModalProps {
  isOpen: boolean;
  currentIsPassed: boolean;
  isPending?: boolean;
  criteriaData?: CertificationCriteriaData;
  isCriteriaLoading?: boolean;
  isCriteriaError?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function CertificationEditModal({
  isOpen,
  currentIsPassed,
  isPending,
  criteriaData,
  isCriteriaLoading,
  isCriteriaError,
  onClose,
  onConfirm,
}: Readonly<ICertificationEditModalProps>) {
  const prompt = currentIsPassed ? '위 기준을 충족하지 못하셨나요?' : '위 기준을 충족하셨나요?';
  const confirmLabel = currentIsPassed ? '네, 충족하지 못했어요' : '네, 충족했어요';

  return (
    <Dialog title="영어 인증 결과 수정" onClose={onClose} isOpen={isOpen}>
      <Dialog.Content>
        <Flex direction="flex-col" gap="gap-4" className="min-w-64 md:min-w-96">
          <Flex direction="flex-col" gap="gap-3" className="max-h-52 overflow-y-auto pr-1">
            {isCriteriaLoading && <LoadingState className="py-8" />}
            {isCriteriaError && (
              <p className="text-sm text-danger-500 text-center py-8">기준 정보를 불러올 수 없습니다.</p>
            )}
            {!isCriteriaLoading && !isCriteriaError && (
              <EnglishCriteriaContent data={criteriaData?.englishCertCriteria ?? null} />
            )}
          </Flex>

          <div className="border-t border-gray-200" />

          <p className="text-sm font-medium text-gray-800">{prompt}</p>
        </Flex>
      </Dialog.Content>

      <Dialog.Footer>
        <Button variant="solid" color="gray" size="medium" onClick={onClose} disabled={isPending}>
          취소
        </Button>
        <Button variant="solid" size="medium" onClick={onConfirm} disabled={isPending}>
          {confirmLabel}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default CertificationEditModal;
