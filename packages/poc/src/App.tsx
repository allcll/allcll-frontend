import { useState } from 'react';
import { CustomBar } from './custom/CustomBar';
import { CustomDoughnut } from './custom/CustomDoughnut';
import { CustomRadar } from './custom/CustomRadar';
import { UPlotBar } from './uplot/UPlotBar';
import { UPlotLine } from './uplot/UPlotLine';
import { VisxBar } from './visx/VisxBar';
import { VisxDoughnut } from './visx/VisxDoughnut';
import { VisxRadar } from './visx/VisxRadar';

type Tab = 'custom' | 'uplot' | 'visx';

const TABS: { id: Tab; label: string; color: string }[] = [
  { id: 'custom', label: '① 커스텀 SVG (@allcll/chart)', color: '#6366f1' },
  { id: 'uplot', label: '② uplot-react', color: '#0ea5e9' },
  { id: 'visx', label: '③ visx (@visx/*)', color: '#10b981' },
];

// Bundle size data gathered from `pnpm build` output (gzip)
// Measured with Vite manualChunks splitting (React excluded)
const BUNDLE_SIZES: Record<Tab, { name: string; gzip: string; raw: string; note: string }> = {
  custom: {
    name: 'chart-custom 청크',
    gzip: '2.24 kB',
    raw: '5.80 kB',
    note: '순수 SVG 기반, 외부 의존성 없음. Bar, Doughnut, Radar, Mixed 모두 지원',
  },
  uplot: {
    name: 'chart-uplot 청크',
    gzip: '24.73 kB (+ CSS 0.71 kB)',
    raw: '55.76 kB (+ CSS 1.65 kB)',
    note: 'Canvas 기반 초고속 렌더링. 시계열/라인/바 특화. 레이더·파이 차트 미지원',
  },
  visx: {
    name: 'chart-visx 청크',
    gzip: '27.33 kB',
    raw: '77.24 kB',
    note: 'd3 기반 저수준 컴포넌트. 트리쉐이킹 지원. Bar·Doughnut·Radar 등 모든 차트 구현 가능',
  },
};

const CARD_STYLE: React.CSSProperties = {
  background: 'white',
  borderRadius: 12,
  padding: '20px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#475569',
  textAlign: 'center',
};

