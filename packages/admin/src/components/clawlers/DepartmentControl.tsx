import { ClawlersDepartmentsParams, useClawlersDepartments } from '@/hooks/server/clawlers/useDepartmentClawlers';
import CustomButton from '@allcll/common/components/Button';
import Card from '@allcll/common/components/Card';
import { useState } from 'react';

function DepartmentControl() {
  const { mutate: clawlersDepartments } = useClawlersDepartments();
  const [departmentParams, setDepartmentParams] = useState<ClawlersDepartmentsParams>({
    userId: '',
    year: '',
    semesterCode: '',
  });

  const params: (keyof ClawlersDepartmentsParams)[] = ['userId', 'year', 'semesterCode'];

  const handleParamsChange = (key: keyof ClawlersDepartmentsParams, value: string) => {
    setDepartmentParams(prev => ({ ...prev, [key]: value }));
  };

  const submitClawerDepartment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clawlersDepartments(departmentParams);
    console.log('submit', departmentParams);
  };

  return (
    <section>
      <Card>
        <h3 className="text-md font-semibold mb-3">학과 크롤링 제어</h3>
        <p className="text-sm text-gray-500 mb-4">학과 크롤러를 제어합니다.</p>

        <form onSubmit={submitClawerDepartment} className="flex flex-col gap-3">
          {params.map(param => {
            return (
              <div className="flex flex-col gap-2">
                <label htmlFor="userId" className="text-sm text-gray-700">
                  {param}
                </label>
                <input
                  type="text"
                  value={departmentParams[param]}
                  onChange={e => handleParamsChange(param, e.target.value)}
                  placeholder={`${param}을 입력해주세요`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            );
          })}

          <CustomButton type="submit" variants="secondary" disabled={false} onClick={() => {}}>
            학과 데이터 크롤링
          </CustomButton>
        </form>
      </Card>
    </section>
  );
}

export default DepartmentControl;
