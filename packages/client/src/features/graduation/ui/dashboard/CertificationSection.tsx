import { useState } from 'react';
import { Card, Flex, Grid, Badge, Button, Heading, SupportingText } from '@allcll/allcll-ui';
import type { Certifications, ClassicDomain } from '@/entities/graduation/api/graduation';
import { CLASSIC_DOMAIN_LABELS } from '../../lib/mappers';
import CertificationCriteriaModal from './CertificationCriteriaModal';
import CertificationEditModal from './CertificationEditModal';

export type CertificationType = 'english' | 'classic' | 'coding';

interface CertificationSectionProps {
  certifications: Certifications;
}

interface CertificationCardProps {
  title: string;
  passed: boolean;
  customStatus?: string;
  children?: React.ReactNode;
  onViewStandards?: (type: CertificationType) => void;
  certificationType: CertificationType;
  overallSatisfied?: boolean;
}

function CertificationCard({
  title,
  passed,
  customStatus,
  children,
  onViewStandards,
  certificationType,
  overallSatisfied,
}: CertificationCardProps) {
  const statusText = passed ? '인증' : (customStatus ?? '미인증');
  const badgeVariant = passed ? 'success' : overallSatisfied ? 'default' : 'danger';

  return (
    <Card variant="outlined" className="h-full relative">
      {/* 인증 상태 배지 */}
      <div className="absolute top-3 right-3">
        <Badge variant={badgeVariant}>{statusText}</Badge>
      </div>

      <Flex direction="flex-col" gap="gap-4" className="h-full">
        <div className="text-center">
          <span className="text-lg font-bold">{title}</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">{children}</div>

        <div className="w-full [&>button]:w-full">
          <Button variant="outlined" size="small" onClick={() => onViewStandards?.(certificationType)}>
            기준 확인
          </Button>
        </div>
      </Flex>
    </Card>
  );
}

interface ClassicReadingTableProps {
  domains: ClassicDomain[];
}

function ClassicReadingTable({ domains }: ClassicReadingTableProps) {
  return (
    <div className="text-sm w-full">
      <table className="w-full">
        <tbody>
          {domains.map(domain => (
            <tr key={domain.domainType}>
              <td className="py-1 text-gray-600">{CLASSIC_DOMAIN_LABELS[domain.domainType]}</td>
              <td className="py-1 text-right">
                <span className={domain.satisfied ? 'text-primary-500' : 'text-gray-900'}>
                  {domain.myCount}/{domain.requiredCount}권
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface CertNotPassedContentProps {
  onEdit: () => void;
}

function CertNotPassedContent({ onEdit }: CertNotPassedContentProps) {
  return (
    <Flex direction="flex-col" align="items-center" gap="gap-1">
      <span className="text-gray-500 text-sm">이수 내역 없음</span>
      <Button
        variant="text"
        textColor="gray"
        size="small"
        onClick={onEdit}
        className="underline underline-offset-2 !text-xs"
      >
        결과가 잘못되었나요?
      </Button>
    </Flex>
  );
}

function CertificationSection({ certifications }: CertificationSectionProps) {
  const { english, coding, classic, passedCount, requiredPassCount } = certifications;
  const [activeCriteriaType, setActiveCriteriaType] = useState<CertificationType | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleViewStandards = (type: CertificationType) => {
    setActiveCriteriaType(type);
  };

  const handleConfirmEdit = () => {
    // TODO: API 연동
    setShowEditModal(false);
  };

  const CERT_NAMES: Record<CertificationType, string> = {
    english: '영어 인증',
    coding: '소프트웨어 코딩 인증',
    classic: '고전 독서 인증',
  };
  const requiredNames = (Object.keys(CERT_NAMES) as CertificationType[])
    .filter(key => certifications[key].isRequired)
    .map(key => CERT_NAMES[key]);

  const policyDescription =
    requiredPassCount >= requiredNames.length
      ? `${requiredNames.join('과 ')}을 모두 이수해야 졸업 인증이 완료됩니다.`
      : `${requiredNames.join(', ')} 중 ${requiredPassCount}가지 이상을 이수하면 졸업 인증이 완료됩니다.`;

  const classicTotal = {
    requiredCount: classic.totalRequiredCount,
    myCount: classic.totalMyCount,
  };

  return (
    <section>
      <Flex align="items-center" gap="gap-3">
        <Heading level={2}>졸업인증</Heading>
        <Badge variant={certifications.isSatisfied ? 'success' : 'danger'}>
          {passedCount}/{requiredPassCount}
        </Badge>
      </Flex>

      <SupportingText className="mb-6">{policyDescription}</SupportingText>

      <Grid columns={{ base: 1, md: 3 }} gap="gap-4">
        {/* 영어인증 */}
        {english.isRequired && (
          <CertificationCard
            title="영어인증"
            passed={english.isPassed}
            onViewStandards={handleViewStandards}
            certificationType="english"
            overallSatisfied={certifications.isSatisfied}
          >
            {english.isPassed ? (
              <Flex justify="justify-center" align="items-center" className="h-full">
                <span className="text-primary">인증 완료</span>
              </Flex>
            ) : (
              <CertNotPassedContent onEdit={() => setShowEditModal(true)} />
            )}
          </CertificationCard>
        )}

        {/* 고전독서인증 */}
        {classic.isRequired && (
          <CertificationCard
            title="고전독서인증"
            passed={classic.isPassed}
            customStatus={`${classicTotal.myCount}/${classicTotal.requiredCount}`}
            onViewStandards={handleViewStandards}
            certificationType="classic"
            overallSatisfied={certifications.isSatisfied}
          >
            <ClassicReadingTable domains={classic.domains} />
          </CertificationCard>
        )}

        {/* SW코딩졸업인증 */}
        {coding.isRequired && (
          <CertificationCard
            title="SW코딩졸업인증"
            passed={coding.isPassed}
            onViewStandards={handleViewStandards}
            certificationType="coding"
            overallSatisfied={certifications.isSatisfied}
          >
            <Flex justify="justify-center" align="items-center" className="h-full">
              <span className={coding.isPassed ? 'text-primary' : 'text-gray-500 text-sm'}>
                {coding.isPassed ? '인증 완료' : '이수 내역 없음'}
              </span>
            </Flex>
          </CertificationCard>
        )}
      </Grid>

      {activeCriteriaType && (
        <CertificationCriteriaModal
          isOpen
          onClose={() => setActiveCriteriaType(null)}
          criteriaType={activeCriteriaType}
        />
      )}

      {showEditModal && (
        <CertificationEditModal isOpen onClose={() => setShowEditModal(false)} onConfirm={handleConfirmEdit} />
      )}
    </section>
  );
}

export default CertificationSection;