export default function App() {
  const [tab, setTab] = useState<Tab>('custom');
  const size = BUNDLE_SIZES[tab];

  return (
    <div style={{ minHeight: '100vh', padding: '24px 16px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>📊 차트 라이브러리 번들 크기 비교 POC</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
        같은 기능을 세 가지 방식으로 구현하고 번들 크기를 비교합니다.
      </p>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              background: tab === t.id ? t.color : '#e2e8f0',
              color: tab === t.id ? 'white' : '#475569',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Bundle size info */}
      <div style={{ background: '#f1f5f9', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 14 }}>
        <div style={{ fontWeight: 700, marginBottom: 6, color: '#1e293b' }}>📦 {size.name}</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <span>
            Raw: <strong>{size.raw}</strong>
          </span>
          <span>
            Gzip: <strong>{size.gzip}</strong>
          </span>
        </div>
        <div style={{ color: '#64748b', marginTop: 6 }}>{size.note}</div>
      </div>

      {/* Charts */}
      {tab === 'custom' && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: '#6366f1' }}>
            커스텀 SVG 차트 (@allcll/chart)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={CARD_STYLE}>
              <div style={LABEL_STYLE}>막대 차트 (BarChart)</div>
              <CustomBar />
            </div>
            <div style={CARD_STYLE}>
              <div style={LABEL_STYLE}>도넛 차트 (DoughnutChart)</div>
              <CustomDoughnut />
            </div>
            <div style={CARD_STYLE}>
              <div style={LABEL_STYLE}>레이더 차트 (RadarChart)</div>
              <CustomRadar />
            </div>
          </div>
        </div>
      )}

      {tab === 'uplot' && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: '#0ea5e9' }}>uplot-react 차트</h2>
          <div
            style={{
              background: '#fef3c7',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: '#92400e',
              marginBottom: 16,
            }}
          >
            ⚠️ uplot은 시계열·라인·면적·막대 차트에 특화되어 있습니다. 도넛/파이/레이더 차트는 기본 지원하지 않습니다.
            대신 라인 차트로 대체합니다.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={CARD_STYLE}>
              <div style={LABEL_STYLE}>막대 차트 (Bar)</div>
              <UPlotBar />
            </div>
            <div style={CARD_STYLE}>
              <div style={LABEL_STYLE}>라인 차트 (Radar 대체)</div>
              <UPlotLine />
            </div>
          </div>
        </div>
      )}

      {tab === 'visx' && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: '#10b981' }}>visx 차트 (@visx/*)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={CARD_STYLE}>
              <div style={LABEL_STYLE}>막대 차트 (VisxBar)</div>
              <VisxBar />
            </div>
            <div style={CARD_STYLE}>
              <div style={LABEL_STYLE}>도넛 차트 (VisxDoughnut)</div>
              <VisxDoughnut />
            </div>
            <div style={CARD_STYLE}>
              <div style={LABEL_STYLE}>레이더 차트 (VisxRadar)</div>
              <VisxRadar />
            </div>
          </div>
        </div>
      )}

      {/* Summary table */}
      <div style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📋 번들 크기 비교 요약</h2>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
              background: 'white',
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                {['라이브러리', '청크 크기 (raw)', '청크 크기 (gzip)', '지원 차트', '특징'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f5f3ff' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>@allcll/chart (커스텀 SVG)</td>
                <td style={{ padding: '10px 14px' }}>5.80 kB</td>
                <td style={{ padding: '10px 14px', fontWeight: 700 }}>2.24 kB ✅</td>
                <td style={{ padding: '10px 14px' }}>Bar, Doughnut, Radar, Mixed</td>
                <td style={{ padding: '10px 14px', color: '#6366f1' }}>
                  외부 의존성 없음. 프로젝트 요구사항에 딱 맞게 구현
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>uplot-react</td>
                <td style={{ padding: '10px 14px' }}>55.76 kB + CSS 1.65 kB</td>
                <td style={{ padding: '10px 14px', fontWeight: 700 }}>24.73 kB + CSS 0.71 kB</td>
                <td style={{ padding: '10px 14px' }}>Line, Bar, Area, Scatter</td>
                <td style={{ padding: '10px 14px', color: '#0ea5e9' }}>
                  Canvas 기반 초고속. 수만 건 데이터도 부드럽게 렌더링. 시계열 특화
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f0fdf4' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>visx (@visx/*)</td>
                <td style={{ padding: '10px 14px' }}>77.24 kB</td>
                <td style={{ padding: '10px 14px', fontWeight: 700 }}>27.33 kB</td>
                <td style={{ padding: '10px 14px' }}>모든 차트 타입</td>
                <td style={{ padding: '10px 14px', color: '#10b981' }}>
                  d3 기반 저수준 컴포넌트. 트리쉐이킹 지원. 완전한 커스터마이징 가능
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Conclusion */}
      <div
        style={{
          marginTop: 24,
          padding: '16px 20px',
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 10 }}>💡 결론 및 권장사항</h3>
        <ul style={{ paddingLeft: 20, color: '#475569' }}>
          <li>
            <strong style={{ color: '#6366f1' }}>커스텀 SVG (@allcll/chart)</strong> — 현재 프로젝트에 가장 적합. 가장
            가볍고 (2.24 kB gzip) 필요한 차트만 구현. 외부 의존성 없음.
          </li>
          <li style={{ marginTop: 6 }}>
            <strong style={{ color: '#0ea5e9' }}>uplot-react (25.44 kB gzip)</strong> — 시뮬레이션 데이터처럼 대용량
            시계열 데이터를 다룰 때 탁월. Canvas 기반으로 수만 건도 부드러움. 단, 도넛/레이더 등 미지원.
          </li>
          <li style={{ marginTop: 6 }}>
            <strong style={{ color: '#10b981' }}>visx (27.33 kB gzip)</strong> — 완전한 커스터마이징이 필요하고 d3 기반
            복잡한 시각화가 필요한 경우. 트리쉐이킹으로 필요한 부분만 포함 가능. Bar·Doughnut·Radar 모두 구현 가능.
          </li>
        </ul>
        <div style={{ marginTop: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 8, color: '#334155' }}>
          <strong>📦 커스텀 SVG (@allcll/chart)의 이점:</strong> chart.js 대비 <strong>~97% 절감</strong>. visx 대비{' '}
          <strong>~92% 절감</strong> (27.33 → 2.24 kB). uplot 대비 <strong>~91% 절감</strong> (25.44 → 2.24 kB).
        </div>
      </div>
    </div>
  );
}
