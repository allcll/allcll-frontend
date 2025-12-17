/**
 * FSD_TODO: feature, widget 분리 필요
 */
import { useEffect, useState } from 'react';
import Modal from '@common/components/modal/Modal.tsx';
import ModalHeader from '../../../components/sejongUI/modal/ModalHeader.tsx';
import useNotificationInstruction from '../model/useNotificationInstruction.ts';
import SiteOptionIcon from '@/assets/chrome-options.svg?react';

// --- OS/Browser Detection Utilities ---

const getBrowserName = (): 'chrome' | 'firefox' | 'safari' | 'edge' => {
  if (typeof navigator === 'undefined') return 'chrome';
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes('firefox')) return 'firefox';
  if (ua.includes('edg')) return 'edge';
  if (ua.includes('safari') && !ua.includes('chrome')) return 'safari';
  return 'chrome';
};

const getOSName = (): 'macos' | 'windows' | 'mobile' => {
  if (typeof navigator === 'undefined') return 'macos';
  const platform = navigator.platform.toLowerCase();
  const ua = navigator.userAgent.toLowerCase();

  if (platform.startsWith('mac') || ua.includes('mac os x')) return 'macos';
  if (platform.startsWith('win')) return 'windows';
  if (/android|iphone|ipad|ipod/.test(ua)) return 'mobile';
  return 'macos'; // Default fallback
};

// --- Main Component ---

function NotificationInstructionsModal() {
  const isOpen = useNotificationInstruction(state => state.isOpen);
  const onClose = useNotificationInstruction(state => state.close);
  const [page, setPage] = useState(0);
  const lastPage = 1;

  useEffect(() => {
    if (!isOpen) setPage(0);
  }, [isOpen]);

  return !isOpen ? null : (
    <Modal onClose={onClose}>
      <ModalHeader title="알림 설정 방법" onClose={onClose} />
      <div className="p-4 text-sm text-gray-700 w-lg max-w-full">
        {page === 0 && <BrowserPermissionGuide />}
        {page === 1 && <SystemPermissionGuide />}

        <div className="flex justify-between items-center mt-6">
          <span className="text-xs text-gray-500">
            {page + 1} / {lastPage + 1}
          </span>
          <div className="flex justify-end gap-2">
            {page > 0 && (
              <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setPage(page - 1)}>
                이전
              </button>
            )}
            {page < lastPage && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setPage(page + 1)}
              >
                다음
              </button>
            )}
            {page === lastPage && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={onClose}>
                닫기
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// --- Page Components ---

function BrowserPermissionGuide() {
  const [browser, setBrowser] = useState<string>(getBrowserName());

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-base text-gray-800">1단계: 브라우저 알림 권한 설정</h3>
        <p className="mt-1">브라우저에서 'ALLCLL' 사이트의 알림을 허용해야 합니다.</p>
      </div>

      <div className="flex border-b border-gray-500">
        <TabButton name="Chrome" id="chrome" selected={browser} onClick={setBrowser} />
        <TabButton name="Firefox" id="firefox" selected={browser} onClick={setBrowser} />
        <TabButton name="Safari" id="safari" selected={browser} onClick={setBrowser} />
        <TabButton name="Edge" id="edge" selected={browser} onClick={setBrowser} />
      </div>

      <div className="p-2 bg-gray-50 rounded-md h-64 overflow-y-auto">
        {browser === 'chrome' && <ChromeGuide />}
        {browser === 'firefox' && <FirefoxGuide />}
        {browser === 'safari' && <SafariGuide />}
        {browser === 'edge' && <EdgeGuide />}
      </div>
    </div>
  );
}

function SystemPermissionGuide() {
  const [os, setOs] = useState<string>(getOSName());

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-base text-gray-800">2단계: OS 및 모바일 기기 설정</h3>
        <p className="mt-1">일부 기기에서는 OS의 알림도 허용해야 합니다.</p>
      </div>

      <div className="flex border-b border-gray-500">
        <TabButton name="macOS" id="macos" selected={os} onClick={setOs} />
        <TabButton name="Windows" id="windows" selected={os} onClick={setOs} />
        <TabButton name="모바일" id="mobile" selected={os} onClick={setOs} />
      </div>

      <div className="p-2 bg-gray-50 rounded-md h-64 overflow-y-auto">
        {os === 'macos' && <MacGuide />}
        {os === 'windows' && <WindowsGuide />}
        {os === 'mobile' && <MobileGuide />}
      </div>
    </div>
  );
}

// --- Helper Components ---

const TabButton = ({
  name,
  id,
  selected,
  onClick,
}: {
  name: string;
  id: string;
  selected: string;
  onClick: (id: string) => void;
}) => (
  <button
    className={`px-4 py-2 text-sm ${selected === id ? 'border-b-2 border-blue-500 text-blue-600 font-semibold' : 'text-gray-500 font-medium'}`}
    onClick={() => onClick(id)}
  >
    {name}
  </button>
);

const GuideStep = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <h4 className="font-semibold text-gray-800">{title}</h4>
    <div className="pl-2 space-y-1 text-gray-600">{children}</div>
  </div>
);

// --- Browser Guides ---

