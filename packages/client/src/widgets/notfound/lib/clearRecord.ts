const CLEAR_STORAGE_KEY = 'allcll-jump-game-cleared';

/**
 * 엔딩 도달 기록입니다. 한 번 클리어하면 이후 플레이부터 흑백이던 화면이 컬러로 바뀝니다.
 * 사파리 시크릿 모드처럼 저장소를 막는 환경에서도 게임은 그대로 동작해야 하므로 예외를 삼킵니다.
 */
export function hasClearRecord(): boolean {
  try {
    return localStorage.getItem(CLEAR_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveClearRecord(): void {
  try {
    localStorage.setItem(CLEAR_STORAGE_KEY, 'true');
  } catch {
    // 기록에 실패해도 이번 판의 진행에는 영향이 없습니다
  }
}
