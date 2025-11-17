import { type ITab, TabsProvider } from '@/Tab/TabContext.tsx';
import Tabs from '@/Tab/Tabs.tsx';

interface ITabProps {
  tabList: ITab[];
  initialTabs?: ITab[];
}

function Tab({ tabList, initialTabs = [] }: ITabProps) {
  return (
    <TabsProvider tabList={tabList} initialTabs={initialTabs}>
      <Tabs />
    </TabsProvider>
  );
}

export default Tab;
