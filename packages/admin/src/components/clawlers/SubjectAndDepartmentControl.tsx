import { CralwersParams, useClawlersDepartments } from '@/hooks/server/clawlers/useDepartmentClawlers';
import { useSubjectsClawlers } from '@/hooks/server/clawlers/useSubjuectClawlers';
import { Button, Flex, TextField } from '@allcll/allcll-ui';
import Card from '@allcll/common/components/Card';
import { useState } from 'react';
import SectionHeader from '../common/SectionHeader';

function SubjectAndDepartmentControl() {
  const { mutate: clawlersDepartments } = useClawlersDepartments();
  const { mutate: clawlersSubjects } = useSubjectsClawlers();

  const [clawlersParams, setClawlersParams] = useState<CralwersParams>({
    userId: '',
    year: '',
    semesterCode: '',
  });

  const params: (keyof CralwersParams)[] = ['userId', 'year', 'semesterCode'];

  const handleParamsChange = (key: keyof CralwersParams, value: string) => {
    setClawlersParams(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (type: 'department' | 'subject') => {
    if (type === 'department') {
      clawlersDepartments(clawlersParams);
    } else {
      clawlersSubjects(clawlersParams);
    }
    console.log('submit', type, clawlersParams);
  };

  return (
    <section>
      <Card>
        <SectionHeader title="학과 및 과목 크롤링 제어" description="학과 및 과목 크롤러를 제어합니다." />

        <Flex direction="flex-col" gap="gap-4">
          {params.map(param => (
            <TextField
              key={param}
              id={param}
              label={param}
              size="medium"
              required
              value={clawlersParams[param]}
              onChange={e => handleParamsChange(param, e.target.value)}
              placeholder={`${param}을 입력해주세요`}
            />
          ))}

          <Flex justify="justify-end" gap="gap-2">
            <Button variant="outlined" size="medium" onClick={() => handleSubmit('department')}>
              학과 데이터 크롤링
            </Button>

            <Button variant="outlined" size="medium" onClick={() => handleSubmit('subject')}>
              과목 데이터 크롤링
            </Button>
          </Flex>
        </Flex>
      </Card>
    </section>
  );
}

export default SubjectAndDepartmentControl;
