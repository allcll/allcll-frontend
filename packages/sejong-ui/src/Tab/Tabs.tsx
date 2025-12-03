import { useTabsContext } from './TabContext';
import TabItem from './TabItem.tsx';

function Tabs() {
  const { tabs, deleteTab } = useTabsContext();

  return (
    <div className="flex border-b border-neutral-300 bg-gray-100 text-sm h-12">
      {tabs.map(tab => (
        <TabItem key={tab.urlPath} tab={tab} onDelete={deleteTab} />
      ))}
    </div>
  );
}

export default Tabs;
