import { CralwersParams, useClawlersDepartments } from '@/hooks/server/clawlers/useDepartmentClawlers';
import { useSubjectsClawlers } from '@/hooks/server/clawlers/useSubjuectClawlers';
import { Button, Card, Flex, Grid, TextField } from '@allcll/allcll-ui';
import { useState } from 'react';
import SectionHeader from '../common/SectionHeader';
import { useCrawlersPreseat } from '@/hooks/server/clawlers/usePreseatCrawlers';

type crawlerType = 'department' | 'subject' | 'pre-seat' | 'basket';

function CrawlerControlComponent() {
  const { mutate: clawlersDepartments } = useClawlersDepartments();
  const { mutate: clawlersSubjects } = useSubjectsClawlers();
  const { mutate: crawlersPreseat } = useCrawlersPreseat();
  const { mutate: crawlersBasket } = useCrawlersPreseat();

  const [clawlersParams, setClawlersParams] = useState<CralwersParams>({
    userId: '',
    year: '',
    semesterCode: '',
  });

  const params: (keyof CralwersParams)[] = ['userId', 'year', 'semesterCode'];

  const validParamsForm = (type: crawlerType) => {
    if (!clawlersParams.userId) {
      alert('userId를 입력해주세요.');
      return false;
    }

    if (type === 'department' || type === 'subject') {
      if (!clawlersParams.year || !clawlersParams.semesterCode) {
        alert('year와 semesterCode를 모두 입력해주세요.');
        return false;
      }

      return true;
    }

    return true;
  };

  const handleParamsChange = (key: keyof CralwersParams, value: string) => {
    setClawlersParams(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (type: crawlerType) => {
    if (type === 'department' && validParamsForm('department')) {
      clawlersDepartments(clawlersParams);
    } else if (type === 'subject' && validParamsForm('subject')) {
      clawlersSubjects(clawlersParams);
    } else if (type === 'pre-seat' && validParamsForm('pre-seat')) {
      crawlersPreseat({ userId: clawlersParams.userId });
    } else if (type === 'basket' && validParamsForm('basket')) {
      crawlersBasket({ userId: clawlersParams.userId });
    }
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

          <Grid columns={{ md: 4, sm: 2 }} gap="gap-3">
            <Button variant="outlined" size="medium" onClick={() => handleSubmit('department')}>
              학과 데이터 크롤링
            </Button>

            <Button variant="outlined" size="medium" onClick={() => handleSubmit('subject')}>
              과목 데이터 크롤링
            </Button>

            <Button variant="outlined" size="medium" onClick={() => handleSubmit('pre-seat')}>
              PreSeat 데이터 크롤링
            </Button>

            <Button variant="outlined" size="medium" onClick={() => handleSubmit('basket')}>
              Basket 데이터 크롤링
            </Button>
          </Grid>
        </Flex>
      </Card>
    </section>
  );
}

export default CrawlerControlComponent;
