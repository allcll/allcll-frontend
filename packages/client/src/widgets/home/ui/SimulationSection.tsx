import Section from '@/widgets/home/ui/Section.tsx';
import SectionHeader from '@/widgets/home/ui/SectionHeader.tsx';
import RadarChart from '@/widgets/simulation/detail/RadarChart.tsx';
import React, { ButtonHTMLAttributes, useEffect, useRef, useState } from 'react';
import { drawCaptcha } from '@/features/simulation/lib/captcha.ts';
import Card from '@common/components/Card.tsx';
import SejongUI from '../../../../../sejong-ui';
import { Heading, SupportingText } from '@allcll/allcll-ui';

const InitRadarData = {
  user_ability: {
    searchBtnSpeed: 1.076296,
    totalSpeed: 6.70268,
    accuracy: 98.58,
    captchaSpeed: 4.843947,
  },
};

function SimulationSection() {
  const [radarData, setRadarData] = useState(InitRadarData);

  return (
    <Section>
      <SectionHeader
        title="세종대 수강신청 연습 (올클연습)"
        subtitle="세종대 수강신청 연습 부터, 결과 분석까지 한 번에"
        href="/simulation"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <Heading level={3}>수강 신청 연습</Heading>
          <SupportingText>실제 수강신청과 동일한 환경에서 수강 신청 연습을 해보세요.</SupportingText>

          <CaptchaInput setRadarData={setRadarData} />
        </Card>
        <Card className="relative">
          <Heading level={3}>연습 결과 분석</Heading>
          <SupportingText>연습 결과를 분석하여 더 나은 전략을 세워보세요.</SupportingText>
          <RadarChart result={radarData} />
        </Card>
      </div>
    </Section>
  );
}

function generateNumericText() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
const CAPTCHA_LENGTH = 4;

function CaptchaInput({
  setRadarData,
}: Readonly<{ setRadarData?: React.Dispatch<React.SetStateAction<typeof InitRadarData>> }>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [captchaInput, setCaptchaInput] = useState<string | number>();
  const [infoMessage, setInfoMessage] = useState({ message: '', color: 'red' });
  const codeRef = useRef<string>('');

  const captchaResult = useCaptchaResult(setRadarData);

  function resetCaptcha() {
    codeRef.current = generateNumericText();
    setCaptchaInput('');
    setInfoMessage({ message: '', color: 'red' });

    captchaResult.resetResult();

    if (canvasRef.current) {
      drawCaptcha(canvasRef.current, codeRef.current);
    }
  }

  function handleRefreshCaptcha() {
    setTimeout(resetCaptcha, 200);
  }

  function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    let inputValue = event.target.value;

    captchaResult.updateResult();

    if (/\D/.test(inputValue)) {
      setInfoMessage({ message: '0~9까지의 숫자만 입력해주세요', color: 'red' });
      setCaptchaInput(inputValue.replace(/\D/g, ''));
      return;
    }

    if (inputValue.length > CAPTCHA_LENGTH) {
      setInfoMessage({ message: '4자리까지 입력 가능합니다', color: 'red' });
      return;
    }

    setCaptchaInput(inputValue);
    setInfoMessage({ message: '', color: 'red' });
  }

  // init captcha
  useEffect(() => {
    setTimeout(() => {
      codeRef.current = generateNumericText();
      captchaResult.initResult();

      if (canvasRef.current) {
        drawCaptcha(canvasRef.current, codeRef.current);
      }
    }, 100);
  }, []);

  function handleConfirmCaptcha() {
    const RESET_TIME = 700;
    if (captchaInput?.toString() === codeRef.current) {
      setInfoMessage({ message: '캡차가 성공적으로 입력되었습니다.', color: 'green' });
      captchaResult.endResult(true);
      setTimeout(resetCaptcha, RESET_TIME);
    } else {
      setInfoMessage({ message: '캡차 입력이 잘못되었습니다.', color: 'red' });
      captchaResult.endResult(false);
      setTimeout(resetCaptcha, RESET_TIME);
    }
  }

  return (
    <div className="flex flex-col justify-center h-4/5">
      <div className="grid grid-cols-2 gap-4 mt-4 p-4">
        <div className="flex flex-col">
          <div className="text-sm font-semibold flex flex-row items-center gap-2">
            <span className="inline-block w-1.5 h-5 bg-blue-500 mr-2 "></span>생성된 코드
            <SmallButton onClick={handleRefreshCaptcha}>재생성</SmallButton>
          </div>

          <div className="flex items-center mt-1">
            <canvas id="captcha" width="105" height="50" ref={canvasRef} />
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold  flex flex-row items-center">
            <span className="inline-block w-1.5 h-5 bg-blue-500 mr-2 "></span>생성된 코드 입력
          </div>
          <SejongUI.Input
            value={captchaInput}
            className="mt-2 w-full"
            onChange={e => handleChangeInput(e)}
            placeholder="코드를 입력하세요"
            essential
          />
          <span className={'pl-1 text-xs ' + (infoMessage.color === 'green' ? 'text-green-500' : 'text-red-500')}>
            {infoMessage.message}
          </span>
        </div>
      </div>

      <div className="flex justify-end p-4">
        <button
          onClick={handleConfirmCaptcha}
          className="px-4 py-2 bg-white hover:bg-blue-50 rounded-xs border cursor-pointer"
        >
          코드입력
        </button>
      </div>
    </div>
  );
}

function SmallButton({ className, children, ...props }: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={'px-2 py-1 bg-blue-500 text-white text-sm rounded-xs cursor-pointer hover:bg-blue-600 ' + className}
      {...props}
    >
      {children}
    </button>
  );
}

function useCaptchaResult(setRadarData?: React.Dispatch<React.SetStateAction<typeof InitRadarData>>) {
  const captchaResult = useRef({
    tryCount: 0,
    successCount: 0,
    avgTime: 0,
    startTime: -1,
  });

  function initResult() {
    captchaResult.current.startTime = -1;
  }

  function resetResult() {
    captchaResult.current.startTime = Date.now();
  }

  function updateResult() {
    if (captchaResult.current.startTime === -1) {
      captchaResult.current.startTime = Date.now();
    }
  }

  function endResult(success: boolean) {
    const endTime = Date.now();
    const elapsedTime =
      captchaResult.current.startTime === -1 ? 4.843947 : 1 + (endTime - captchaResult.current.startTime) / 1000;

    captchaResult.current.startTime = -1;

    captchaResult.current.tryCount += 1;
    captchaResult.current.avgTime = 1 + (elapsedTime - captchaResult.current.avgTime) / captchaResult.current.tryCount;

    captchaResult.current.successCount += success ? 1 : 0;

    if (setRadarData)
      setRadarData(prevData => ({
        user_ability: {
          ...prevData.user_ability,
          captchaSpeed: captchaResult.current.avgTime,
          accuracy: 100 * (captchaResult.current.successCount / captchaResult.current.tryCount),
        },
      }));
  }

  return {
    initResult,
    resetResult,
    updateResult,
    endResult,
  };
}

export default SimulationSection;
