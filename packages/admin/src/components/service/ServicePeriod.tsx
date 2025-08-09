import Card from '@allcll/common/components/Card';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const serviceList = ['시간표', '관심과목', '올클연습', '실시간'];

function ServicePeriod() {
  const [dates, setDates] = useState(serviceList.map(() => ({ start: null as Date | null, end: null as Date | null })));

  const updateDate = (index: number, key: 'start' | 'end', date: Date | null) => {
    const newDates = [...dates];
    newDates[index][key] = date;
    setDates(newDates);
  };

  return (
    <section>
      <Card>
        <h3 className="text-md font-semibold mb-1">서비스별 운영 기간 설정</h3>
        <p className="text-sm text-gray-500 mb-4">각 서비스의 오픈 시작일과 종료일을 설정합니다.</p>
        <div className="space-y-6">
          {serviceList.map((label, index) => (
            <div key={label} className="flex flex-row gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{label} 시작일</label>
                <DatePicker
                  selected={dates[index].start}
                  onChange={date => updateDate(index, 'start', date)}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm"
                  placeholderText="시작일 선택"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{label} 종료일</label>
                <DatePicker
                  selected={dates[index].end}
                  onChange={date => updateDate(index, 'end', date)}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm"
                  placeholderText="종료일 선택"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

export default ServicePeriod;
