import type { ComponentType } from 'react';
import { Dialog, Flex, Button } from '@allcll/allcll-ui';
import { useBodyScrollLock } from '@/shared/lib/useBodyScrollLock';
import type { CertificationCriteriaData, CertificationTargetType } from '@/entities/joluphaja/api/graduation';
import { useCertificationCriteria } from '@/entities/joluphaja/model/useGraduation';
import type { CertificationType } from './CertificationSection';

function TargetTypeBadge({ targetType }: { targetType: CertificationTargetType }) {
  return (
    <div className="inline-flex">
      <span className="bg-primary-100 text-primary-600 text-xs font-medium px-2 py-1 rounded">
        {targetType === 'MAJOR' ? '전공자' : '비전공자'}
      </span>
    </div>
  );
}

interface CriteriaTableRow {
  key: string;
  label: string;
  value: string;
}

function CriteriaTable({ headers, rows }: { headers: [string, string]; rows: CriteriaTableRow[] }) {
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-md p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

// 각 기준 항목 별 컨텐츠

interface CriteriaContentProps {
  data: CertificationCriteriaData;
}

const ENGLISH_EXAM_ROWS = [
  { key: 'toeic', label: 'TOEIC', field: 'toeicMinScore', unit: '점' },
  { key: 'toefl', label: 'TOEFL iBT', field: 'toeflIbtMinScore', unit: '점' },
  { key: 'teps', label: 'TEPS', field: 'tepsMinScore', unit: '점' },
  { key: 'newTeps', label: 'New TEPS', field: 'newTepsMinScore', unit: '점' },
  { key: 'opic', label: 'OPIc', field: 'opicMinLevel', unit: '' },
  { key: 'toeicSpeaking', label: 'TOEIC Speaking', field: 'toeicSpeakingMinLevel', unit: '' },
] as const;

function EnglishCriteriaContent({ data }: CriteriaContentProps) {
  const { englishCriteria } = data;

  return (
    <>
      <TargetTypeBadge targetType={englishCriteria.targetType} />

      <p className="text-sm text-gray-600">
        아래 시험 중 <span className="font-semibold text-primary-500">1가지</span> 기준을 충족하면 인증됩니다.
      </p>

      <CriteriaTable
        headers={['시험', '기준']}
        rows={[
          ...ENGLISH_EXAM_ROWS.map(row => ({
            key: row.key,
            label: row.label,
            value: `${englishCriteria[row.field]}${row.unit} 이상`,
          })),
          {
            key: 'gtelp',
            label: `G-TELP Level ${englishCriteria.gtelpLevel}`,
            value: `${englishCriteria.gtelpMinScore}점 이상`,
          },
          {
            key: 'gtelpSpeaking',
            label: `G-TELP Speaking Level ${englishCriteria.gtelpSpeakingLevel}`,
            value: '',
          },
        ]}
      />

      {englishCriteria.altCourse && (
        <InfoCard
          label="대체 과목"
          value={`${englishCriteria.altCourse.name} (${englishCriteria.altCourse.credit}학점)`}
        />
      )}
    </>
  );
}

const CLASSIC_DOMAIN_ROWS = [
  { key: 'western', label: '서양의 역사와 사상', field: 'requiredCountWestern' },
  { key: 'eastern', label: '동양의 역사와 사상', field: 'requiredCountEastern' },
  { key: 'eastWest', label: '동·서양의 문학', field: 'requiredCountEasternAndWestern' },
  { key: 'science', label: '과학 사상', field: 'requiredCountScience' },
] as const;

function ClassicCriteriaContent({ data }: CriteriaContentProps) {
  const { classicCriteria } = data;

  return (
    <>
      <p className="text-sm text-gray-600">
        총 <span className="font-semibold text-primary-500">{classicCriteria.totalRequiredCount}권</span>을 읽어야
        합니다. 각 영역별 최소 권수는 아래와 같습니다.
      </p>

      <CriteriaTable
        headers={['영역', '최소 권수']}
        rows={CLASSIC_DOMAIN_ROWS.map(row => ({
          key: row.key,
          label: row.label,
          value: `${classicCriteria[row.field]}권`,
        }))}
      />

      <div className="flex justify-between items-center bg-gray-50 rounded-md px-3 py-2">
        <span className="text-sm text-gray-600 font-medium">합계</span>
        <span className="text-sm font-bold text-primary-600">{classicCriteria.totalRequiredCount}권</span>
      </div>
    </>
  );
}

function CodingCriteriaContent({ data }: CriteriaContentProps) {
  const { codingCriteria } = data;

  return (
    <>
      <TargetTypeBadge targetType={codingCriteria.targetType} />

      <p className="text-sm text-gray-600">
        아래 기준 중 <span className="font-semibold text-primary-500">1가지</span>를 충족하면 인증됩니다.
      </p>

      <InfoCard label="TOSC (SW역량테스트)" value={`Level ${codingCriteria.toscMinLevel} 이상`} />

      {codingCriteria.alt1 && (
        <InfoCard
          label="대체 과목 1"
          value={`학수번호 ${codingCriteria.alt1.curiNo} · ${codingCriteria.alt1.minGrade} 이상 취득`}
        />
      )}

      {codingCriteria.alt2 && (
        <InfoCard
          label="대체 과목 2"
          value={`학수번호 ${codingCriteria.alt2.curiNo} · ${codingCriteria.alt2.minGrade} 이상 취득`}
        />
      )}
    </>
  );
}

// 모달 레이아웃

const CRITERIA_TYPE_TITLES: Record<CertificationType, string> = {
  english: '영어 인증 기준',
  classic: '고전독서 인증 기준',
  coding: 'SW코딩 인증 기준',
};

const criteriaContentRegistry: Record<CertificationType, ComponentType<CriteriaContentProps>> = {
  english: EnglishCriteriaContent,
  classic: ClassicCriteriaContent,
  coding: CodingCriteriaContent,
};

// ---- 모달 셸 ----

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
        <Flex direction="flex-col" gap="gap-3" className="min-w-64 md:min-w-96 h-80 overflow-y-auto">
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
