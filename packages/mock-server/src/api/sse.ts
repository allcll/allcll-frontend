import { http, HttpResponse } from 'msw';
import { pinedSubjects } from './pin.ts';

const encoder = new TextEncoder();
const SSE_INTERVAL = 800;
const SSE_MAX_CONNECTION_TIME = 30000;

const getPinnedSeats = () => {
  const pins = pinedSubjects.map(subject => {
    const randomSeats = Math.floor(Math.random() * 100);
    return {
      subjectId: subject.subjectId,
      seatCount: randomSeats < 2 ? randomSeats : 0,
      queryTime: new Date().toISOString(),
    };
  });

  return { seatResponses: pins };
};

export const handlers = [
  http.get('/api/connect', () => {
    const stream = new ReadableStream({
      start(controller) {
        const json = JSON.stringify(getPinnedSeats());
        controller.enqueue(encoder.encode(dataFrame('nonMajorSeats', json, SSE_INTERVAL)));

        const nonMajorInterval = setInterval(() => {
          const json = JSON.stringify(getPinnedSeats());
          controller.enqueue(encoder.encode(dataFrame('nonMajorSeats', json, SSE_INTERVAL)));
          controller.enqueue(encoder.encode(dataFrame('majorSeats', json, SSE_INTERVAL)));
          controller.enqueue(encoder.encode(dataFrame('pinSeats', json, SSE_INTERVAL)));
        }, SSE_INTERVAL);

        setTimeout(() => {
          clearInterval(nonMajorInterval);
          controller.close();
        }, SSE_MAX_CONNECTION_TIME);
      },
    });

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });
  }),
];

function dataFrame(event: string, data: string, retry: number) {
  return `event: ${event}\ndata: ${data}\nretry:${retry}\n\n`;
}
