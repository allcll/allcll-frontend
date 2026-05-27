import { SupportingText } from '@allcll/allcll-ui';
import type { CodingCertCriteria } from '../../types/graduation';
import { InfoCard, TargetTypeBadge } from './CertificationCriteriaParts';

function CodingCriteriaContent({ data }: Readonly<{ data: CodingCertCriteria | null }>) {
  if (!data) {
    return <SupportingText className="text-center py-8">코딩 인증 대상이 아닙니다.</SupportingText>;
  }
  const { altCourse } = data;
  return (
    <>
      <TargetTypeBadge targetType={data.codingTargetType} />
      <p className="text-sm text-gray-600">
        아래 기준 중 <span className="font-semibold text-primary-500">1가지</span>를 충족하면 인증됩니다.
      </p>
      <InfoCard label="TOSC (SW역량테스트)" value={`Level ${data.toscMinLevel} 이상`} />
      <SupportingText className="text-xs font-medium">대체 과목</SupportingText>
      <InfoCard label={altCourse.alt1CuriNm} value={`${altCourse.alt1MinGrade} 이상`} />
      {altCourse.alt2CuriNo && <InfoCard label={altCourse.alt2CuriNm!} value={`${altCourse.alt2MinGrade} 이상`} />}
    </>
  );
}

export default CodingCriteriaContent;
