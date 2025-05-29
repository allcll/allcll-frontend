import { getRandomSubjects } from '../data/subjects.ts';

const UPPER_SEAT_COUNT = 20;
const LOWER_SEAT_COUNT = 10;

export let nonMajorSeats = initNonMajorSeats();

function initNonMajorSeats() {
  const randomSeats = getRandomSubjects(UPPER_SEAT_COUNT);

  return randomSeats
    .map(subject => ({
      subjectId: subject.subjectId,
      seatCount: 1 + Math.floor(Math.random() * 2),
      queryTime: new Date().toISOString(),
    }))
    .sort((a, b) => a.seatCount - b.seatCount);
}

function newNonMajorSeat() {
  let randomSeat = getRandomSubjects(1)[0];

  while (nonMajorSeats.some(seat => seat.subjectId === randomSeat.subjectId)) {
    randomSeat = getRandomSubjects(1)[0];
  }

  return {
    subjectId: randomSeat.subjectId,
    seatCount: 1 + Math.floor(Math.random() * 2),
    queryTime: new Date().toISOString(),
  };
}

export function updateNonMajorSeats() {
  const CREATE = getRandom(100) === 0;
  const UPDATE = getRandom(100) === 1;
  const DELETE = getRandom(100) === 2;

  if (UPDATE) {
    const idx = getRandom(nonMajorSeats.length);
    nonMajorSeats[idx].seatCount = 1 + Math.floor(Math.random() * 2);
    nonMajorSeats[idx].queryTime = new Date().toISOString();
  }

  if (CREATE) {
    const newSeats = newNonMajorSeat();
    nonMajorSeats.push(newSeats);
  }

  if (DELETE && nonMajorSeats.length > LOWER_SEAT_COUNT) {
    const idx = getRandom(nonMajorSeats.length);
    nonMajorSeats.splice(idx, 1);
  }

  return nonMajorSeats
    .map(subject => ({
      ...subject,
      queryTime: getRandom(50) === 1 ? new Date().toISOString() : subject.subjectId,
    }))
    .sort((a, b) => a.seatCount - b.seatCount);
}

function getRandom(max: number) {
  return Math.floor(Math.random() * max);
}
