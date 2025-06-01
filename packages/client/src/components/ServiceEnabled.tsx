import React from 'react';
import useServiceSemester from '@/hooks/server/useServiceSemester.ts';
import ServiceClosed from '@/components/ServiceClosed.tsx';

interface IServiceEnabled {
  children: React.ReactNode;
}

function ServiceEnabled({ children }: IServiceEnabled) {
  const { data, error } = useServiceSemester();

  if (error) {
    console.error('Semester service error:', error);
  }

  return !data || data.withinPeriod ? children : <ServiceClosed data={data} />;
}

export default ServiceEnabled;
