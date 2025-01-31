import { useEffect } from "react";
import {PinnedSeats} from "@/utils/types..ts";

const tableData = [
  { name: 'Math', seats: 0 },
  { name: 'Science', seats: 1 },
  { name: 'History', seats: 0 },
  { name: 'English', seats: 2 },
];

function requestNotificationPermission() {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

export function onChangePinned(prev: Array<PinnedSeats>, newPin: Array<PinnedSeats>) {
  if (!prev || !newPin) {
    return;
  }

  // Check if there are seats available for pinned subjects
  for (const pin of newPin) {
    const hasSeat = prev.some(p => p.subjectId === pin.subjectId && p.seat === 0 && pin.seat > 0);
    if (hasSeat) {
      new Notification(`Seats available for ${pin.subjectId}`);
    }
  }
}

function useNotification() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      tableData.forEach(subject => {
        if (subject.seats > 0) {
          new Notification(`Seats available for ${subject.name}`);
        }
      });
    }, 3000);
  }, [tableData]);
}

export default useNotification;