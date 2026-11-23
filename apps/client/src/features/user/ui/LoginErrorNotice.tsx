import { Button, Flex, WarningIcon, SupportingText } from '@allcll/allcll-ui';
import type { ILoginErrorView } from '../lib/loginErrors.ts';

interface ILoginErrorNoticeProps {
  view: ILoginErrorView;
  /** 입력칸이 aria-describedby 로 가리키는 설명 문단의 id 입니다. */
  descriptionId: string;
}

// 글자는 대비 4.5, 아이콘은 3 을 넘는 단계를 골랐습니다.
const TONE_STYLE = {
  error: {
    box: 'bg-danger-subtle border-danger-200 dark:border-danger-500/40',
    icon: 'text-danger-700 dark:text-danger-400',
    title: 'text-danger-700 dark:text-danger-400',
    buttonColor: 'danger',
  },
  neutral: {
    box: 'bg-surface-subtle border-line',
    icon: 'text-fg-secondary',
    title: 'text-fg',
    buttonColor: 'primary',
  },
} as const;

/** 토스트와 달리 사라지지 않고 폼 안에 남는 에러 안내입니다. */
function LoginErrorNotice({ view, descriptionId }: ILoginErrorNoticeProps) {
  const tone = TONE_STYLE[view.tone];

  // role="alert" 는 LoginForm 의 상시 컨테이너가 들고 있습니다.
  return (
    <Flex align="start" gap={2} className={`rounded-md border p-3 ${tone.box}`}>
      {/* 뜻은 문구가 전달하므로 읽지 않습니다. */}
      <WarningIcon aria-hidden="true" className={`w-4 h-4 mt-0.5 shrink-0 ${tone.icon}`} />

      <Flex direction="column" gap={1} className="min-w-0 flex-1">
        <p className={`text-sm font-semibold break-keep ${tone.title}`}>{view.title}</p>

        <SupportingText id={descriptionId} className="break-keep">
          {view.description}
        </SupportingText>

        {view.action && (
          <div className="mt-2">
            <Button asChild variant="solid" color={tone.buttonColor} size="small">
              <a
                href={view.action.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${view.action.label} (새 창)`}
              >
                {view.action.label}
              </a>
            </Button>
          </div>
        )}
      </Flex>
    </Flex>
  );
}

export default LoginErrorNotice;
