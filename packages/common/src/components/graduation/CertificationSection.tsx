import { useState } from 'react';
import { Card, Flex, Grid, Badge, Button, Heading, SupportingText } from '@allcll/allcll-ui';
import type {
  CertificationType,
  Certifications,
  ClassicDomain,
  GraduationCertificationCriteria,
} from '../../types/graduation';
import { CLASSIC_DOMAIN_LABELS } from '../../lib/graduation/mappers';
import CertificationCriteriaModal from './CertificationCriteriaModal';

interface CertificationSectionProps {
  certifications: Certifications;
  criteriaData: GraduationCertificationCriteria;
  onEditEnglishCert?: () => void;
}

interface CertificationCardProps {
  title: string;
  isPassed: boolean;
  customStatus?: string;
  overallSatisfied?: boolean;
  certificationType: CertificationType;
  onViewStandards: (type: CertificationType) => void;
  children: React.ReactNode;
}

function CertificationCard({
  title,
  isPassed,
  customStatus,
  overallSatisfied,
  certificationType,
  onViewStandards,
  children,
}: Readonly<CertificationCardProps>) {
  const statusText = isPassed ? '인증' : (customStatus ?? '미인증');
  const badgeVariant = isPassed ? 'success' : overallSatisfied ? 'default' : 'danger';

  return (
    <Card variant="outlined" className="h-full relative">
      <div className="absolute top-3 right-3">
        <Badge variant={badgeVariant}>{statusText}</Badge>
      </div>
      <Flex direction="flex-col" gap="gap-4" className="h-full">
        <div className="text-center">
          <span className="text-lg font-bold">{title}</span>
        </div>
        <div className="flex-1">{children}</div>
        <div className="w-full [&>button]:w-full">
          <Button variant="outlined" size="small" onClick={() => onViewStandards(certificationType)}>
            기준 확인
          </Button>
        </div>
      </Flex>
    </Card>
  );
}

function ClassicReadingTable({ domains }: Readonly<{ domains: ClassicDomain[] }>) {
  return (
    <div className="text-sm">
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

interface EnglishCertContentProps {
  isPassed: boolean;
  onEdit?: () => void;
}

function EnglishCertContent({ isPassed, onEdit }: Readonly<EnglishCertContentProps>) {
  return (
    <Flex direction="flex-col" align="items-center" justify="justify-center" gap="gap-1" className="h-full">
      {isPassed ? (
        <span className="text-primary">인증 완료</span>
      ) : (
        <span className="text-gray-500">이수 내역 없음</span>
      )}
      {onEdit && (
        <Button
          variant="text"
          size="small"
          onClick={onEdit}
          className="underline underline-offset-2 cursor-pointer text-primary-500 hover:text-primary-700"
        >
          결과가 잘못되었나요?
        </Button>
      )}
    </Flex>
  );
}

const CERT_NAMES: Record<CertificationType, string> = {
  english: '영어인증',
  coding: 'SW코딩졸업인증',
  classic: '고전독서인증',
};

function CertificationSection({
  certifications,
  criteriaData,
  onEditEnglishCert,
}: Readonly<CertificationSectionProps>) {
  const { english, coding, classic, passedCount, requiredPassCount } = certifications;
  const [activeCriteriaType, setActiveCriteriaType] = useState<CertificationType | null>(null);

  const requiredNames = (Object.keys(CERT_NAMES) as CertificationType[])
    .filter(key => certifications[key].isRequired)
    .map(key => CERT_NAMES[key]);

  const policyDescription =
    requiredPassCount >= requiredNames.length
      ? `${requiredNames.join('과 ')}을 모두 이수해야 졸업 인증이 완료됩니다.`
      : `${requiredNames.join(', ')} 중 ${requiredPassCount}가지 이상을 이수하면 졸업 인증이 완료됩니다.`;

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
        {english.isRequired && (
          <CertificationCard
            title={CERT_NAMES.english}
            isPassed={english.isPassed}
            certificationType="english"
            overallSatisfied={certifications.isSatisfied}
            onViewStandards={setActiveCriteriaType}
          >
            <EnglishCertContent isPassed={english.isPassed} onEdit={onEditEnglishCert} />
          </CertificationCard>
        )}

        {classic.isRequired && (
          <CertificationCard
            title={CERT_NAMES.classic}
            isPassed={classic.isPassed}
            customStatus={`${classic.totalMyCount}/${classic.totalRequiredCount}`}
            certificationType="classic"
            overallSatisfied={certifications.isSatisfied}
            onViewStandards={setActiveCriteriaType}
          >
            <ClassicReadingTable domains={classic.domains} />
          </CertificationCard>
        )}

        {coding.isRequired && (
          <CertificationCard
            title={CERT_NAMES.coding}
            isPassed={coding.isPassed}
            certificationType="coding"
            overallSatisfied={certifications.isSatisfied}
            onViewStandards={setActiveCriteriaType}
          >
            <Flex justify="justify-center" align="items-center" className="h-full">
              {coding.isPassed ? (
                <span className="text-primary">인증 완료</span>
              ) : (
                <span className="text-gray-500">이수 내역 없음</span>
              )}
            </Flex>
          </CertificationCard>
        )}
      </Grid>

      {activeCriteriaType && (
        <CertificationCriteriaModal
          isOpen
          onClose={() => setActiveCriteriaType(null)}
          criteriaType={activeCriteriaType}
          criteriaData={criteriaData}
        />
      )}
    </section>
  );
}

export default CertificationSection;
