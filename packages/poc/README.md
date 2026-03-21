# 📊 Chart Library Bundle Size POC

`react-chartjs-2` / `chart.js`를 대체할 차트 라이브러리를 비교하는 POC (Proof of Concept)입니다.

## 비교 대상

| 라이브러리                   | 방식     | 특징                                 |
| ---------------------------- | -------- | ------------------------------------ |
| `@allcll/chart` (커스텀 SVG) | SVG      | 외부 의존성 없음, 필요한 기능만 구현 |
| `uplot-react`                | Canvas   | 초고속 렌더링, 시계열 데이터 특화    |
| `visx` (@visx/\*)            | SVG + d3 | 저수준 컴포넌트, 완전한 커스터마이징 |

## 번들 크기 측정 결과

Vite의 `manualChunks`로 각 라이브러리를 별도 청크로 분리하여 측정 (React 제외)

```
dist/assets/chart-custom-*.js    5.80 kB │ gzip:  2.24 kB  ✅ 가장 가벼움
dist/assets/chart-uplot-*.css    1.65 kB │ gzip:  0.71 kB
dist/assets/chart-uplot-*.js    55.76 kB │ gzip: 24.73 kB
dist/assets/chart-visx-*.js     77.24 kB │ gzip: 27.33 kB
dist/assets/vendor-react-*.js  143.57 kB │ gzip: 45.99 kB  (참고용: React 기본 비용)
```

## 구현된 차트

| 차트 타입            | @allcll/chart |    uplot-react     | visx |
| -------------------- | :-----------: | :----------------: | :--: |
| BarChart (막대)      |      ✅       |         ✅         |  ✅  |
| DoughnutChart (도넛) |      ✅       |         ❌         |  ✅  |
| RadarChart (레이더)  |      ✅       | ❌ (라인으로 대체) |  ✅  |
| MixedChart (혼합)    |      ✅       |         △          |  ✅  |

## 결론

### 현재 프로젝트 권장: `@allcll/chart` (커스텀 SVG)

- **가장 가벼움**: 2.24 kB gzip (chart.js 대비 **~97% 절감**)
- visx 대비 **~92% 절감** (27.33 kB → 2.24 kB)
- uplot 대비 **~91% 절감** (25.44 kB → 2.24 kB)
- 외부 의존성 없음, 필요한 차트만 구현

### uplot-react를 선택해야 하는 경우

- 시뮬레이션 결과처럼 **수천~수만 건의 연속 데이터**를 실시간으로 렌더링해야 할 때
- Canvas 기반으로 SVG보다 **훨씬 빠른 렌더링** 성능 제공
- 단, 도넛/파이/레이더 차트는 직접 구현해야 함

### visx를 선택해야 하는 경우

- **d3 수준의 복잡한 커스텀 시각화**가 필요한 경우
- 트리쉐이킹을 통해 사용하는 컴포넌트만 포함 가능
- 가장 유연하지만 가장 무거움

## POC 실행 방법

```bash
# 루트에서
pnpm --filter @allcll/poc dev

# 빌드 (번들 분석 포함)
pnpm --filter @allcll/poc build

# 번들 분석 report.html 열기
open packages/poc/dist/report.html
```
