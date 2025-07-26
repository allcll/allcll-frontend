import { test, expect } from '@playwright/test';
import { getTestEnv } from '../fixtures/testEnv';

test.skip('알림 과목', () => {
  test.beforeEach(async ({ page }) => {
    const { targetUrl } = await getTestEnv();
    await page.goto(targetUrl + '/live/search');
  });

  test('여석 알림 과목 6개 추가', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('알림 과목은 최대 5개까지만 가능합니다.');
      await dialog.accept();
    });

    const alarms = page.getByLabel('알림 과목 등록');
    for (const index of [0, 0, 0, 0, 0]) {
      await alarms.nth(index).click();
    }

    const last = alarms.first();
    await last.click();

    await expect(last).toHaveAttribute('aria-label', '알림 과목 등록');
  });

  test('여석 알림 과목 5개 추가 시, 추가 UI 없어짐 확인', async ({ page }) => {
    const alarms = page.getByLabel('알림 과목 등록');
    for (const index of [0, 0, 0, 0, 0]) {
      await alarms.nth(index).click();
    }

    await page.getByRole('link', { name: '실시간' }).first().click();

    await expect(page.getByRole('link', { name: '여석 알림 과목 추가' })).not.toBeVisible();
  });

  test('알림 과목 필터 설정', async ({ page }) => {
    const alarms = page.getByLabel('알림 과목 등록');
    for (const index of [0, 0, 0, 0, 0]) {
      await alarms.nth(index).click();
    }

    await page.getByRole('button', { name: '알림과목' }).click();

    const selected = page.getByLabel('알림 과목 해제');
    await expect(selected).toHaveCount(5);
  });
});

test.skip('실시간 교양 과목', () => {
  test.beforeEach(async ({ page }) => {
    const { targetUrl } = await getTestEnv();
    await page.goto(targetUrl + '/live');
  });

  test('실시간 교양 과목 추가', async ({ page }) => {
    const tr = page.getByRole('row').locator('div').first();
    await expect(tr).toBeVisible();
  });

  test('SSE 오류 시, 재연결 확인 및 UI 확인', async ({ page }) => {
    let errorCount = 0;

    await page.route(/connect$/, route => {
      errorCount++;
      route.abort();
    });
    await page.reload();
    await page.waitForTimeout(8000); // SSE 연결 대기

    const refreshButton = page.getByRole('button', { name: '새로고침' });
    await expect(refreshButton).toBeVisible();
    expect(errorCount).toBeGreaterThan(3);

    // 새로고침 버튼 클릭 시, SSE 재연결 확인
    errorCount = 0;
    await refreshButton.click();
    await page.waitForTimeout(8000); // SSE 재연결 대기

    await expect(refreshButton).toBeVisible();
    expect(errorCount).toBeGreaterThan(3);
  });
});
