# 📊 @allcll/charts

`@allcll/charts`는 ALLCLL 서비스에서 사용되는 모든 차트 컴포넌트를 정의하는 공유 라이브러리입니다. `chart.js`와 `react-chartjs-2`를 기반으로 하며, 애플리케이션의 번들 사이즈 최적화를 위해 내부적으로 `React.lazy`와 `Suspense`를 활용합니다.

## 🚀 주요 특징

- **Lazy Loading 기본 탑재**: 모든 차트는 지연 로딩 처리되어 메인 번들 사이즈를 줄입니다.
- **자동 스켈레톤(Skeleton) 제공**: 차트 로딩 중에 발생할 수 있는 레이아웃 흔들림(CLS)을 방지합니다.
- **표준화된 API**: 일관된 인터페이스를 제공합니다.

## 📦 패키지 구조

```plaintext
charts/
├── src/
│   ├── components/    # 차트 로직 (Lazy, Suspense 로직 포함)
│   ├── skeletons/     # 로딩 상태 표시용 스켈레톤 UI
│   └── index.ts       # 엔트리 포인트 (Public API)
└── package.json
```

## 🛠 사용 방법

```tsx
import { BarChart } from '@allcll/charts';

function MyPage() {
  return <BarChart data={data} className="w-full" />;
}
```

## ⚙️ 애플리케이션 빌드 설정 (필수)

새로운 애플리케이션(Vite 기반)을 추가할 때, `@allcll/charts` 패키지의 라이브러리 코드를 단일 청크(`vendor-chartjs`)로 묶어 성능을 최적화하려면 각 애플리케이션의 `vite.config.ts`에 아래 설정을 추가하세요.

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // chart.js 라이브러리를 별도 청크로 분리
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'vendor-chartjs';
          }
        },
      },
    },
  },
});
```

## 💡 개발 가이드

- **새로운 차트 추가**: `src/components/`에 차트 구현체를, `src/skeletons/`에 대응되는 스켈레톤을 작성합니다.
- **엔트리 등록**: `src/components/LazyCharts.tsx`에서 `createLazyChart` 팩토리 함수를 사용하여 등록합니다.
- **코드 스플리팅**: 위와 같이 `vite.config.ts`에 `manualChunks` 설정을 추가하면, `@allcll/charts`의 Lazy 컴포넌트 호출 시 라이브러리 파일이 `vendor-chartjs`로 자동 분류됩니다.

## 🤝 기여하기

자세한 내용은 모노레포 루트의 [기여 가이드라인](../../CONTRIBUTING.md)을 참조하세요.
