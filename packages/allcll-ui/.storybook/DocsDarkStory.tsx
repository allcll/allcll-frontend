import { type ReactNode, useLayoutEffect, useRef } from 'react';

export default function DocsDarkStory({ children }: Readonly<{ children: ReactNode }>) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const story = ref.current?.closest<HTMLElement>('.docs-story');
    if (!story) return;
    story.classList.add('dark');
    story.style.backgroundColor = 'var(--allcll-background)';
    return () => {
      story.classList.remove('dark');
      story.style.backgroundColor = '';
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
