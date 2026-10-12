import { TextLink } from '@allcll/allcll-ui';
import { Link } from 'react-router-dom';

function AlarmBanner() {
  return (
    <>
      알림이 울리지 않나요? &nbsp;
      <TextLink asChild>
        <Link to="/faq#0">문제 해결하기</Link>
      </TextLink>
    </>
  );
}

export default AlarmBanner;
