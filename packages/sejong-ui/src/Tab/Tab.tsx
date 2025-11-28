import { type ITab, TabsProvider } from './TabContext.tsx';
import Tabs from './Tabs.tsx';

interface ITabProps {
  tabList: Omit<ITab, 'realUrl'>[];
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
