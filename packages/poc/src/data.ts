// Shared sample data for all chart implementations

export const BAR_DATA = {
  labels: ['4학년', '3학년', '2학년', '1학년'],
  values: [50, 40, 25, 20],
  color: '#60a5fa',
};

export const DOUGHNUT_DATA = {
  labels: ['컴퓨터공학과', '정보통신공학과', '소프트웨어학과', '기타'],
  values: [40, 25, 20, 15],
  colors: ['#f97316', '#3b82f6', '#facc15', '#22c55e'],
};

export const RADAR_DATA = {
  labels: ['신청 버튼 속도', '전체 속도', '정확도', '인증 속도'],
  datasets: [
    {
      label: '평균',
      data: [60, 45, 85, 70],
      color: 'rgba(5, 223, 114, 0.7)',
      borderColor: 'rgba(5, 223, 114, 1)',
    },
    {
      label: '내 능력',
      data: [75, 55, 90, 80],
      color: 'rgba(0, 122, 255, 0.4)',
      borderColor: 'rgba(0, 122, 255, 1)',
    },
  ],
};
