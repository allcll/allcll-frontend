import React, { useRef, useState, useEffect } from 'react';
import EyeGray from '@/assets/eye-gray.svg?react';
import EyeDeleteGray from '@/assets/eye-delete-gray.svg?react';

interface Item {
  title: string;
  visible: boolean;
}

type Props<T extends Item> = {
  initialItems: T[];
  onChange?: (items: T[]) => void;
};

export default function DraggableList<T extends Item>({ initialItems, onChange }: Props<T>) {
  const [items, setItems] = useState(initialItems);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const draggingRef = useRef<{ index: number; height: number } | null>(null);
  const [draggingIndex /*setDraggingIndex*/] = useState<number | null>(null);
  const [draggingStyle /*setDraggingStyle*/] = useState<React.CSSProperties | null>(null);
  const positionsRef = useRef<number[]>([]); // center Y positions of items

  useEffect(() => {
    onChange?.(items);
  }, [items, onChange]);

  useEffect(() => {
    // recalc item positions whenever items change
    recalcPositions();
    // window resize -> recalc
    const ro = new ResizeObserver(recalcPositions);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('scroll', recalcPositions, true);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', recalcPositions, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function onVisibleChange(index: number) {
    setItems(prev => {
      const next = prev.slice();
      next[index] = { ...next[index], visible: !next[index].visible };
      return next;
    });
    // recalc positions after visibility change
    requestAnimationFrame(recalcPositions);
  }

  function recalcPositions() {
    const container = containerRef.current;
    if (!container) return;
    const els = Array.from(container.children) as HTMLElement[];
    positionsRef.current = els.map(el => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 + window.scrollY;
    });
  }

  // function startDrag(e: React.PointerEvent, index: number) {
  //   (e.target as Element).setPointerCapture(e.pointerId);
  //   const target = (e.target as HTMLElement).closest('.draggable-item') as HTMLElement;
  //   if (!target) return;
  //   const rect = target.getBoundingClientRect();
  //   draggingRef.current = { index, height: rect.height };
  //   setDraggingIndex(index);
  //   setDraggingStyle({
  //     width: rect.width,
  //     left: rect.left,
  //     top: rect.top + window.scrollY,
  //     position: 'absolute',
  //     zIndex: 50,
  //     pointerEvents: 'none',
  //   });
  //
  //   // listen globally for move/up
  //   window.addEventListener('pointermove', onPointerMove);
  //   window.addEventListener('pointerup', onPointerUp);
  // }

  // function onPointerMove(e: PointerEvent) {
  //   if (draggingRef.current == null) return;
  //   const y = e.clientY + window.scrollY;
  //   setDraggingStyle(s => ({ ...(s || {}), top: y - draggingRef.current!.height / 2 }));
  //
  //   // find hovered index by comparing center positions
  //   const centers = positionsRef.current;
  //   let hoverIndex = centers.findIndex(c => y < c);
  //   if (hoverIndex === -1) hoverIndex = centers.length - 1;
  //   const from = draggingRef.current.index;
  //   const to = hoverIndex;
  //   if (to !== from) {
  //     setItems(prev => {
  //       const next = prev.slice();
  //       const [moved] = next.splice(from, 1);
  //       next.splice(to, 0, moved);
  //       // update draggingRef index
  //       draggingRef.current = { ...draggingRef.current!, index: to };
  //       // update stored positions after DOM updates (next tick)
  //       requestAnimationFrame(recalcPositions);
  //       return next;
  //     });
  //   }
  // }

  // function onPointerUp(/*e: PointerEvent*/) {
  //   window.removeEventListener('pointermove', onPointerMove);
  //   window.removeEventListener('pointerup', onPointerUp);
  //   draggingRef.current = null;
  //   setDraggingIndex(null);
  //   setDraggingStyle(null);
  // }

  // keyboard reorder support: move item up/down with Ctrl+ArrowUp/Down when focused
  function onKey(e: React.KeyboardEvent, index: number) {
    if (e.ctrlKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setItems(prev => {
        const next = prev.slice();
        const to = e.key === 'ArrowUp' ? Math.max(0, index - 1) : Math.min(next.length - 1, index + 1);
        if (to === index) return prev;
        const [moved] = next.splice(index, 1);
        next.splice(to, 0, moved);
        requestAnimationFrame(recalcPositions);
        return next;
      });
    }
  }

  return (
    <>
      <div ref={containerRef} className="bg-white divide-y divide-gray-100">
        {items.map((it, i) => (
          <div
            key={it + '-' + i}
            className={`draggable-item flex items-center justify-between rounded-md px-2 transition-transform duration-200 ease`}
            tabIndex={0}
            onKeyDown={e => onKey(e, i)}
          >
            <div className="flex items-center gap-2">
              {/*<button*/}
              {/*  className="p-1 text-gray-500 hover:text-gray-700"*/}
              {/*  onPointerDown={e => startDrag(e, i)}*/}
              {/*  aria-label={`Drag ${it.title}`}*/}
              {/*  title="드래그 시작"*/}
              {/*>*/}
              {/*  ⠿*/}
              {/*</button>*/}
              <button
                className="p-1 text-gray-500 hover:text-gray-700"
                aria-label={it.visible ? '숨기기' : '보이기'}
                title={it.visible ? '숨기기' : '보이기'}
                onClick={() => onVisibleChange(i)}
              >
                {it.visible ? <EyeGray className="w-4 h-4" /> : <EyeDeleteGray className="w-4 h-4" />}
              </button>
            </div>
            <div className="font-medium">{it.title}</div>
          </div>
        ))}
      </div>

      {/* floating drag preview */}
      {draggingStyle && (
        <div
          style={draggingStyle}
          className="pointer-events-none bg-blue-50 rounded-md shadow-lg w-full max-w-lg m-auto px-2"
        >
          <div className="flex items-center justify-between">
            <span className="p-1 text-gray-700">⠿</span>
            <div className="font-medium">{items[draggingIndex ?? 0].title}</div>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">Tip: 보이는 테이블의 정보를 수정할 수 있습니다.</div>
      {/*<div className="mt-4 text-sm text-gray-500">Tip: 항목을 선택한 뒤 Ctrl + ↑/↓ 로 키보드 이동도 가능합니다.</div>*/}
    </>
  );
}
