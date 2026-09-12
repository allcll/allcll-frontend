import { NavLink } from 'react-router-dom';
import { NotificationFilledIcon } from '@allcll/allcll-ui';

function GotoLive() {
  return (
    <NavLink
      to="/live"
      state={{ openSearch: true }}
      className="inline-flex items-center gap-2 rounded-md border border-blue-500 px-3 py-2 text-sm text-blue-500 hover:bg-blue-50"
    >
      <NotificationFilledIcon className="w-4 h-4 text-blue-500" />
      알림 등록하러 가기
    </NavLink>
  );
}

export default GotoLive;
