import { type ITab, TabsProvider } from './TabContext.tsx';
import Tabs from './Tabs.tsx';

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
