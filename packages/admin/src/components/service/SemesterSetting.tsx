import { Card, Checkbox } from '@allcll/allcll-ui';
import Filtering from '@allcll/common/components/filtering/Filtering';
import { useState } from 'react';

const semesters = ['2025-동계'];

function SemesterSetting() {
  const [semester, setSemester] = useState('2025-동계');

  return (
    <section>
      <Card>
        <h3 className="text-md font-semibold mb-1">전체 학기 설정</h3>
        <p className="text-sm text-gray-500 mb-3">서비스 전체에서 사용할 학기를 설정합니다.</p>

        <Filtering
          label={semester ?? '학기를 선택해주세요.'}
          selected={semester !== ''}
          className="gap-4 max-h-80 overflow-y-auto"
        >
          {semesters.length === 0 && <div> 새로운 학기를 추가해주세요.</div>}
          {semesters.length !== 0 &&
            semesters.map(option => (
              <div className="flex gap-5" key={option}>
                <Checkbox
                  key={option}
                  label={option}
                  checked={semester === option}
                  onChange={() => setSemester(option)}
                />
              </div>
            ))}
        </Filtering>
      </Card>
    </section>
  );
}
export default SemesterSetting;
