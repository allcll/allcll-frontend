import { useState } from 'react';
import { Card, Flex, Badge, Button, Heading, SupportingText } from '@allcll/allcll-ui';
import type {
  AdminGraduationViewResponse,
  CertificationCriteriaData,
} from '@/hooks/server/graduation/useAdminGraduationView';
import CertificationCriteriaModal, { type CertificationType } from './CertificationCriteriaModal';
import { CLASSIC_DOMAIN_LABELS } from './lib/mappers';

type Certifications = AdminGraduationViewResponse['checkData']['certifications'];

interface CertificationCardProps {
  title: string;
  passed: boolean;
  customStatus?: string;
  overallSatisfied?: boolean;
  certificationType: CertificationType;
  onViewStandards: (type: CertificationType) => void;
  children: React.ReactNode;
}

function CertificationCard({
  title,
  passed,
  customStatus,
  overallSatisfied,
  certificationType,
  onViewStandards,
  children,
}: Readonly<CertificationCardProps>) {
  const statusText = passed ? '인증' : (customStatus ?? '미인증');
  const badgeVariant = passed ? 'success' : overallSatisfied ? 'default' : 'danger';

  return (
    <Card variant="outlined" className="flex-1 relative">
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

interface CertificationSectionProps {
  certifications: Certifications;
  criteriaData: CertificationCriteriaData;
}

function CertificationSection({ certifications, criteriaData }: Readonly<CertificationSectionProps>) {
  const { english, coding, classic, passedCount, requiredPassCount } = certifications;
  const [activeCriteriaType, setActiveCriteriaType] = useState<CertificationType | null>(null);

  const requiredNames = [
    english.isRequired && '영어인증',
    classic.isRequired && '고전독서인증',
    coding.isRequired && 'SW코딩졸업인증',
  ].filter(Boolean) as string[];

  const policyDescription =
    requiredPassCount >= requiredNames.length
      ? `${requiredNames.join('과 ')}을 모두 이수해야 졸업 인증이 완료됩니다.`
      : `${requiredNames.join(', ')} 중 ${requiredPassCount}가지 이상을 이수하면 졸업 인증이 완료됩니다.`;

  const classicTotal = { requiredCount: classic.totalRequiredCount, myCount: classic.totalMyCount };

  return (
    <section>
      <Flex align="items-center" gap="gap-3">
        <Heading level={2}>졸업인증</Heading>
        <Badge variant={certifications.isSatisfied ? 'success' : 'danger'}>
          {passedCount}/{requiredPassCount}
        </Badge>
      </Flex>

      <SupportingText className="mb-6">{policyDescription}</SupportingText>

      <div className="flex flex-col md:flex-row gap-4">
        {english.isRequired && (
          <div className="flex-1 flex flex-col">
            <CertificationCard
              title="영어인증"
              passed={english.isPassed}
              overallSatisfied={certifications.isSatisfied}
              certificationType="english"
              onViewStandards={setActiveCriteriaType}
            >
              <Flex justify="justify-center" align="items-center" className="h-full">
                {english.isPassed ? (
                  <span className="text-primary">인증 완료</span>
                ) : (
                  <span className="text-gray-500">이수 내역 없음</span>
                )}
              </Flex>
            </CertificationCard>
          </div>
        )}

        {classic.isRequired && (
          <div className="flex-1 flex flex-col">
            <CertificationCard
              title="고전독서인증"
              passed={classic.isPassed}
              customStatus={`${classicTotal.myCount}/${classicTotal.requiredCount}`}
              overallSatisfied={certifications.isSatisfied}
              certificationType="classic"
              onViewStandards={setActiveCriteriaType}
            >
              <div className="text-sm">
                <table className="w-full">
                  <tbody>
                    {classic.domains.map(domain => (
                      <tr key={domain.domainType}>
                        <td className="py-1 text-gray-600">
                          {CLASSIC_DOMAIN_LABELS[domain.domainType] ?? domain.domainType}
                        </td>
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
            </CertificationCard>
          </div>
        )}

        {coding.isRequired && (
          <div className="flex-1 flex flex-col">
            <CertificationCard
              title="SW코딩졸업인증"
              passed={coding.isPassed}
              overallSatisfied={certifications.isSatisfied}
              certificationType="coding"
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
          </div>
        )}
      </div>

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
