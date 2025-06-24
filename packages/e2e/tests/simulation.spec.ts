import { test, expect, Page } from '@playwright/test';
import { getTestEnv } from '../fixtures/testEnv';

const SUBJECT_COUNT = 5;

async function agreeAndStart(page: Page) {
  await page.goto((await getTestEnv()).targetUrl);
  await page.getByRole('link', { name: '수강연습' }).click();
  await page.getByRole('checkbox', { name: '수강 신청 과목을 확인하였습니다' }).check();
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('button', { name: '검색' }).click();
}

async function applyWithCaptcha(page: Page, index: number, code: string) {
  await page.getByRole('button', { name: '신청', exact: true }).nth(index).click();
  await page.getByRole('textbox', { name: '코드를 입력하세요' }).click();
  await page.getByRole('textbox', { name: '코드를 입력하세요' }).fill(code);
  await page.getByRole('button', { name: '코드입력' }).click();

  try {
    await page.getByRole('button', { name: '확인' }).click();
  } catch {}

  const cancelButton = page.getByRole('button', { name: '취소' });
  const confirmButton = page.getByRole('button', { name: '확인' });

  if (await cancelButton.isVisible().catch(() => false)) {
    await cancelButton.click();
  } else if (await confirmButton.isVisible().catch(() => false)) {
    await confirmButton.click();
  }
}

async function expectVisibleText(page: Page, text: string) {
  const modalText = page.getByText(text, { exact: false });
  await expect(modalText).toBeVisible();
}

test.describe('수강신청 시뮬레이션 예외 상황', () => {
  test('과목 재신청 시 이미 수강신청 된 과목 모달을 띄웁니다.', async ({ page }) => {
    await agreeAndStart(page);
    await applyWithCaptcha(page, 0, '1234');
    await applyWithCaptcha(page, 0, '1234');
    await expectVisibleText(page, '이미 수강신청 된 과목입니다!');
  });

  test('캡챠 잘못된 입력 모달 띄우기', async ({ page }) => {
    await agreeAndStart(page);
    await applyWithCaptcha(page, 0, '0000');
    await expectVisibleText(page, '입력하신 코드가 일치하지 않습니다.');
  });

  test('이미 신청한 과목 재신청 시 과목 5개 신청 후 시뮬레이션이 정상적으로 종료된다. ', async ({ page }) => {
    await agreeAndStart(page);

    await applyWithCaptcha(page, 0, '1234');
    await applyWithCaptcha(page, 1, '1234');
    await applyWithCaptcha(page, 2, '1234');

    //이미 신청한 과목 재신청
    await applyWithCaptcha(page, 0, '1234');
    await applyWithCaptcha(page, 1, '1234');

    await applyWithCaptcha(page, 4, '1234');
    await applyWithCaptcha(page, 3, '1234');

    await expectVisibleText(page, '수강 신청 성공!');
  });
});

test.describe('수강신청 시뮬레이션 전체 흐름', () => {
  test('수강신청 전체 과정을 시뮬레이션 합니다.', async ({ page }) => {
    await agreeAndStart(page);

    for (let i = 0; i < SUBJECT_COUNT; i++) {
      await applyWithCaptcha(page, i, '1234');
    }

    await expectVisibleText(page, '수강 신청 성공!');
  });
});
