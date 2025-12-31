import React, { useRef, useState, useEffect, useMemo } from 'react';
import EyeGray from '@/assets/eye-gray.svg?react';
import EyeDeleteGray from '@/assets/eye-delete-gray.svg?react';

interface Item {
  title: string; // Assuming title is unique
  visible: boolean;
}

type Props<T extends Item> = {
  initialItems: T[];
  onChange?: (items: T[]) => void;
};

export default function DraggableList<T extends Item>({ initialItems, onChange }: Props<T>) {
  const [items, setItems] = useState(initialItems);
  const containerRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [focusedItemTitle, setFocusedItemTitle] = useState<string | null>(null);

  // Ref to hold drag-specific data that doesn't need to trigger re-renders
  const dragMetaRef = useRef<{
    currentIndex: number;
    height: number;
    offsetY: number;
    containerRect: DOMRect;
  } | null>(null);

  // State for the item being dragged (its data) and its initial index
  const [draggedItemInfo, setDraggedItemInfo] = useState<{ item: T; initialIndex: number } | null>(null);

  // State for the floating preview's style
  const [draggingStyle, setDraggingStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    onChange?.(items);
  }, [items, onChange]);

  useEffect(() => {
    if (focusedItemTitle) {
      const newIndex = items.findIndex(item => item.title === focusedItemTitle);
      if (newIndex !== -1) {
        itemRefs.current[newIndex]?.focus();
      }
      setFocusedItemTitle(null);
    }
  }, [items, focusedItemTitle]);

  useEffect(() => {
    const recalc = () => requestAnimationFrame(recalcPositions);
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('scroll', recalc, true);
    window.addEventListener('resize', recalc);

    recalc();

    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', recalc, true);
      window.removeEventListener('resize', recalc);
    };
  }, []);

  function onVisibleChange(index: number) {
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], visible: !next[index].visible };
      return next;
    });
  }

  const positionsRef = useRef<number[]>([]);
  function recalcPositions() {
    const container = containerRef.current;
    if (!container) return;

    const els = Array.from(container.children) as HTMLElement[];
    positionsRef.current = els.map(el => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2;
    });
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();

      const fromIndex = index;
      let toIndex: number;

      if (e.key === 'ArrowUp') {
        if (fromIndex === 0) return;
        toIndex = fromIndex - 1;
      } else {
        // ArrowDown
        if (fromIndex === items.length - 1) return;
        toIndex = fromIndex + 1;
      }

      const movedItemTitle = items[fromIndex].title;

      setItems(prev => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });

      setFocusedItemTitle(movedItemTitle);
    }
  }

  function startDrag(e: React.PointerEvent, index: number) {
    if (!containerRef.current) return;

    const target = (e.target as HTMLElement).closest('.draggable-item') as HTMLElement;
    if (!target) return;

    (e.target as Element).setPointerCapture(e.pointerId);

    const rect = target.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    dragMetaRef.current = {
      currentIndex: index,
      height: rect.height,
      offsetY: e.clientY - rect.top,
      containerRect,
    };

    setDraggedItemInfo({ item: items[index], initialIndex: index });

    setDraggingStyle({
      width: rect.width,
      left: rect.left,
      top: rect.top,
      position: 'fixed',
      zIndex: 50,
      pointerEvents: 'none',
      transition: 'none',
    });

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp, { once: true });
  }

  function onPointerMove(e: PointerEvent) {
    if (dragMetaRef.current === null) return;

    const { height, offsetY, containerRect } = dragMetaRef.current;
    let newTop = e.clientY - offsetY;

    newTop = Math.max(containerRect.top, newTop);
    newTop = Math.min(containerRect.bottom - height, newTop);

    setDraggingStyle(s => ({ ...(s || {}), top: newTop }));

    recalcPositions();
    const currentHoverY = e.clientY;
    const centers = positionsRef.current;
    let hoverIndex = centers.findIndex(c => currentHoverY < c);
    if (hoverIndex === -1) hoverIndex = items.length;

    const fromIndex = dragMetaRef.current.currentIndex;
    let toIndex = Math.max(0, Math.min(items.length - 1, hoverIndex > fromIndex ? hoverIndex - 1 : hoverIndex));

    if (toIndex !== fromIndex) {
      dragMetaRef.current.currentIndex = toIndex;
      setItems(prev => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    }
  }

  function onPointerUp() {
    window.removeEventListener('pointermove', onPointerMove);
    dragMetaRef.current = null;
    setDraggedItemInfo(null);
    setDraggingStyle(null);
  }

  const currentDraggingIndex = useMemo(() => {
    if (!draggedItemInfo) return -1;
    // Find the current index of the dragged item in the (potentially reordered) items array
    return items.findIndex(it => it.title === draggedItemInfo.item.title);
  }, [items, draggedItemInfo]);

  function getTransform(index: number): string {
    if (!draggedItemInfo || !dragMetaRef.current || currentDraggingIndex === -1) return '';

    const from = currentDraggingIndex;
    const to = dragMetaRef.current.currentIndex;
    const height = dragMetaRef.current.height;

    if (index === from) return ''; // The dragged item itself doesn't transform

    if (from < to) {
      // dragging down
      if (index > from && index <= to) return `translateY(-${height}px)`;
    } else {
      // dragging up
      if (index >= to && index < from) return `translateY(${height}px)`;
    }

    return '';
  }

  return (
    <>
      <ul ref={containerRef} className="bg-white divide-y divide-gray-100 relative">
        {items.map((it, i) => (
          <li
            key={it.title}
            ref={el => {
              itemRefs.current[i] = el;
            }}
            className="draggable-item flex items-center gap-2 rounded-md px-2 transition-transform duration-1000"
            tabIndex={0}
            onKeyDown={e => handleKeyDown(e, i)}
            style={{
              transform: getTransform(i),
              opacity: currentDraggingIndex === i ? 0.4 : 1,
            }}
          >
            <button
              className="p-1 text-gray-500 hover:text-gray-700 cursor-grab"
              onPointerDown={e => startDrag(e, i)}
              aria-label={`Drag ${it.title}`}
              title="드래그 시작"
            >
              ⠿
            </button>
            <div className="flex items-center justify-between flex-auto">
              <span className="font-medium">{it.title}</span>
              <button
                className="p-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label={it.visible ? '숨기기' : '보이기'}
                title={it.visible ? '숨기기' : '보이기'}
                onClick={() => onVisibleChange(i)}
              >
                {it.visible ? <EyeGray className="w-4 h-4" /> : <EyeDeleteGray className="w-4 h-4" />}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {draggingStyle && draggedItemInfo && (
        <div style={draggingStyle} className="bg-blue-50 rounded-md shadow-lg w-full max-w-lg m-auto px-2">
          <div className="flex items-center gap-2">
            <span className="p-1 text-gray-700">⠿</span>
            <span className="font-medium">{draggedItemInfo.item.title}</span>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">Tip: 항목을 선택한 뒤 ↑/↓ 로 키보드 이동도 가능합니다.</div>
    </>
  );
}
