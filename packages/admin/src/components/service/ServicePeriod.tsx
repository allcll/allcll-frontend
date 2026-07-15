import { useEffect, useState, type FormEvent } from 'react';
import { Button, Card, Flex, Label } from '@allcll/allcll-ui';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SectionHeader from '../common/SectionHeader';
import {
  OperationPeriodRequest,
  SERVICE_OPERATIONS,
  useOperationPeriods,
  useSaveOperationPeriods,
} from '@/hooks/server/service/useOperationPeriod';
import { useSemester } from '@/hooks/server/service/useSemester';
import { toDateString } from '@/utils/formatTime';

interface PeriodInput {
  startDate: string; // YYYY-MM-DD
  endDate: string;
}

const emptyPeriods = (): PeriodInput[] => SERVICE_OPERATIONS.map(() => ({ startDate: '', endDate: '' }));

function ServicePeriod() {
  const today = toDateString(new Date());
  const { data: semester } = useSemester();
  const { data: details } = useOperationPeriods(today);
  const { mutate: saveOperationPeriods, isPending } = useSaveOperationPeriods();

  const [periods, setPeriods] = useState<PeriodInput[]>(emptyPeriods);

  useEffect(() => {
    if (!details) return;

    setPeriods(
      SERVICE_OPERATIONS.map(({ operationType }) => {
        const detail = details.find(d => d.operationType === operationType);
        return {
          startDate: detail?.startDate.slice(0, 10) ?? '',
          endDate: detail?.endDate.slice(0, 10) ?? '',
        };
      }),
    );
  }, [details]);

  const updateDate = (index: number, key: keyof PeriodInput, date: Date | null) => {
    setPeriods(prev =>
      prev.map((period, i) => (i === index ? { ...period, [key]: date ? toDateString(date) : '' } : period)),
    );
  };

  const submitServicePeriod = (e: FormEvent) => {
    e.preventDefault();
    if (!semester) return;

    // LocalDateTime 형식으로 변환 (종료일은 23:59:59까지 포함)
    const requests: OperationPeriodRequest[] = SERVICE_OPERATIONS.map(({ operationType }, index) => ({
      operationType,
      ...periods[index],
    }))
      .filter(period => period.startDate && period.endDate)
      .map(period => ({
        operationType: period.operationType,
        startDate: `${period.startDate}T00:00:00`,
        endDate: `${period.endDate}T23:59:59`,
        message: null,
      }));

    if (requests.length === 0) return;

    saveOperationPeriods({ semesterCode: semester.semesterCode, periods: requests });
  };

  return (
    <form onSubmit={submitServicePeriod}>
      <section>
        <Card>
          <Flex direction="flex-col" gap="gap-4">
            <SectionHeader title="서비스 운영 기간 설정" description="각 서비스의 오픈 시작일과 종료일을 설정합니다." />

            {SERVICE_OPERATIONS.map(({ operationType, label }, index) => (
              <Flex key={operationType} gap="gap-4">
                <div>
                  <Label className="block text-sm font-medium mb-1">{label} 시작일</Label>
                  <DatePicker
                    selected={periods[index].startDate ? new Date(periods[index].startDate) : null}
                    onChange={date => updateDate(index, 'startDate', date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="시작일 선택"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-1">{label} 종료일</Label>
                  <DatePicker
                    selected={periods[index].endDate ? new Date(periods[index].endDate) : null}
                    onChange={date => updateDate(index, 'endDate', date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="종료일 선택"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </Flex>
            ))}
          </Flex>

          <Flex justify="justify-end">
            <Button type="submit" variant="primary" size="medium" disabled={isPending || !semester}>
              {isPending ? '저장 중...' : '전체 저장'}
            </Button>
          </Flex>
        </Card>
      </section>
    </form>
  );
}

export default ServicePeriod;
