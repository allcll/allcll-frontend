import { Card, Flex, Grid, Badge, Button, Heading, SupportingText } from '@allcll/allcll-ui';
import type { Certifications, PolicyYear, ClassicDomain } from '@/entities/joluphaja/api/graduation';
import { CLASSIC_DOMAIN_LABELS } from '../lib/mappers';

type CertificationType = 'english' | 'classic' | 'coding';

interface CertificationSectionProps {
  certifications: Certifications;
  policyYear: PolicyYear;
}

interface CertificationCardProps {
  title: string;
  passed: boolean;
  /** 커스텀 상태 텍스트 (예: 고전독서 "7/10") */
  customStatus?: string;
  children?: React.ReactNode;
  onViewStandards?: (type: CertificationType) => void;
  certificationType: CertificationType;
}

function CertificationCard({
  title,
  passed,
  customStatus,
  children,
  onViewStandards,
  certificationType,
}: CertificationCardProps) {
  // 상태 표시 텍스트: customStatus가 있으면 사용, 없으면 인증/미인증
  const statusText = passed ? '인증' : (customStatus ?? '미인증');

  return (
    <Card variant="outlined" className="h-full">
      <Flex direction="flex-col" gap="gap-4" className="h-full">
        <div className="text-center">
          <span className="text-lg font-bold">{title}</span>
        </div>

        <div className="flex-1">{children}</div>

        {/* 인증 상태 */}
        <div
          className={`w-full py-2 text-center rounded-md text-sm font-semibold ${
            passed ? 'bg-primary-100 text-primary-600' : 'bg-secondary-100 text-secondary-600'
          }`}
        >
          {statusText}
        </div>

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
    <div className="text-sm">
      <table className="w-full">
        <tbody>
          {domains.map(domain => (
            <tr key={domain.domainType}>
              <td className="py-1 text-gray-600">{CLASSIC_DOMAIN_LABELS[domain.domainType]}</td>
              <td className="py-1 text-right">
                <span className={domain.satisfied ? 'text-primary-600' : 'text-gray-900'}>
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

function CertificationSection({ certifications, policyYear }: CertificationSectionProps) {
  const { english, coding, classic, passedCount, requiredPassCount } = certifications;

  const handleViewStandards = (type: CertificationType) => {
    // TODO: 기준 확인 모달 열기
    console.log('기준 확인 클릭:', type);
  };

  // 정책 설명 텍스트
  const policyDescription =
    policyYear === 'from23'
      ? '영어 인증, 소프트웨어 코딩 인증, 고전 독서 인증 중 2가지 이상을 이수하면 졸업 인증이 완료됩니다.'
      : '영어 인증과 고전독서 인증을 모두 이수해야 졸업 인증이 완료됩니다.';

  // 고전독서 전체 권수 계산
  const classicTotal = {
    requiredCount: classic.domains.reduce((sum, d) => sum + d.requiredCount, 0),
    myCount: classic.domains.reduce((sum, d) => sum + d.myCount, 0),
  };

  return (
    <section>
      <Flex align="items-center" gap="gap-3" className="mb-4">
        <Heading level={2}>졸업인증</Heading>
        <Badge variant={certifications.isSatisfied ? 'success' : 'danger'}>
          {passedCount}/{requiredPassCount}
        </Badge>
      </Flex>

      <SupportingText className="mb-6">{policyDescription}</SupportingText>

      <Grid columns={{ base: 1, md: 3 }} gap="gap-4">
        {/* 영어인증 */}
        <CertificationCard
          title="영어인증"
          passed={english.passed}
          onViewStandards={handleViewStandards}
          certificationType="english"
        >
          <Flex justify="justify-center" align="items-center" className="h-full">
            {english.passed ? (
              <span className="text-primary-600">인증 완료</span>
            ) : (
              <span className="text-gray-500">이수 내역 없음</span>
            )}
          </Flex>
        </CertificationCard>

        {/* 고전독서인증 */}
        <CertificationCard
          title="고전독서인증"
          passed={classic.passed}
          customStatus={`${classicTotal.myCount}/${classicTotal.requiredCount}`}
          onViewStandards={handleViewStandards}
          certificationType="classic"
        >
          <ClassicReadingTable domains={classic.domains} />
        </CertificationCard>

        {/* SW코딩졸업인증 (23학번 이후에만 표시) */}
        {policyYear === 'from23' && (
          <CertificationCard
            title="SW코딩졸업인증"
            passed={coding.passed}
            onViewStandards={handleViewStandards}
            certificationType="coding"
          >
            <Flex justify="justify-center" align="items-center" className="h-full">
              {coding.passed ? (
                <span className="text-primary-600">인증 완료</span>
              ) : (
                <span className="text-gray-500">이수 내역 없음</span>
              )}
            </Flex>
          </CertificationCard>
        )}
      </Grid>
    </section>
  );
}

export default CertificationSection;
