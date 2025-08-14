import { test as baseTest, Page } from '@playwright/test';

// 차단할 광고 스크립트 URL 패턴 목록
const AD_SCRIPT_URLS: string[] = [
  '**/google_ads.js',
  '**/doubleclick.net/**',
  '**/*partner.googleadservices.com/**',
  '**/*googlesyndication.com/**',
  '**/*google-analytics.com/**',
];

// 기본 test 객체를 확장하여 새로운 test 객체를 정의합니다.
export const test = baseTest.extend<{ page: Page }>({
  // 기존 'page' fixture를 오버라이드(재정의)합니다.
  page: async ({ page }, use) => {
    // 테스트가 실행되기 전에 광고 차단 규칙을 설정합니다.
    await Promise.all(AD_SCRIPT_URLS.map(url => page.route(url, route => route.abort())));

    // 설정이 완료된 page 객체를 테스트에 전달합니다.
    // 'use(page)'가 호출된 시점에 실제 테스트 코드가 실행됩니다.
    await use(page);

    // (선택사항) 테스트가 끝난 후 정리 작업을 할 수 있습니다.
  },
});

export { expect } from '@playwright/test';
