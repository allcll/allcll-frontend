import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface ITab {
  title: string;
  urlPath: string;
  realUrl: string;
}

interface ITabContext {
  tabs: ITab[];
  setTab: (tab: ITab) => void;
  deleteTab: (urlPath: string) => void;
}

const TabContext = createContext<ITabContext | null>(null);

export function useTabsContext() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabsContext must be used within a TabsProvider');
  }
  return context;
}

interface TabsProviderProps {
  tabList: Omit<ITab, 'realUrl'>[];
  initialTabs?: ITab[];
  children: ReactNode;
}

export function TabsProvider({ tabList, initialTabs = [], children }: TabsProviderProps) {
  const [tabs, setTabs] = useState<ITab[]>(initialTabs);
  const navigate = useNavigate();
  const location = useLocation() as unknown as Location;

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

  function getTab(currLocation: Location) {
    const path = currLocation.pathname.replace(/\d+/, '');

    return {
      title: tabList.find(tab => tab.urlPath === path)?.title || '알 수 없는 탭',
      urlPath: path,
      realUrl: currLocation.pathname,
    };
  }

  const setTab = (tab: ITab) => {
    setTabs(prevTabs => {
      const existingTabIndex = prevTabs.findIndex(t => t.urlPath === tab.urlPath);

      if (existingTabIndex === -1) {
        return [...prevTabs, tab];
      }

      const updatedTabs = [...prevTabs];
      updatedTabs[existingTabIndex] = tab;
      return updatedTabs;
    });
  };

  const deleteTab = (urlPath: string) => {
    setTabs(prevTabs => {
      const tabToDelete = prevTabs.find(tab => tab.urlPath === urlPath);
      if (!tabToDelete) return prevTabs;

      const newTabs = prevTabs.filter(tab => tab.urlPath !== urlPath);

      // If the currently active tab is deleted, navigate to the last remaining tab or home
      if (window.location.pathname.includes(tabToDelete.realUrl)) {
        const lastTab = newTabs[newTabs.length - 1];
        navigate(lastTab ? lastTab.realUrl : '/');
      }

      return newTabs;
    });
  };

  return <TabContext.Provider value={{ tabs, setTab, deleteTab }}>{children}</TabContext.Provider>;
}
