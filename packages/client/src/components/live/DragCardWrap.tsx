// import React from 'react';
// import { useDrag, useDrop } from 'react-dnd';
//
// const ItemType = 'CARD';
//
// interface CardWrapProps {
//   id: string;
//   index: number;
//   moveCard: (dragIndex: number, hoverIndex: number) => void;
//   children: React.ReactNode;
// }
//
// const DragCardWrap = ({ id, index, moveCard, children }: CardWrapProps) => {
//   const ref = React.useRef<HTMLDivElement>(null);
//
//   const [, drop] = useDrop({
//     accept: ItemType,
//     hover(item: { id: string; index: number }) {
//       if (!ref.current) {
//         return;
//       }
//       const dragIndex = item.index;
//       const hoverIndex = index;
//
//       if (dragIndex === hoverIndex) {
//         return;
//       }
//
//       moveCard(dragIndex, hoverIndex);
//       item.index = hoverIndex;
//     },
//   });
//
//   const [{ isDragging }, drag, preview] = useDrag({
//     type: ItemType,
//     item: { id, index },
//     collect: monitor => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });
//
//   drag(drop(ref));
//
//   return (
//     <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
//       <div ref={preview}>
//         <button ref={drag} style={{ cursor: 'move' }}>
//           Drag
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };
//
// export default DragCardWrap;
