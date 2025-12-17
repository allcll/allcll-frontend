import { Link } from 'react-router-dom';
import HomeSvg from '@/assets/home-white.svg?react';
import { ServiceSemester } from '@/entities/semester/api/useServiceSemester.ts';

interface IServiceClosed {
  data: ServiceSemester;
}

function ServiceClosed({ data }: IServiceClosed) {
  const isSemesterExpired = data.service?.endDate && data.service.endDate < new Date();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <main className="text-center">
        <h1 className="text-3xl mb-4 font-bold text-gray-900">
          {isSemesterExpired ? '수강신청 고생 많으셨습니다' : '서비스 준비중입니다'}
        </h1>
        <p className="text-gray-600 mt-2">
          현재는 서비스를 이용할 수 없습니다
          <br />
          다음 수강신청 기간에 더 나은 서비스로 찾아뵙겠습니다.
        </p>

        <div className="mt-6 bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          {isSemesterExpired ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900">{data.semester} 수강신청이 종료되었습니다</h2>
              <p className="text-gray-600 text-sm mt-1">수강 신청 기간 동안 고생 많으셨습니다</p>
              <p className="text-gray-500 text-sm mt-1">자세한 일정은 추후 공지 예정입니다</p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-900">다음 서비스 기간 안내</h2>
              <p className="text-gray-600 mt-1">{data.semester} 수강신청</p>
              <p className="text-gray-500 text-sm mt-1">
                {data.service?.startDateStr} ~ {data.service?.endDateStr}
              </p>
            </>
          )}

          <hr className="my-4 border-gray-200" />

          <h3 className="text-md font-semibold text-gray-900">문의</h3>
          <p className="text-gray-600 flex items-center justify-center gap-2 mt-2">allcllclla@google.com</p>
          <a
            className="text-gray-600 flex items-center justify-center gap-2 mt-1 hover:text-blue-500 hover:underline"
            href="https://forms.gle/bCDTVujEHunnvHe88"
            target="_blank"
          >
            오류 및 제안
          </a>
          <a
            className="text-gray-600 flex items-center justify-center gap-2 mt-1 hover:text-blue-500 hover:underline"
            href="https://open.kakao.com/o/g3MztXfh"
            target="_blank"
          >
            오픈 채팅
          </a>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            <HomeSvg className="w-4 h-4" />
            메인 페이지로 이동
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ServiceClosed;
