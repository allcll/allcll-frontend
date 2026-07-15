import { Badge, Card, Flex, Grid, SupportingText } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';
import {
  SERVICE_OPERATION_LABEL,
  SERVICE_OPERATION_TYPES,
  useOperationPeriods,
} from '@/hooks/server/service/useOperationPeriod';
import { toDateString } from '@/utils/formatTime';

const isOpen = (now: Date, startDate: string, endDate: string) => {
  return now >= new Date(startDate) && now <= new Date(endDate);
};

function ServiceOpen() {
  const today = toDateString(new Date());
  const { data, isLoading, isError } = useOperationPeriods(today);

  const now = new Date();
  const periods = (data ?? []).filter(period => SERVICE_OPERATION_TYPES.includes(period.operationType));

  return (
    <section>
      <SectionHeader title="서비스 오픈 현황" description="각 서비스의 오픈 상태를 확인합니다." />

      {isLoading && <SupportingText>불러오는 중...</SupportingText>}
      {!isLoading && isError && <SupportingText className="text-red-500">불러오지 못했습니다.</SupportingText>}
      {!isLoading && !isError && periods.length === 0 && <SupportingText>등록된 운영 기간이 없습니다.</SupportingText>}

      {!isLoading && !isError && periods.length > 0 && (
        <Grid columns={{ base: 2, sm: 4 }} gap="gap-4">
          {periods.map(({ operationType, startDate, endDate }) => {
            const open = isOpen(now, startDate, endDate);

            return (
              <Card key={operationType}>
                <Flex align="items-start" justify="justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {SERVICE_OPERATION_LABEL[operationType] ?? operationType}
                  </span>
                  <Badge variant={open ? 'success' : 'danger'}>{open ? 'OPEN' : 'CLOSED'}</Badge>
                </Flex>

                <p className="text-sm text-gray-500">시작: {startDate.slice(0, 16).replace('T', ' ')}</p>
                <p className="text-sm text-gray-500">종료: {endDate.slice(0, 16).replace('T', ' ')}</p>
              </Card>
            );
          })}
        </Grid>
      )}
    </section>
  );
}

export default ServiceOpen;
