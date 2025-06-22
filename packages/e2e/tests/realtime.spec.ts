import { test, expect } from '@playwright/test';
import { getTestEnv } from '../fixtures/testEnv';

test('test', async ({ page }) => {
  const { targetUrl } = await getTestEnv();

  await page.goto(targetUrl);

  await page.getByRole('link', { name: '실시간' }).click();
  await page.getByRole('link', { name: '여석 알림 과목 추가' }).click();

  await page.getByRole('row', { name: '알림 과목 등록 009912-001 AI로봇학과 C' }).getByLabel('알림 과목 등록').click();
  await page.getByRole('row', { name: '알림 과목 등록 000304-001 AI' }).getByLabel('알림 과목 등록').click();
  await page.getByRole('row', { name: '알림 과목 등록 000307-001 AI' }).getByLabel('알림 과목 등록').click();
  await page.getByRole('row', { name: '알림 과목 등록 010130-001' }).getByLabel('알림 과목 등록').click();
  await page.getByRole('row', { name: '알림 과목 등록 010093-001' }).getByLabel('알림 과목 등록').click();

  await page.getByRole('navigation').getByRole('link', { name: '실시간' }).click();

  await expect(page.getByRole('link', { name: '여석 알림 과목 추가' })).not.toBeVisible();
});
