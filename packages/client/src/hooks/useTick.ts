import useTickStore from "@/store/useTickStore.ts";
import {useEffect} from "react";

const useTick = (callback?: () => void) => {
  const tick = useTickStore((state) => state.tick);
  const addRefCount = useTickStore((state) => state.addRefCount);
  const removeRefCount = useTickStore((state) => state.removeRefCount);

  useEffect(() => {
    // if (!enable) return;
    addRefCount();

    return () => {
      removeRefCount();
    }
  }, []);

  useEffect(() => {
    if (callback) callback();
  }, [tick]);
}

export default useTick;