const ChromeGuide = () => (
  <div className="space-y-3">
    <GuideStep title="방법 1: 주소창에서 설정 (권장)">
      <ol className="list-decimal list-inside">
        <li>
          주소창 왼쪽의 사이트 정보 보기(
          <SiteOptionIcon className="inline-block w-4 h-4" />) 아이콘을 클릭합니다.
        </li>
        <li>나타나는 메뉴에서 '알림' 항목의 스위치를 켜서 '허용'으로 변경합니다.</li>
      </ol>
    </GuideStep>
    <GuideStep title="방법 2: 브라우저 설정 메뉴">
      <ol className="list-decimal list-inside">
        <li>오른쪽 위 점 3개(⋮) 메뉴 &gt; '설정'으로 이동합니다.</li>
        <li>'개인정보 및 보안' &gt; '사이트 설정' &gt; '알림'으로 이동합니다.</li>
        <li>'알림 전송이 허용됨' 섹션에서 '추가' 버튼을 누르고 'allcll.com'을 입력합니다.</li>
      </ol>
    </GuideStep>
  </div>
);

const EdgeGuide = () => (
  <div className="space-y-3">
    <GuideStep title="방법 1: 주소창에서 설정 (권장)">
      <ol className="list-decimal list-inside">
        <li>주소창 왼쪽의 자물쇠(🔒) 아이콘을 클릭합니다.</li>
        <li>'이 사이트에 대한 권한' 메뉴에서 '알림'을 '허용'으로 변경합니다.</li>
      </ol>
    </GuideStep>
    <GuideStep title="방법 2: 브라우저 설정 메뉴">
      <ol className="list-decimal list-inside">
        <li>오른쪽 위 점 3개(⋯) 메뉴 &gt; '설정'으로 이동합니다.</li>
        <li>'쿠키 및 사이트 권한' &gt; '알림'으로 이동합니다.</li>
        <li>'허용' 섹션에서 '추가' 버튼을 누르고 'allcll.com'을 입력합니다.</li>
      </ol>
    </GuideStep>
  </div>
);

const FirefoxGuide = () => (
  <div className="space-y-3">
    <GuideStep title="방법 1: 주소창에서 설정 (권장)">
      <ol className="list-decimal list-inside">
        <li>주소창 왼쪽의 자물쇠(🔒) 아이콘을 클릭합니다.</li>
        <li>'알림 보내기' 권한을 '허용'으로 변경합니다.</li>
      </ol>
    </GuideStep>
    <GuideStep title="방법 2: 브라우저 설정 메뉴">
      <ol className="list-decimal list-inside">
        <li>오른쪽 위 줄 3개(≡) 메뉴 &gt; '설정'으로 이동합니다.</li>
        <li>'개인정보 및 보안' 패널에서 '권한' 섹션으로 스크롤합니다.</li>
        <li>'알림' 옆의 '설정...' 버튼을 클릭합니다.</li>
        <li>'allcll.com'을 찾아 상태를 '허용'으로 변경하고 '변경 내용 저장'을 누릅니다.</li>
      </ol>
    </GuideStep>
  </div>
);

const SafariGuide = () => (
  <div className="space-y-3">
    <GuideStep title="Safari 설정에서 변경">
      <ol className="list-decimal list-inside">
        <li>화면 상단 메뉴 막대에서 'Safari' &gt; '설정...' (또는 '환경설정...')으로 이동합니다.</li>
        <li>'웹사이트' 탭을 클릭합니다.</li>
        <li>왼쪽 메뉴에서 '알림'을 선택합니다.</li>
        <li>목록에서 'allcll.com'을 찾아 권한을 '허용'으로 변경합니다.</li>
      </ol>
    </GuideStep>
  </div>
);

// --- OS Guides ---

const MacGuide = () => (
  <div className="space-y-2">
    <ol className="list-decimal list-inside pl-2 mt-2 space-y-1">
      <li>화면 좌측 상단 애플 로고() 클릭 후 '시스템 설정'으로 이동합니다.</li>
      <li>왼쪽 메뉴에서 '알림'을 선택합니다.</li>
      <li>앱 목록에서 사용 중인 브라우저(Chrome, Safari 등)를 찾아 선택합니다.</li>
      <li>'알림 허용' 옵션을 활성화합니다.</li>
    </ol>
  </div>
);

const WindowsGuide = () => (
  <div className="space-y-2">
    <ol className="list-decimal list-inside pl-2 mt-2 space-y-1">
      <li>'시작' 메뉴에서 '설정'으로 이동합니다.</li>
      <li>'시스템'을 선택한 후 '알림' 탭으로 이동합니다.</li>
      <li>'앱 및 다른 보낸사람의 알림 받기'가 켜져 있는지 확인합니다.</li>
      <li>아래 앱 목록에서 사용 중인 브라우저를 찾아 알림을 켭니다.</li>
    </ol>
  </div>
);

const MobileGuide = () => (
  <div className="pl-2 mt-2 space-y-2">
    <p>
      모바일 브라우저는 PC와 알림 동작 방식이 다르고 제약이 있을 수 있습니다. 특히 iOS의 Safari는 웹 표준 알림을
      지원하지 않습니다.
    </p>
    <p className="font-medium">
      따라서 모바일 환경에서는 사이트 내에서 직접 보여주는 '토스트 알림' 사용을 적극 권장합니다.
    </p>
  </div>
);

export default NotificationInstructionsModal;
