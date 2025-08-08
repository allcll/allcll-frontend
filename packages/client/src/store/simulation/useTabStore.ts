import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { create } from 'zustand';
import { useEffect } from 'react';

interface ITab {
  title: string;
  urlPath: string;
  realUrl: string;
}

interface IUseTabStore {
  tabs: ITab[];
  setTab: (tab: ITab) => void;
  deleteTab: (urlPath: string, navigate: NavigateFunction) => void;
}

const useTabStore = create<IUseTabStore>(set => ({
  tabs: [],
  setTab: (tab: ITab) => {
    set(({ tabs }) => {
      const existingTabIndex = tabs.findIndex(t => t.urlPath === tab.urlPath);
      if (existingTabIndex !== -1) {
        tabs[existingTabIndex] = tab;
      } else {
        tabs.push(tab);
      }

      return { tabs: [...tabs] };
    });
  },
  deleteTab: (urlPath: string, navigate: NavigateFunction) => {
    set(({ tabs }) => {
      const filteredTabs = tabs.filter(t => t.urlPath !== urlPath && t.realUrl !== urlPath);
      const updatedTabs = filteredTabs.length ? [...filteredTabs] : [DefaultTab];
      const currUrlPath = window.location.pathname.replace(/\d+/, '');
      const goToTab = urlPath === currUrlPath ? updatedTabs[updatedTabs.length - 1] : null;

      if (goToTab) {
        navigate(goToTab.realUrl, { replace: true });
      }

      return { tabs: updatedTabs };
    });
  },
}));

const TabList = [
  { title: '수강신청', urlPath: '/simulation' },
  { title: '수강신청 결과', urlPath: '/simulation/logs' },
  { title: '상세 결과', urlPath: '/simulation/logs/' },
  { title: '관심과목 담기', urlPath: '/simulation/interest' },
  { title: '수강신청 관리', urlPath: '/simulation/admin' },
];

const DefaultTab = {
  ...TabList[0],
  realUrl: TabList[0].urlPath,
};

export function useSimulationTab() {
  const navigate = useNavigate();
  const location = useLocation() as unknown as Location;
  const tabs = useTabStore(state => state.tabs);
  const setTab = useTabStore(state => state.setTab);

  // 초기 탭 설정
  useEffect(() => {
    if (tabs.length === 0) {
      const newTab = getTab(location);

      setTab(newTab);
      navigate(newTab.realUrl);
    }
  }, [tabs]);

  // 현재 URL에 맞는 탭 추가 및 업데이트
  useEffect(() => {
    setTab(getTab(location));
  }, [location.pathname]);
}

function getTab(currLocation: Location) {
  const path = currLocation.pathname.replace(/\d+/, '');

  return {
    title: TabList.find(tab => tab.urlPath === path)?.title || '알 수 없는 탭',
    urlPath: path,
    realUrl: currLocation.pathname,
  };
}

export default useTabStore;
