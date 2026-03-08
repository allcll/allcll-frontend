/**
 * 에러 핸들링 아키텍처 Layer 1~4 수동 테스트 페이지
 * 개발 환경에서만 사용: /error-test
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError, NetworkError } from '@/shared/error/errors';
import { classifyError } from '@/shared/error/errorClassifier';
import { handleApiError } from '@/app/error/handleApiError';

// ────────────────────────────────────────────────────────────────
// 헬퍼
// ────────────────────────────────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 32, padding: 20, border: '1px solid #e5e7eb', borderRadius: 8 }}>
    <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12, color: '#111' }}>{title}</h2>
    {children}
  </section>
);

const Btn = ({
  label,
  onClick,
  color = '#3b82f6',
  warn,
}: {
  label: string;
  onClick: () => void;
  color?: string;
  warn?: boolean;
}) => (
  <button
    onClick={onClick}
    style={{
      marginRight: 8,
      marginBottom: 8,
      padding: '6px 14px',
      background: warn ? '#ef4444' : color,
      color: '#fff',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      fontSize: 13,
    }}
  >
    {label}
  </button>
);

const Tag = ({ type }: { type: string }) => {
  const colors: Record<string, string> = {
    page: '#dc2626',
    action: '#f59e0b',
    feedback: '#10b981',
    silent: '#6b7280',
  };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 4,
        background: colors[type] ?? '#ddd',
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        marginLeft: 6,
      }}
    >
      {type}
    </span>
  );
};

// ────────────────────────────────────────────────────────────────
// Layer 1 — Error 클래스
// ────────────────────────────────────────────────────────────────
function Layer1Section() {
  const show = (err: Error & Record<string, unknown>) => {
    const fields = Object.entries(err)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    alert(`[${err.name}]\nmessage: ${err.message}\n${fields}`);
  };

  return (
    <Section title="Layer 1 — API Error 클래스 (errors.ts)">
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
        인스턴스 생성 후 필드 값을 alert로 확인합니다.
      </p>
      <Btn
        label="ApiError(401, UNAUTHORIZED)"
        onClick={() => show(new ApiError(401, 'UNAUTHORIZED', '인증이 필요합니다') as any)}
      />
      <Btn
        label="ApiError(404, NOT_FOUND)"
        onClick={() => show(new ApiError(404, 'NOT_FOUND', '리소스 없음') as any)}
      />
      <Btn
        label="ApiError(422, DUPLICATE_SCHEDULE, POST)"
        onClick={() => show(new ApiError(422, 'DUPLICATE_SCHEDULE', '중복 수강신청', 'POST') as any)}
      />
      <Btn
        label="ApiError(500, SERVER_ERROR)"
        onClick={() => show(new ApiError(500, 'SERVER_ERROR', '서버 오류') as any)}
      />
      <Btn
        label="NetworkError(기본)"
        color="#8b5cf6"
        onClick={() => show(new NetworkError() as any)}
      />
      <Btn
        label="NetworkError(커스텀 메시지)"
        color="#8b5cf6"
        onClick={() => show(new NetworkError('타임아웃 발생') as any)}
      />
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────
// Layer 2 — classifyError
// ────────────────────────────────────────────────────────────────
const CASES = [
  { label: 'ApiError 401', error: () => new ApiError(401, 'UNAUTHORIZED', 'unauthorized') },
  { label: 'ApiError 403', error: () => new ApiError(403, 'FORBIDDEN', 'forbidden') },
  { label: 'ApiError 404', error: () => new ApiError(404, 'NOT_FOUND', 'not found') },
  { label: 'ApiError 500', error: () => new ApiError(500, 'SERVER_ERROR', 'server error') },
  { label: 'ApiError 422 (4xx 기타)', error: () => new ApiError(422, 'DUPLICATE', 'duplicate') },
  { label: 'ApiError 400 (4xx 기타)', error: () => new ApiError(400, 'BAD_REQUEST', 'bad request') },
  { label: 'NetworkError', error: () => new NetworkError() },
  { label: 'JS Error (runtime)', error: () => new Error('undefined is not a function') },
  { label: 'string throw', error: () => 'unexpected string error' },
];

function Layer2Section() {
  const [results, setResults] = React.useState<Array<{ label: string; type: string }>>([]);

  const runAll = () => {
    setResults(
      CASES.map(({ label, error }) => ({
        label,
        type: classifyError(error()),
      })),
    );
  };

  return (
    <Section title="Layer 2 — classifyError (errorClassifier.ts)">
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
        다양한 에러를 분류 결과를 표로 보여줍니다.
      </p>
      <Btn label="전체 분류 실행" onClick={runAll} color="#0891b2" />
      {results.length > 0 && (
        <table style={{ marginTop: 12, borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '6px 12px', textAlign: 'left', border: '1px solid #e5e7eb' }}>에러</th>
              <th style={{ padding: '6px 12px', textAlign: 'left', border: '1px solid #e5e7eb' }}>
                classifyError 결과
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ label, type }) => (
              <tr key={label}>
                <td style={{ padding: '6px 12px', border: '1px solid #e5e7eb' }}>{label}</td>
                <td style={{ padding: '6px 12px', border: '1px solid #e5e7eb' }}>
                  <Tag type={type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────
// Layer 3 — handleApiError 직접 호출
// ────────────────────────────────────────────────────────────────
function Layer3Section() {
  return (
    <Section title="Layer 3 — handleApiError 직접 호출 (handleApiError.ts)">
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
        기대 동작: <b>feedback/action</b> → Toast 표시 | <b>silent</b> → 아무것도 안 보임 |{' '}
        <b style={{ color: '#dc2626' }}>page → Route ErrorBoundary 이동 (페이지 이탈)</b>
      </p>

      {/* action / feedback → Toast */}
      <Btn
        label="422 → action → Toast"
        color="#f59e0b"
        onClick={() => handleApiError(new ApiError(422, 'DUPLICATE', '중복 수강신청입니다'))}
      />
      <Btn
        label="NetworkError → action → Toast"
        color="#f59e0b"
        onClick={() => handleApiError(new NetworkError())}
      />
      <Btn
        label="JS Error → silent (아무것도 안 보임)"
        color="#6b7280"
        onClick={() => handleApiError(new Error('런타임 에러'))}
      />

      {/* page → throw → ErrorBoundary */}
      <Btn
        label="[페이지 이탈] 401 → page → throw"
        warn
        onClick={() => {
          try {
            handleApiError(new ApiError(401, 'UNAUTHORIZED', '인증이 필요합니다'));
          } catch (e) {
            // Route ErrorBoundary로 전파하려면 실제로 throw 해야 함
            // 여기서 re-throw 하면 ErrorBoundary 없이 콘솔에만 표시됨
            // useMutation 통해 테스트하면 Layer 4에서 확인 가능
            alert(`[page 타입] handleApiError가 throw했습니다.\n실제 Route ErrorBoundary 전파는 Layer 4(useMutation) 버튼으로 확인하세요.\n\n에러: ${(e as Error).message}`);
          }
        }}
      />
      <Btn
        label="[페이지 이탈] 500 → page → throw"
        warn
        onClick={() => {
          try {
            handleApiError(new ApiError(500, 'SERVER_ERROR', '서버 오류'));
          } catch (e) {
            alert(`[page 타입] handleApiError가 throw했습니다.\nLayer 4 버튼으로 실제 페이지 이탈을 확인하세요.\n\n에러: ${(e as Error).message}`);
          }
        }}
      />
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────
// Layer 4 — QueryClient 전역 설정 (useMutation)
// ────────────────────────────────────────────────────────────────
function Layer4MutationSection() {
  const mutation = useMutation({
    mutationFn: async (error: unknown) => {
      throw error;
    },
    // onError 는 QueryClient defaultOptions 에 설정된 handleApiError 가 실행됨
  });

  return (
    <Section title="Layer 4 — useMutation → QueryClient onError → handleApiError">
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
        mutationFn 에서 throw → QueryClient.defaultOptions.mutations.onError → handleApiError 실행
      </p>
      <Btn
        label="422 → action → Toast"
        color="#f59e0b"
        onClick={() => mutation.mutate(new ApiError(422, 'DUPLICATE', '[Mutation] 중복 수강신청'))}
      />
      <Btn
        label="NetworkError → action → Toast"
        color="#f59e0b"
        onClick={() => mutation.mutate(new NetworkError())}
      />
      <Btn
        label="[페이지 이탈] 404 → page → Route ErrorBoundary"
        warn
        onClick={() => mutation.mutate(new ApiError(404, 'NOT_FOUND', '[Mutation] 리소스 없음'))}
      />
      <Btn
        label="[페이지 이탈] 500 → page → Route ErrorBoundary"
        warn
        onClick={() => mutation.mutate(new ApiError(500, 'SERVER_ERROR', '[Mutation] 서버 오류'))}
      />
      {mutation.isError && (
        <p style={{ marginTop: 8, fontSize: 12, color: '#dc2626' }}>
          mutation.isError = true (에러 발생 확인)
        </p>
      )}
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────
// Layer 4 — QueryClient 전역 설정 (useQuery retry / throwOnError)
// ────────────────────────────────────────────────────────────────
type QueryCase = {
  label: string;
  error: ApiError | NetworkError;
  expectThrow: boolean;
  expectRetry: boolean;
};

const QUERY_CASES: QueryCase[] = [
  {
    label: 'ApiError 404 → throwOnError: true / retry: false',
    error: new ApiError(404, 'NOT_FOUND', '404'),
    expectThrow: true,
    expectRetry: false,
  },
  {
    label: 'ApiError 401 → throwOnError: true / retry: false',
    error: new ApiError(401, 'UNAUTH', '401'),
    expectThrow: true,
    expectRetry: false,
  },
  {
    label: 'ApiError 422 → throwOnError: false / retry: false (4xx)',
    error: new ApiError(422, 'DUP', '422'),
    expectThrow: false,
    expectRetry: false,
  },
  {
    label: 'ApiError 500 → throwOnError: true / retry: 최대 2회',
    error: new ApiError(500, 'SERVER', '500'),
    expectThrow: true,
    expectRetry: true,
  },
  {
    label: 'NetworkError → throwOnError: false / retry: 최대 2회',
    error: new NetworkError(),
    expectThrow: false,
    expectRetry: true,
  },
];

function QueryCaseRow({ queryCase }: { queryCase: QueryCase }) {
  const [enabled, setEnabled] = React.useState(false);

  const query = useQuery({
    queryKey: ['error-test', queryCase.label],
    queryFn: async () => {
      throw queryCase.error;
    },
    enabled,
    retry: false, // Layer 4 retry 동작은 아래 별도 섹션에서 확인
    throwOnError: (error) =>
      error instanceof ApiError && [401, 403, 404, 500, 502, 503].includes((error as ApiError).status),
  });

  return (
    <tr>
      <td style={{ padding: '6px 12px', border: '1px solid #e5e7eb', fontSize: 12 }}>
        {queryCase.label}
      </td>
      <td style={{ padding: '6px 12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
        <Tag type={queryCase.expectThrow ? 'page' : 'action'} />
      </td>
      <td style={{ padding: '6px 12px', border: '1px solid #e5e7eb', textAlign: 'center', fontSize: 12 }}>
        {queryCase.expectRetry ? 'O' : 'X'}
      </td>
      <td style={{ padding: '6px 12px', border: '1px solid #e5e7eb' }}>
        <button
          onClick={() => setEnabled(true)}
          style={{
            padding: '4px 10px',
            background: queryCase.expectThrow ? '#ef4444' : '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          {queryCase.expectThrow ? '트리거 (페이지 이탈)' : '트리거'}
        </button>
      </td>
      <td style={{ padding: '6px 12px', border: '1px solid #e5e7eb', fontSize: 12, color: '#6b7280' }}>
        {query.status === 'pending' && enabled ? '로딩 중...' : ''}
        {query.status === 'error' ? `에러 (isError: true)` : ''}
      </td>
    </tr>
  );
}

function Layer4QuerySection() {
  return (
    <Section title="Layer 4 — useQuery throwOnError / retry 설정 확인">
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
        <b style={{ color: '#dc2626' }}>빨간 버튼</b>은 Route ErrorBoundary로 이동합니다.
        파란 버튼은 화면에 남아 있어야 정상입니다.
      </p>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ padding: '6px 12px', textAlign: 'left', border: '1px solid #e5e7eb' }}>케이스</th>
            <th style={{ padding: '6px 12px', border: '1px solid #e5e7eb' }}>throwOnError</th>
            <th style={{ padding: '6px 12px', border: '1px solid #e5e7eb' }}>retry</th>
            <th style={{ padding: '6px 12px', border: '1px solid #e5e7eb' }}>실행</th>
            <th style={{ padding: '6px 12px', border: '1px solid #e5e7eb' }}>상태</th>
          </tr>
        </thead>
        <tbody>
          {QUERY_CASES.map((c) => (
            <QueryCaseRow key={c.label} queryCase={c} />
          ))}
        </tbody>
      </table>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────
import React from 'react';

export default function ErrorTest() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>
        에러 핸들링 아키텍처 테스트
      </h1>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 28 }}>
        Layer 1 ~ 4 수동 확인용 페이지 · 개발 환경 전용
      </p>

      <Layer1Section />
      <Layer2Section />
      <Layer3Section />
      <Layer4MutationSection />
      <Layer4QuerySection />
    </div>
  );
}
