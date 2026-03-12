import { Dialog, Button } from '@allcll/allcll-ui';
import { useBodyScrollLock } from '@/shared/lib/useBodyScrollLock';
import { useCertificationCriteria } from '@/entities/graduation/model/useGraduation';
import { EnglishCriteriaContent } from './CertificationCriteriaContent';

interface CertificationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function CertificationEditModal({ isOpen, onClose, onConfirm }: CertificationEditModalProps) {
  const { data, isPending, isError } = useCertificationCriteria(isOpen);
  useBodyScrollLock(isOpen);

  return (
    <Dialog title="영어 인증 결과 수정" onClose={onClose} isOpen={isOpen}>
      <Dialog.Content>
        <div className="min-w-64 md:min-w-96 flex flex-col gap-4">
          <div className="max-h-52 overflow-y-auto pr-1 flex flex-col gap-3">
            {isPending && <p className="text-sm text-gray-400 text-center py-8">불러오는 중...</p>}
            {isError && <p className="text-sm text-secondary-500 text-center py-8">기준 정보를 불러올 수 없습니다.</p>}
            {data && <EnglishCriteriaContent data={data} />}
          </div>

          <div className="border-t border-gray-200" />

          <p className="text-sm font-medium text-gray-800">위 기준을 충족하셨나요?</p>
        </div>
      </Dialog.Content>

      <Dialog.Footer>
        <Button variant="outlined" size="small" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" size="small" onClick={onConfirm}>
          네, 충족했어요
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default CertificationEditModal;
