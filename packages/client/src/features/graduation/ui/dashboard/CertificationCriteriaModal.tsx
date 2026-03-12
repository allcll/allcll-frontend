import type { ComponentType } from 'react';
import { Dialog, Flex, Button } from '@allcll/allcll-ui';
import { useBodyScrollLock } from '@/shared/lib/useBodyScrollLock';
import type { CertificationCriteriaData } from '@/entities/graduation/api/graduation';
import { useCertificationCriteria } from '@/entities/graduation/model/useGraduation';
import type { CertificationType } from './CertificationSection';
import { EnglishCriteriaContent, ClassicCriteriaContent, CodingCriteriaContent } from './CertificationCriteriaContent';

const CRITERIA_TYPE_TITLES: Record<CertificationType, string> = {
  english: '영어 인증 기준',
  classic: '고전독서 인증 기준',
  coding: 'SW코딩 인증 기준',
};

const criteriaContentRegistry: Record<CertificationType, ComponentType<{ data: CertificationCriteriaData }>> = {
  english: EnglishCriteriaContent,
  classic: ClassicCriteriaContent,
  coding: CodingCriteriaContent,
};

interface CertificationCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  criteriaType: CertificationType;
}

function CertificationCriteriaModal({ isOpen, onClose, criteriaType }: CertificationCriteriaModalProps) {
  const { data, isPending, isError } = useCertificationCriteria(isOpen);
  useBodyScrollLock(isOpen);

  const title = CRITERIA_TYPE_TITLES[criteriaType];
  const ContentRenderer = criteriaContentRegistry[criteriaType];

  return (
    <Dialog title={title} onClose={onClose} isOpen={isOpen}>
      <Dialog.Content>
        <Flex direction="flex-col" gap="gap-3" className="min-w-64 md:min-w-96 h-80 overflow-y-auto pr-3">
          {isPending && <p className="text-sm text-gray-400 text-center py-8">불러오는 중...</p>}
          {isError && <p className="text-sm text-secondary-500 text-center py-8">기준 정보를 불러올 수 없습니다.</p>}
          {data && <ContentRenderer data={data} />}
        </Flex>
      </Dialog.Content>

      <Dialog.Footer>
        <Button variant="primary" size="small" onClick={onClose}>
          닫기
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default CertificationCriteriaModal;
