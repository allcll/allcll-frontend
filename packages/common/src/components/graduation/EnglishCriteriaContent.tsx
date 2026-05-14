import { SupportingText } from '@allcll/allcll-ui';
import type { EnglishCertCriteria } from '../../types/graduation';
import { CriteriaTable, InfoCard, TargetTypeBadge } from './CertificationCriteriaParts';

const ENGLISH_EXAM_ROWS = [
  { key: 'toeic', label: 'TOEIC', field: 'toeicMinScore' as const, unit: '점' },
  { key: 'toefl', label: 'TOEFL iBT', field: 'toeflIbtMinScore' as const, unit: '점' },
  { key: 'teps', label: 'TEPS', field: 'tepsMinScore' as const, unit: '점' },
  { key: 'newTeps', label: 'New TEPS', field: 'newTepsMinScore' as const, unit: '점' },
  { key: 'opic', label: 'OPIc', field: 'opicMinLevel' as const, unit: '' },
  { key: 'toeicSpeaking', label: 'TOEIC Speaking', field: 'toeicSpeakingMinLevel' as const, unit: '' },
];

function EnglishCriteriaContent({ data }: Readonly<{ data: EnglishCertCriteria | null }>) {
  if (!data) {
    return <SupportingText className="text-center py-8">영어 인증 대상이 아닙니다.</SupportingText>;
  }
  return (
    <>
      <TargetTypeBadge targetType={data.englishTargetType} />
      <p className="text-sm text-gray-600">
        아래 시험 중 <span className="font-semibold text-primary-500">1가지</span> 기준을 충족하면 인증됩니다.
      </p>
      <CriteriaTable
        headers={['시험', '기준']}
        rows={[
          ...ENGLISH_EXAM_ROWS.map(row => ({
            key: row.key,
            label: row.label,
            value: `${data[row.field]}${row.unit} 이상`,
          })),
          {
            key: 'gtelp',
            label: `G-TELP Level ${data.gtelpLevel}`,
            value: `${data.gtelpMinScore}점 이상`,
          },
          {
            key: 'gtelpSpeaking',
            label: `G-TELP Speaking Level ${data.gtelpSpeakingLevel}`,
            value: '',
          },
        ]}
      />
      <SupportingText className="text-xs font-medium">대체 과목</SupportingText>
      <InfoCard label={data.altCourse.altCuriNm} value={`${data.altCourse.altCuriCredit}학점`} />
    </>
  );
}

export default EnglishCriteriaContent;
