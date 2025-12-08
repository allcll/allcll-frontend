import { PreiodService } from '@/utils/type';
import Card from '@allcll/common/components/Card';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
          <h3 className="text-md font-semibold mb-1">서비스별 운영 기간 설정</h3>
          <p className="text-sm text-gray-500 mb-4">각 서비스의 오픈 시작일과 종료일을 설정합니다.</p>
          <div className="space-y-6">
            {serviceList.map((label, index) => (
              <div key={label.id} className="flex flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{label.name} 시작일</label>
                  <DatePicker
                    selected={serviceDates[index].startDate ? new Date(serviceDates[index].startDate) : null}
                    onChange={date => updateDate(index, 'startDate', date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="시작일 선택"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{label.name} 종료일</label>
                  <DatePicker
                    selected={serviceDates[index].startDate ? new Date(serviceDates[index].startDate) : null}
                    onChange={date => updateDate(index, 'endDate', date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="종료일 선택"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <div className="flex justify-end mt-5 ">
        <button type="submit" className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg">
          전체 저장
        </button>
      </div>
    </form>
  );
}

export default ServicePeriod;
