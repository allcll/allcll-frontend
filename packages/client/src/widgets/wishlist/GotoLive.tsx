import { NavLink } from 'react-router-dom';
import { Button, NotificationIcon } from '@allcll/allcll-ui';

function GotoLive() {
  return (
    <Button asChild variant="outlined" color="primary" size="medium" className="w-fit">
      <NavLink to="/live" state={{ openSearch: true }}>
        <NotificationIcon />
        알림 등록하러 가기
      </NavLink>
    </Button>
  );
}

export default GotoLive;
