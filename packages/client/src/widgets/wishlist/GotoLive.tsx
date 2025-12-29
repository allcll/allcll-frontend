import { NavLink } from 'react-router-dom';
import AlarmIcon from '@/shared/ui/svgs/AlarmIcon.tsx';

function GotoLive() {
  return (
    <NavLink
      to="/live"
      state={{ openSearch: true }}
      className="inline-flex items-center gap-2 rounded-md border border-blue-500 px-3 py-2 text-sm text-blue-500 hover:bg-blue-50"
    >
      <AlarmIcon />
      알림등록하러가기
    </NavLink>
  );
}

export default GotoLive;