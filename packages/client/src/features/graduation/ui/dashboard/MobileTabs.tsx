import { useState } from 'react';
import { Tabs } from '@allcll/allcll-ui';

export type TabType = 'major' | 'general' | 'certification';

interface MobileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface TabItem {
  key: TabType;
  label: string;
}

const TABS: TabItem[] = [
  { key: 'major', label: '전공' },
  { key: 'general', label: '교양' },
  { key: 'certification', label: '졸업인증' },
];

function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  return (
    <Tabs fullWidth aria-label="졸업요건 분류" className="mb-6">
      {TABS.map(tab => (
        <Tabs.Tab key={tab.key} selected={activeTab === tab.key} onClick={() => onTabChange(tab.key)}>
          {tab.label}
        </Tabs.Tab>
      ))}
    </Tabs>
  );
}

export function useMobileTabs(initialTab: TabType = 'major') {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  return { activeTab, setActiveTab };
}

export default MobileTabs;
