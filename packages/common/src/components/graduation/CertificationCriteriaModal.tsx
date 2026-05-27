import { useEffect, type ComponentType } from 'react';
import { Dialog, Flex, Button } from '@allcll/allcll-ui';
import type { CertificationType, GraduationCertificationCriteria } from '../../types/graduation';
import ClassicCriteriaContent from './ClassicCriteriaContent';
import CodingCriteriaContent from './CodingCriteriaContent';
import EnglishCriteriaContent from './EnglishCriteriaContent';

const CRITERIA_TYPE_TITLES: Record<CertificationType, string> = {
  english: '영어 인증 기준',
  classic: '고전독서 인증 기준',
  coding: 'SW코딩 인증 기준',
};

type ContentRenderer = ComponentType<{ data: GraduationCertificationCriteria }>;

function EnglishRenderer({ data }: Readonly<{ data: GraduationCertificationCriteria }>) {
  return <EnglishCriteriaContent data={data.englishCertCriteria} />;
}
function ClassicRenderer({ data }: Readonly<{ data: GraduationCertificationCriteria }>) {
  return <ClassicCriteriaContent data={data.classicCertCriteria} />;
}
function CodingRenderer({ data }: Readonly<{ data: GraduationCertificationCriteria }>) {
  return <CodingCriteriaContent data={data.codingCertCriteria} />;
}

const criteriaContentRegistry: Record<CertificationType, ContentRenderer> = {
  english: EnglishRenderer,
  classic: ClassicRenderer,
  coding: CodingRenderer,
};

interface CertificationCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  criteriaType: CertificationType;
  criteriaData: GraduationCertificationCriteria;
}

function CertificationCriteriaModal({
  isOpen,
  onClose,
  criteriaType,
  criteriaData,
}: Readonly<CertificationCriteriaModalProps>) {
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const title = CRITERIA_TYPE_TITLES[criteriaType];
  const ContentComponent = criteriaContentRegistry[criteriaType];

  return (
    <Dialog title={title} onClose={onClose} isOpen={isOpen}>
      <Dialog.Content>
        <Flex direction="flex-col" gap="gap-3" className="min-w-64 md:min-w-96 h-80 overflow-y-auto pr-3">
          <ContentComponent data={criteriaData} />
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
