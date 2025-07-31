import React from 'react';
// import useServiceSemester from '@/hooks/server/useServiceSemester.ts';
import ServiceClosed from '@/components/ServiceClosed.tsx';

interface IServiceEnabled {
  children: React.ReactNode;
}

function ServiceEnabled({ children }: IServiceEnabled) {
  // const { data, error } = useServiceSemester();

  // if (error) {
  //   console.error('Semester service error:', error);
  // }

  const mockData = {
    withinPeriod: false,
    code: 'FALL_25',
    semester: '2025-2',
    period: {
      endDate: '2025-09-30',
      startDate: '2025-08-11',
    },
  };

  return !mockData || mockData.withinPeriod ? children : <ServiceClosed data={mockData} />;
}

export default ServiceEnabled;
