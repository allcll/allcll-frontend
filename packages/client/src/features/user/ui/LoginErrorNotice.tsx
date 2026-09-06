import { Button, Flex, Heading } from '@allcll/allcll-ui';
import ImportantSvg from '@/assets/important.svg?react';
import { LoginErrorView } from '../lib/loginErrors.ts';

interface ILoginErrorNoticeProps {
  view: LoginErrorView;
  /** 입력칸이 aria-describedby 로 가리키는 설명 문단의 id 입니다. */
  descriptionId: string;
}

// 제목까지 톤 색을 쓰면 대비가 AA 에 못 미쳐, 톤은 배경과 테두리로만 구분합니다.
const TONE_BOX = {
  error: 'bg-secondary-50 border-secondary-200',
  neutral: 'bg-gray-50 border-gray-200',
} as const;

/** 토스트와 달리 사라지지 않고 폼 안에 남는 에러 안내입니다. */
function LoginErrorNotice({ view, descriptionId }: ILoginErrorNoticeProps) {
  // role="alert" 는 LoginForm 의 상시 컨테이너가 들고 있습니다.
  return (
    <div className={`flex items-start gap-2 rounded-md border p-3 ${TONE_BOX[view.tone]}`}>
      {/* 뜻은 문구가 전달하므로 읽지 않습니다. */}
      <ImportantSvg aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />

      <Flex direction="flex-col" gap="gap-1" className="min-w-0 flex-1">
        {/* 카드에 이미 h2 가 있어 문서 개요를 건드리지 않게 p 로 렌더합니다. */}
        <Heading level={4} as="p" className="break-keep">
          {view.title}
        </Heading>

        {/* SupportingText 의 gray-500 은 대비가 4.4 라 gray-600 을 씁니다. */}
        <p id={descriptionId} className="text-sm text-gray-600 leading-relaxed break-keep">
          {view.description}
        </p>

        {/* Button 에 className 을 넘기면 variant 스타일이 지워져 여백은 바깥에서 줍니다. */}
        {view.action && (
          <div className="mt-2">
            <Button asChild variant="primary" size="small">
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
    </div>
  );
}

export default LoginErrorNotice;
