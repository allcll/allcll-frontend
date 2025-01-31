import {http, HttpResponse} from "msw";
import {pinedSubjects} from "./pin.ts";

const encoder = new TextEncoder();
const SSE_INTERVAL = 2000;
const SSE_MAX_CONNECTION_TIME = 30000;

const getPinnedSeats = () => {
   return pinedSubjects.map((subject) => {
    const randomSeats = Math.floor(Math.random() * 100);
    return {
      subjectId: subject.subjectId,
      seat: randomSeats < 2 ? randomSeats : 0,
      queryTime: new Date().toISOString(),
    }
  });
}

export const handlers = [
  http.get('/api/connect', () => {
    const stream = new ReadableStream({
      start(controller) {
        const json = JSON.stringify(getPinnedSeats());
        controller.enqueue(encoder.encode(dataFrame('non-major', json, SSE_INTERVAL)));

        const nonMajorInterval = setInterval(() => {
          const json = JSON.stringify(getPinnedSeats());
          controller.enqueue(encoder.encode(dataFrame('non-major', json, SSE_INTERVAL)));
          controller.enqueue(encoder.encode(dataFrame('major', json, SSE_INTERVAL)));
          controller.enqueue(encoder.encode(dataFrame('pinned', json, SSE_INTERVAL)));
        }, SSE_INTERVAL);

        // const majorInterval = setInterval(() => {
        //   const json = JSON.stringify(getPinnedSeats());
        // }, SSE_INTERVAL);
        //
        //  const pinnedInterval = setInterval(() => {
        //   const json = JSON.stringify(getPinnedSeats());
        // }, SSE_INTERVAL);


        setTimeout(() => {
          clearInterval(nonMajorInterval);
          // clearInterval(majorInterval);
          // clearInterval(pinnedInterval);

          controller.close();
        }, SSE_MAX_CONNECTION_TIME);
      },
    });

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
      }
    });
  })
];

function dataFrame(event: string, data: string, retry: number) {
  return `event: ${event}\ndata: ${data}\nretry:${retry}\n\n`;
}