import {Link} from 'react-router-dom';

function AlarmBanner() {
  return (
    <>
      알림이 울리지 않나요? &nbsp;
      <Link to="/faq" className="text-blue-500 underline hover:text-blue-600">문제 해결하기</Link>
    </>
  );
}

export default AlarmBanner;