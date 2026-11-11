import { useEffect, useId, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type HistoryState = Record<string, unknown> | null;

// 닫힌 시트의 방문 기록을 바로 지우지 않고 잠시 둠. 그사이 다른 시트가 열리면 그 기록을 이어서 씀
let pendingRelease: { key: string; timer: ReturnType<typeof setTimeout> } | null = null;

function hasEntry(state: unknown, key: string) {
  return Boolean((state as HistoryState)?.[key]);
}

function currentHistoryHas(key: string) {
  return hasEntry((window.history.state as { usr?: unknown } | null)?.usr, key);
}

/**
 * 시트를 열면 같은 주소로 방문 기록을 하나 추가합니다. 뒤로가기를 누르면 그 기록만 지워지므로 페이지는 그대로 두고 시트를 닫습니다.
 * X나 바깥을 눌러 닫을 때는 추가한 기록을 함께 지워서, 다음 뒤로가기가 바로 이전 페이지로 가게 합니다.
 */
function useCloseBottomSheetOnBackKey(isOpen: boolean, onClose: () => void) {
  const navigate = useNavigate();
  const location = useLocation();
  const key = `sheet${useId()}`;

  const locationRef = useRef(location);
  const onCloseRef = useRef(onClose);
  const ownsEntry = useRef(false);
  const confirmed = useRef(false);

  useEffect(() => {
    locationRef.current = location;
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (hasEntry(location.state, key)) {
      confirmed.current = true;
      return;
    }
    if (!confirmed.current) return;

    confirmed.current = false;
    ownsEntry.current = false;
    onCloseRef.current();
  }, [location, key]);

  useEffect(() => {
    if (!isOpen) return;

    const { pathname, search, hash, state } = locationRef.current;
    const nextState: Record<string, unknown> = { ...((state as HistoryState) ?? {}) };

    if (pendingRelease) {
      clearTimeout(pendingRelease.timer);
      const releasedKey = pendingRelease.key;
      pendingRelease = null;

      if (releasedKey === key) {
        confirmed.current = currentHistoryHas(key);
      } else {
        delete nextState[releasedKey];
        navigate({ pathname, search, hash }, { replace: true, state: { ...nextState, [key]: true } });
      }
    } else {
      navigate({ pathname, search, hash }, { replace: false, state: { ...nextState, [key]: true } });
    }
    ownsEntry.current = true;

    return () => {
      if (!ownsEntry.current) return;
      ownsEntry.current = false;
      confirmed.current = false;

      pendingRelease = {
        key,
        timer: setTimeout(() => {
          pendingRelease = null;
          // 시트가 열린 채 다른 페이지로 이동했으면 그 페이지 기록을 건드리지 않음
          if (currentHistoryHas(key)) window.history.back();
        }, 0),
      };
    };
  }, [isOpen, key, navigate]);
}

export default useCloseBottomSheetOnBackKey;
