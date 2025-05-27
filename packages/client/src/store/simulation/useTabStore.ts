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

const useTabStore = create<IUseTabStore>((set, get) => ({
  tabs: [],
  setTab: (tab: ITab) => {
    const { tabs } = get();
    const existingTabIndex = tabs.findIndex(t => t.urlPath === tab.urlPath);
    if (existingTabIndex !== -1) {
      tabs[existingTabIndex] = tab;
    } else {
      tabs.push(tab);
    }

    set({ tabs: [...tabs] });
  },
  deleteTab: (urlPath: string, navigate: NavigateFunction) => {
    // Fixme: CANT DELETE TAB
    const { tabs } = get();
    const filteredTabs = tabs.filter(t => t.urlPath !== urlPath && t.realUrl !== urlPath);
    const updatedTabs = filteredTabs.length ? filteredTabs : [DefaultTab];
    navigate(updatedTabs[updatedTabs.length - 1].realUrl);

    set({ tabs: updatedTabs });
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

  useEffect(() => {
    if (tabs.length === 0) {
      setTab(DefaultTab);
      navigate(DefaultTab.realUrl);
    }
  }, [tabs]);

  useEffect(() => {
    const path = location.pathname.replace(/[0-9]+/, '');
    console.log('useSimulTab', path, location.pathname);

    setTab({
      title: TabList.find(tab => tab.urlPath === path)?.title || '알 수 없는 탭',
      urlPath: path,
      realUrl: location.pathname,
    });
  }, [location]);
}

export default useTabStore;
