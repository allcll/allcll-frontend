import { useEffect, useMemo, useState } from 'react';
import { CrawlersParams, useCrawlersDepartments } from '@/hooks/server/crawlers/useDepartmentCrawlers';
import { useSubjectsCrawlers } from '@/hooks/server/crawlers/useSubjectCrawlers';
import { Button, Card, Flex, Label, SupportingText } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';
import { useCrawlersPreseat } from '@/hooks/server/crawlers/usePreseatCrawlers';
import { useCrawlersBasket } from '@/hooks/server/crawlers/useBasketCrawlers';
import { useCheckAdminSession } from '@/hooks/server/session/useAdminSession';
import { useSemester } from '@/hooks/server/service/useSemester';
import { getSessionConfig } from '@/utils/sessionConfig';

type crawlerType = 'department' | 'subject' | 'pre-seat' | 'basket';

const FIRST_CRAWLED_YEAR = 2025;

const SEMESTER_OPTIONS = [
  { code: '10', label: '1학기 본학기', season: 'SPRING' },
  { code: '11', label: '여름학기', season: 'SUMMER' },
  { code: '20', label: '2학기 본학기', season: 'FALL' },
  { code: '21', label: '겨울학기', season: 'WINTER' },
];

function CrawlerControlComponent() {
  const { mutate: crawlersDepartments } = useCrawlersDepartments();
  const { mutate: crawlersSubjects } = useSubjectsCrawlers();
  const { mutate: crawlersPreseat } = useCrawlersPreseat();
  const { mutate: crawlersBasket } = useCrawlersBasket();

  const { data: semester } = useSemester();
  const { data: sessionStatus } = useCheckAdminSession();
  const [crawlersParams, setCrawlersParams] = useState<CrawlersParams>({
    userId: getSessionConfig()?.userId ?? '',
    year: '',
    semesterCode: '',
  });

  const [season, shortYear] = semester?.semesterCode?.split('_') ?? [];
  const currentYear = shortYear ? String(2000 + Number(shortYear)) : '';
  const currentSemesterCode = SEMESTER_OPTIONS.find(option => option.season === season)?.code ?? '';

  const yearOptions = useMemo(() => {
    const parsedYear = Number(currentYear);
    const baseYear = Number.isFinite(parsedYear) ? parsedYear : new Date().getFullYear();
    const lastYear = Math.max(baseYear + 1, FIRST_CRAWLED_YEAR);

    return Array.from({ length: lastYear - FIRST_CRAWLED_YEAR + 1 }, (_, index) => String(lastYear - index));
  }, [currentYear]);

  // 비어 있는 항목만 현재 학기 정보로 채움, 직접 고른 값은 덮어쓰지 않도록 구성
  useEffect(() => {
    if (!currentSemesterCode) {
      return;
    }

    setCrawlersParams(prev => ({
      ...prev,
      year: prev.year || currentYear,
      semesterCode: prev.semesterCode || currentSemesterCode,
    }));
  }, [currentYear, currentSemesterCode]);

  // 크롤링은 인증정보가 등록된 학번으로만 가능하므로 서버 재시작 등으로 사라진 학번은 선택 해제
  useEffect(() => {
    if (!sessionStatus) {
      return;
    }

    setCrawlersParams(prev =>
      sessionStatus.some(({ userId }) => userId === prev.userId) ? prev : { ...prev, userId: '' },
    );
  }, [sessionStatus]);

  const setParam = (key: keyof CrawlersParams, value: string) => {
    setCrawlersParams(prev => ({ ...prev, [key]: value }));
  };

  const validParamsForm = (type: crawlerType) => {
    if (!crawlersParams.userId) {
      alert('userId를 선택해주세요.');
      return false;
    }

    const needsSemester = type === 'department' || type === 'subject';

    if (needsSemester && (!crawlersParams.year || !crawlersParams.semesterCode)) {
      alert('year와 semesterCode를 모두 선택해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = (type: crawlerType) => {
    if (type === 'department' && validParamsForm('department')) {
      crawlersDepartments(crawlersParams);
    } else if (type === 'subject' && validParamsForm('subject')) {
      crawlersSubjects(crawlersParams);
    } else if (type === 'pre-seat' && validParamsForm('pre-seat')) {
      crawlersPreseat({ userId: crawlersParams.userId });
    } else if (type === 'basket' && validParamsForm('basket')) {
      crawlersBasket({ userId: crawlersParams.userId });
    }
  };

  return (
    <section>
      <Card>
        <SectionHeader
          title="크롤링 제어"
          description="모든 크롤링을 실행합니다. 학과, 과목데이터: userId, year, semesterCode필수, PreSeat, Basket 데이터: userId 필수"
        />

        <Flex direction="flex-col" gap="gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ParamSelect
              id="userId"
              value={crawlersParams.userId}
              onChange={value => setParam('userId', value)}
              disabled={!sessionStatus?.length}
              placeholder="학번을 선택해주세요"
              description={
                sessionStatus?.length
                  ? '인증정보가 등록된 학번만 선택할 수 있습니다.'
                  : '등록된 인증정보가 없습니다. 인증정보 설정을 먼저 진행해주세요.'
              }
            >
              {sessionStatus?.map(({ userId, isActive }) => (
                <option key={userId} value={userId}>
                  {userId} {isActive ? '(갱신 중)' : ''}
                </option>
              ))}
            </ParamSelect>

            <ParamSelect
              id="year"
              value={crawlersParams.year}
              onChange={value => setParam('year', value)}
              placeholder="연도를 선택해주세요"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </ParamSelect>

            <ParamSelect
              id="semesterCode"
              value={crawlersParams.semesterCode}
              onChange={value => setParam('semesterCode', value)}
              placeholder="학기를 선택해주세요"
              description={semester?.semesterValue && `현재 학기: ${semester.semesterValue}`}
            >
              {SEMESTER_OPTIONS.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label} ({code})
                </option>
              ))}
            </ParamSelect>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outlined" size="medium" onClick={() => handleSubmit('department')}>
              학과 데이터 크롤링
            </Button>

            <Button variant="outlined" size="medium" onClick={() => handleSubmit('subject')}>
              과목 데이터 크롤링
            </Button>

            <Button variant="outlined" size="medium" onClick={() => handleSubmit('pre-seat')}>
              PreSeat 데이터 크롤링
            </Button>

            <Button variant="outlined" size="medium" onClick={() => handleSubmit('basket')}>
              Basket 데이터 크롤링
            </Button>
          </div>
        </Flex>
      </Card>
    </section>
  );
}

interface IParamSelect {
  id: keyof CrawlersParams;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  description?: string | false;
  children: React.ReactNode;
}

function ParamSelect({ id, value, onChange, placeholder, disabled, description, children }: IParamSelect) {
  return (
    <Flex direction="flex-col" gap="gap-1.5">
      <Label htmlFor={id} required>
        {id}
      </Label>

      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="w-full p-2 rounded-md bg-white border border-gray-400 text-sm text-gray-900 disabled:bg-gray-100"
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {children}
      </select>

      {description && <SupportingText>{description}</SupportingText>}
    </Flex>
  );
}

export default CrawlerControlComponent;
