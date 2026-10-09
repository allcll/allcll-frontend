import { CustomNotification } from '../lib/useNotification.ts';

// Define the path to your notification sound file
const NOTIFICATION_SOUND_PATH = '/notification.mp3';

let currentAudio: HTMLAudioElement | null = null;

// Function to initialize and preload the audio
const initializeAudio = () => {
  if (typeof Audio !== 'undefined' && !currentAudio) {
    currentAudio = new Audio(NOTIFICATION_SOUND_PATH);
    currentAudio.preload = 'auto'; // Start preloading
    currentAudio.volume = 1.0; // Set default volume
    currentAudio.load();
  }
};

// Initialize audio as soon as the module is loaded
initializeAudio();

const SoundNotification: CustomNotification = {
  canNotify(): boolean {
    return typeof Audio !== 'undefined';
  },

  isGranted(): boolean {
    return this.canNotify();
  },

  requestPermission(callback?: (permission: NotificationPermission) => void): void {
    if (this.isGranted()) {
      callback?.('granted');
    } else {
      callback?.('denied');
    }
  },

  getDeniedMessage() {
    if (!this.canNotify()) {
      return ['이 브라우저는 소리 알림을 지원하지 않습니다.'];
    }
    return [];
  },

  show(_: string, __?: string): void {
    if (this.canNotify() && currentAudio) {
      currentAudio.currentTime = 0; // Reset to start for immediate playback
      currentAudio.play().catch(error => {
        console.warn('Failed to play notification sound:', error);
      });
    }
  },

  close(__: string): void {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  },
};

export default SoundNotification;
