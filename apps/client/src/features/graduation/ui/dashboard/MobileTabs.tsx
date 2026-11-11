import { useState } from 'react';
import { Tabs } from '@allcll/allcll-ui';

export type TabType = 'major' | 'general' | 'certification';

interface TabItem {
  key: TabType;
  label: string;
}

const TABS: TabItem[] = [
  { key: 'major', label: '전공' },
  { key: 'general', label: '교양' },
  { key: 'certification', label: '졸업인증' },
];

function MobileTabs() {
  return (
    <Tabs.List fullWidth aria-label="졸업요건 분류" className="mb-6">
      {TABS.map(tab => (
        <Tabs.Tab key={tab.key} value={tab.key}>
          {tab.label}
        </Tabs.Tab>
      ))}
    </Tabs.List>
  );
}

export function useMobileTabs(initialTab: TabType = 'major') {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  return { activeTab, setActiveTab };
}

export default MobileTabs;
