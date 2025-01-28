import { useEffect } from "react";

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