import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import useToastNotification from './useToastNotification';

describe('useToastNotification Store', () => {
  beforeEach(() => {
    // 테스트 실행 전에 스토어 상태를 초기화합니다.
    useToastNotification.setState({
      isActivated: false,
      messages: [],
    });
    vi.useFakeTimers(); // 타이머 목(mock)을 활성화합니다.
  });

  afterEach(() => {
    vi.useRealTimers(); // 타이머를 원래대로 복구합니다.
  });

  it('should add a toast message to the queue', () => {
    const store = useToastNotification.getState();
    expect(store.messages.length).toBe(0);

    store.addToast('테스트 알림 메시지');

    const updatedStore = useToastNotification.getState();
    expect(updatedStore.messages.length).toBe(1);
    expect(updatedStore.messages[0].message).toBe('테스트 알림 메시지');
    expect(updatedStore.messages[0].tag).toBeUndefined();
  });

  it('should auto-dismiss toast messages with a tag after 3 seconds', () => {
    const store = useToastNotification.getState();

    // 태그가 지정된 토스트를 추가합니다.
    store.addToast('3초 후 사라질 알림', 'temp-tag');

    expect(useToastNotification.getState().messages.length).toBe(1);

    // 시간을 2.9초 흘려보냅니다 (여전히 존재해야 함)
    vi.advanceTimersByTime(2900);
    expect(useToastNotification.getState().messages.length).toBe(1);

    // 시간을 3초까지 채워서 흘려보냅니다 (사라져야 함)
    vi.advanceTimersByTime(100);
    expect(useToastNotification.getState().messages.length).toBe(0);
  });

  it('should clear toast message by index (number)', () => {
    const store = useToastNotification.getState();
    store.addToast('첫 번째 메시지');
    store.addToast('두 번째 메시지');
    store.addToast('세 번째 메시지');

    expect(useToastNotification.getState().messages.length).toBe(3);

    // 인덱스 1 (두 번째 메시지) 삭제
    useToastNotification.getState().clearToast(1);

    const messages = useToastNotification.getState().messages;
    expect(messages.length).toBe(2);
    expect(messages[0].message).toBe('첫 번째 메시지');
    expect(messages[1].message).toBe('세 번째 메시지');
  });

  it('should clear toast message by tag (string)', () => {
    const store = useToastNotification.getState();
    store.addToast('메시지 A', 'tag-a');
    store.addToast('메시지 B', 'tag-b');

    expect(useToastNotification.getState().messages.length).toBe(2);

    // tag-a 삭제
    useToastNotification.getState().clearToast('tag-a');

    const messages = useToastNotification.getState().messages;
    expect(messages.length).toBe(1);
    expect(messages[0].message).toBe('메시지 B');
    expect(messages[0].tag).toBe('tag-b');
  });
});
