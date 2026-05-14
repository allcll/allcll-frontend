import { Flex } from '@allcll/allcll-ui';
import type { ClassicCertCriteria } from '../../types/graduation';
import { CriteriaTable } from './CertificationCriteriaParts';

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

export default ClassicCriteriaContent;
