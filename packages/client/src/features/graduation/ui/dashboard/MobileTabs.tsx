import { useState } from 'react';
import { Flex } from '@allcll/allcll-ui';

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
    <Flex className="border-b border-gray-200 mb-6">
      {TABS.map(tab => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === tab.key ? 'text-primary-500' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />}
        </button>
      ))}
    </Flex>
  );
}

export function useMobileTabs(initialTab: TabType = 'major') {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  return { activeTab, setActiveTab };
}

export default MobileTabs;
