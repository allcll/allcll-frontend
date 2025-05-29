import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

export default {
  initialize() {
    const sessionReplayTracking = sessionReplayPlugin({
      forceSessionTracking: true, // Enable capture of Session Start and Session End events
      sampleRate: 0.1, // 10% sample rate, should reduce for production traffic.
    });
    amplitude.add(sessionReplayTracking);
    amplitude.init(import.meta.env.VITE_AMPLITUDE_API_KEY);
  },
};
