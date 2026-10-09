/**
 * 점프 게임의 색상. 평소에는 흑백이고, 엔딩을 본 적이 있으면 컬러로 바뀝니다.
 *
 * 하늘과 땅은 두 모드가 같은 색을 씁니다. 종탑의 창과 입구는 하늘색으로 메워 뚫린 것처럼 보이게 한 것이라,
 * 하늘색을 바꾸면 창만 어긋나기 때문입니다.
 */
export const PALETTE = {
  mono: {
    /** 캐릭터는 색을 따로 정하지 않고, 흑백 필터를 걷어내 CI 본래 색으로 돌아옵니다. */
    characterFilter: 'grayscale(1) contrast(1.5)',
    cloud: 'text-gray-300',
    obstacle: 'text-gray-600',
    tower: 'text-gray-600',
  },
  color: {
    characterFilter: 'none',
    cloud: 'text-primary-200',
    obstacle: 'text-green-600',
    tower: 'text-stone-500',
  },
} as const;
