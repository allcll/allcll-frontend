import { NavLink } from 'react-router-dom';
import { NotificationFilledIcon } from '@allcll/allcll-ui';

function GotoLive() {
  return (
    <NavLink
      to="/live"
      state={{ openSearch: true }}
      className="inline-flex items-center gap-2 rounded-md border border-blue-500 px-3 py-2 text-sm text-blue-500 hover:bg-blue-50"
    >
      <NotificationFilledIcon className="text-blue-500" />
      알림등록하러가기
    </NavLink>
  );
}

export default GotoLive;
