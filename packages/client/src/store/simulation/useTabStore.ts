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
      const goToTab = urlPath === window.location.pathname ? updatedTabs[updatedTabs.length - 1] : null;

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
  const location = useLocation();
  const tabs = useTabStore(state => state.tabs);
  const setTab = useTabStore(state => state.setTab);

  // 초기 탭 설정
  useEffect(() => {
    if (tabs.length === 0) {
      setTab(DefaultTab);
      navigate(DefaultTab.realUrl);
    }
  }, [tabs]);

  // 현재 URL에 맞는 탭 추가 및 업데이트
  useEffect(() => {
    const path = location.pathname.replace(/[0-9]+/, '');

    setTab({
      title: TabList.find(tab => tab.urlPath === path)?.title || '알 수 없는 탭',
      urlPath: path,
      realUrl: location.pathname,
    });
  }, [location.pathname]);
}

export default useTabStore;
