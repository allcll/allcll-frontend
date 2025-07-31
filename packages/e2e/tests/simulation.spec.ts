import { test, expect, Page } from '@playwright/test';
import { getTestEnv } from '../fixtures/testEnv';

const SUBJECT_COUNT = 5;

async function startSimulation(page: Page) {
  const { targetUrl } = await getTestEnv();

  await page.goto(targetUrl + '/simulation', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  await page.getByRole('checkbox', { name: '수강 신청 과목을 확인하였습니다' }).check();
  await page.getByRole('button', { name: '시작하기' }).click({ delay: 300 });
  await page.getByRole('button', { name: '검색' }).click({ delay: 500 });
}

async function fillCaptchaAndConfirm(page: Page, code: string) {
  await page.getByRole('textbox', { name: '코드를 입력하세요' }).click();
  await page.getByRole('textbox', { name: '코드를 입력하세요' }).fill(code);
  await page.getByRole('button', { name: '코드입력' }).click();
  await page.getByRole('button', { name: '확인' }).click();
}

async function applyWithCaptcha(page: Page, index: number) {
  await page.getByRole('button', { name: '신청', exact: true }).nth(index).click({ delay: 300 });
  await page.getByRole('textbox', { name: '코드를 입력하세요' }).click();
  await page.getByRole('textbox', { name: '코드를 입력하세요' }).fill('1234');

  //캡차 입력 할 때까지 대기
  await page.waitForTimeout(300);

  await page.getByRole('button', { name: '코드입력' }).click();
  await page.getByRole('button', { name: '확인' }).click();

  //모달 뜰 때까지 대기
  await page.waitForTimeout(300);
  const failedModal = await page.getByText('수강 여석이 없습니다!', { exact: false });
  const doubledModal = await page.getByText('이미 수강신청 된 과목입니다!', { exact: false });

  if ((await failedModal.isVisible().catch(() => false)) || (await doubledModal.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: '확인' }).click({ delay: 300, timeout: 500 });
  } else {
    await page.getByRole('button', { name: '취소' }).click({ delay: 300, timeout: 500 });
  }
}

async function expectVisibleModal(page: Page, text: string) {
  const modalText = page.getByText(text, { exact: false });
  await expect(modalText).toBeVisible();
}

test.describe('수강신청 시뮬레이션 예외 상황', () => {
  //테스트 시작전 설정
  test.beforeEach(async ({ context, page }) => {
    await context.addInitScript({ path: './preload.js' });
    await startSimulation(page);
  });

  test('과목 재신청 시 이미 수강신청 된 과목 모달을 띄웁니다.', async ({ page }) => {
    await applyWithCaptcha(page, 0);

    await page.getByRole('button', { name: '신청', exact: true }).nth(0).click();
    await fillCaptchaAndConfirm(page, '1234');

    await expectVisibleModal(page, '이미 수강신청 된 과목입니다!');
  });

  test('캡챠 잘못된 입력 모달 띄우기', async ({ page }) => {
    await page.getByRole('button', { name: '신청', exact: true }).nth(0).click();
    await fillCaptchaAndConfirm(page, '0000');

    await expectVisibleModal(page, '입력하신 코드가 일치하지 않습니다');
  });

  test('재조회시 새로고침', async ({ page }) => {
    await page.getByRole('button', { name: '신청', exact: true }).nth(0).click();
    await fillCaptchaAndConfirm(page, '1234');

    await page.getByRole('button', { name: '확인' }).click();

    await page.getByRole('button', { name: '검색' }).click();
    await expectVisibleModal(page, '서비스 접속대기 중입니다.');
  });
});

test.describe('수강신청 시뮬레이션 전체 흐름', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addInitScript({ path: './preload.js' });
    await startSimulation(page);
  });

  test('수강신청 전체 과정을 시뮬레이션 합니다.', async ({ page }) => {
    for (let i = 0; i < SUBJECT_COUNT; i++) {
      await applyWithCaptcha(page, i);
    }

    await expectVisibleModal(page, '수강 신청 성공!');
  });

  test('이미 신청한 과목 재신청 시에도 수강신청이 정상적으로 끝납니다.', async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      await applyWithCaptcha(page, i);
    }

    for (let i = 0; i < 2; i++) {
      await applyWithCaptcha(page, i);
    }

    for (let i = 2; i < SUBJECT_COUNT; i++) {
      await applyWithCaptcha(page, i);
    }

    await expectVisibleModal(page, '수강 신청 성공!');
  });
});
