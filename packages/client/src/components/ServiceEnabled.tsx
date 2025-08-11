import React from 'react';
import useServiceSemester from '@/hooks/server/useServiceSemester.ts';
import ServiceClosed from '@/components/ServiceClosed.tsx';

interface IServiceEnabled {
  serviceId: string;
  children: React.ReactNode;
}

function ServiceEnabled({ serviceId, children }: IServiceEnabled) {
  const { data, error } = useServiceSemester(serviceId);

  if (error) {
    console.error('Semester service error:', error);
  }

  if (!data || !('service' in data) || !data.service) return children;

  return data.service.withinPeriod ? children : <ServiceClosed data={data} />;
}

export default ServiceEnabled;
