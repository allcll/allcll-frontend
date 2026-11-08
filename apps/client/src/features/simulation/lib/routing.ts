interface IMenu {
  name: string;
  path?: string;
  children?: IMenu[];
}

export const ASIDE_MENU: IMenu[] = [
  {
    name: '수강 및 변동신청',
    children: [
      {
        name: '수강신청 및 기타',
        children: [
          { name: '수강신청', path: '/simulation' },
          { name: '수강신청 결과', path: '/simulation/logs' },
          { name: '관심과목 담기', path: '#' },
          { name: '강의시간표/수업계획서 조회', path: '#' },
          { name: '등록이력조회/고지서출력', path: '#' },
          { name: '학적변동신청(휴학,복학등)', path: '#' },
        ],
      },
    ],
  },
];

export const SimulationTabList = [
  { title: '수강신청', urlPath: '/simulation' },
  { title: '수강신청 결과', urlPath: '/simulation/logs' },
  { title: '상세 결과', urlPath: '/simulation/logs/' },
  { title: '관심과목 담기', urlPath: '/simulation/interest' },
  { title: '수강신청 관리', urlPath: '/simulation/admin' },
];

export const SimulationDefaultTab = {
  ...SimulationTabList[0],
  realUrl: SimulationTabList[0].urlPath,
};
