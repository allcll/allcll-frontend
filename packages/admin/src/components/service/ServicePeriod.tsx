import { PreiodService } from '@/utils/type';
import { Button, Card, Flex, Label } from '@allcll/allcll-ui';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SectionHeader from '../common/SectionHeader';

const serviceList = [
  {
    id: 'timetable',
    name: '시간표',
  },
  {
    id: 'baskets',
    name: '관심과목',
  },
  {
    id: 'simulation',
    name: '올클연습',
  },
  {
    id: 'live',
    name: '실시간',
  },
];

const initPeriodService: PreiodService[] = [
  {
    id: 'timetable',
    startDate: '2025-07-18',
    endDate: '2099-12-31',
    message: '',
  },
  {
    id: 'baskets',
    startDate: '2025-07-18',
    endDate: '2099-12-31',
    message: '',
  },
  {
    id: 'simulation',
    startDate: '2025-07-18',
    endDate: '2099-12-31',
    message: '',
  },
  {
    id: 'live',
    startDate: '2025-12-01',
    endDate: '2025-12-10',
    message: '',
  },
];

function ServicePeriod() {
  const [serviceDates, setServiceDates] = useState<PreiodService[]>(initPeriodService);

  const formatDate = (date: Date | null) => {
    return date?.toISOString().slice(0, 10) ?? '';
  };

  const updateDate = (index: number, key: 'startDate' | 'endDate', date: Date | null) => {
    const newDates = [...serviceDates];

    newDates[index][key] = formatDate(date);
    setServiceDates(newDates);
  };

  const submitServicePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    //TODO: 서비스 수정 API 연결
  };

  return (
    <form onSubmit={submitServicePeriod}>
      <section>
        <Card>
          <Flex direction="flex-col" gap="gap-4">
            <SectionHeader title="서비스 운영 기간 설정" description="각 서비스의 오픈 시작일과 종료일을 설정합니다." />

            {serviceList.map((label, index) => (
              <Flex key={label.id} gap="gap-4">
                <div>
                  <Label className="block text-sm font-medium mb-1">{label.name} 시작일</Label>
                  <DatePicker
                    selected={serviceDates[index].startDate ? new Date(serviceDates[index].startDate) : null}
                    onChange={date => updateDate(index, 'startDate', date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="시작일 선택"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-1">{label.name} 종료일</Label>
                  <DatePicker
                    selected={serviceDates[index].startDate ? new Date(serviceDates[index].startDate) : null}
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
            <Button type="submit" variant="primary" size="medium">
              전체 저장
            </Button>
          </Flex>
        </Card>
      </section>
    </form>
  );
}

export default ServicePeriod;
