import { useEffect } from "react";
import {PinnedSeats, Wishlist} from '@/utils/types.ts';
import {QueryClient} from '@tanstack/react-query';

// const tableData = [
//   { name: 'Math', seats: 0 },
//   { name: 'Science', seats: 1 },
//   { name: 'History', seats: 0 },
//   { name: 'English', seats: 2 },
// ];

function requestNotificationPermission() {
if (!("Notification" in window)) {
alert("해당 브라우저는 알림을 받을 수 없는 브라우저입니다. 다른 브라우저를 이용해주세요");
return;
}
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

export function onChangePinned(prev: Array<PinnedSeats>, newPin: Array<PinnedSeats>, queryClient: QueryClient) {
  if (!prev || !newPin) {
    return;
  }

  // Check if there are seats available for pinned subjects
  for (const pin of newPin) {
    const hasSeat = prev.some(p => p.subjectId === pin.subjectId && p.seatCount === 0 && pin.seatCount > 0);
    if (hasSeat) {
      const wishes = getWishes(queryClient, pin.subjectId);

if (!("Notification" in window)) return;

      if (wishes) {
        new Notification(`${wishes.subjectCode}-${wishes.classCode} ${wishes.subjectName} 여석이 생겼습니다`);
        return;
      }

      new Notification(`unknown subject의 여석이 생겼습니다`);
    }
  }
}

function getWishes(queryClient: QueryClient, subjectId: number) {
  const wishes = queryClient.getQueryData<Wishlist>(['wishlist'])?.baskets ?? [];
  return wishes.find(wish => wish.subjectId === subjectId);
}

function useNotification() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     tableData.forEach(subject => {
  //       if (subject.seats > 0) {
  //         new Notification(`Seats available for ${subject.name}`);
  //       }
  //     });
  //   }, 3000);
  // }, [tableData]);
}

export default useNotification;