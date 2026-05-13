import { useEffect, type ComponentType } from 'react';
import { Dialog, Flex, Button, Badge, SupportingText } from '@allcll/allcll-ui';
import type {
  CertificationType,
  ClassicCertCriteria,
  CodingCertCriteria,
  EnglishCertCriteria,
  GraduationCertificationCriteria,
} from '../../types/graduation';

function TargetTypeBadge({ targetType }: Readonly<{ targetType: string }>) {
  const isMajor = targetType !== 'NON_MAJOR';
  return (
    <div>
      <Badge variant={isMajor ? 'success' : 'default'}>{isMajor ? '전공자' : '비전공자'}</Badge>
    </div>
  );
}

interface CriteriaTableRow {
  key: string;
  label: string;
  value: string;
}

function CriteriaTable({ headers, rows }: Readonly<{ headers: [string, string]; rows: CriteriaTableRow[] }>) {
  return (
    <div className="text-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 text-left text-gray-500 font-medium">{headers[0]}</th>
            <th className="py-2 text-right text-gray-500 font-medium">{headers[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.key} className="border-b border-gray-50">
              <td className="py-2 text-gray-700">{row.label}</td>
              <td className="py-2 text-right font-medium">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="bg-gray-50 rounded-md p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

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
      <p className="text-xs text-gray-500 font-medium">대체 과목</p>
      <InfoCard label={data.altCourse.altCuriNm} value={`${data.altCourse.altCuriCredit}학점`} />
    </>
  );
}

function ClassicCriteriaContent({ data }: Readonly<{ data: ClassicCertCriteria }>) {
  return (
    <>
      <p className="text-sm text-gray-600">
        총 <span className="font-semibold text-primary-500">{data.totalRequiredCount}권</span>을 읽어야 합니다. 각
        영역별 최소 권수는 아래와 같습니다.
      </p>
      <CriteriaTable
        headers={['영역', '최소 권수']}
        rows={[
          { key: 'western', label: '서양의 역사와 사상', value: `${data.requiredCountWestern}권` },
          { key: 'eastern', label: '동양의 역사와 사상', value: `${data.requiredCountEastern}권` },
          { key: 'eastWest', label: '동·서양의 문학', value: `${data.requiredCountEasternAndWestern}권` },
          { key: 'science', label: '과학 사상', value: `${data.requiredCountScience}권` },
        ]}
      />
      <Flex justify="justify-between" align="items-center" className="bg-gray-50 rounded-md px-3 py-2">
        <span className="text-sm text-gray-600 font-medium">합계</span>
        <span className="text-sm font-bold text-primary-600">{data.totalRequiredCount}권</span>
      </Flex>
    </>
  );
}

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
      <p className="text-xs text-gray-500 font-medium">대체 과목</p>
      <InfoCard label={altCourse.alt1CuriNm} value={`${altCourse.alt1MinGrade} 이상`} />
      {altCourse.alt2CuriNo && <InfoCard label={altCourse.alt2CuriNm!} value={`${altCourse.alt2MinGrade} 이상`} />}
    </>
  );
}

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
