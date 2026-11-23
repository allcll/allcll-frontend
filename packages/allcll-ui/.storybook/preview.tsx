import type { Decorator, Preview } from '@storybook/react-vite';
import { Controls, Description, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks';
import { create } from 'storybook/theming';
import '../src/index.css';
import './fonts.css';
import './docs.css';
import DocsDarkStory from './DocsDarkStory';
import ThemePanel from './ThemePanel';
import type { ThemeMode } from './useThemeMode';

const withTheme: Decorator = (Story, context) => {
  const mode = context.globals.theme as ThemeMode;
  const isDocs = context.viewMode === 'docs';

  const isPageDark = !isDocs && mode === 'dark';
  document.documentElement.classList.toggle('dark', isPageDark);
  document.body.style.backgroundColor = isPageDark ? 'var(--allcll-background)' : '';

  if (isDocs && mode === 'dark') {
    return (
      <DocsDarkStory>
        <Story />
      </DocsDarkStory>
    );
  }
  if (mode !== 'compare') return <Story />;

  const panelHeight: number | undefined = context.parameters.themePanelHeight;
  const layoutStyle = panelHeight
    ? { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', width: '100%' }
    : { display: 'flex', flexWrap: 'wrap' as const };

  return (
    <div style={{ ...layoutStyle, gap: 16 }}>
      {(['light', 'dark'] as const).map(theme => (
        <ThemePanel key={theme} theme={theme} height={panelHeight}>
          <Story />
        </ThemePanel>
      ))}
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: '색상 모드',
      toolbar: {
        title: '색상 모드',
        icon: 'contrast',
        items: [
          { value: 'light', title: '라이트' },
          { value: 'dark', title: '다크' },
          { value: 'compare', title: '라이트 / 다크' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    docs: {
      source: { type: 'dynamic' },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories includePrimary={false} />
        </>
      ),
      theme: create({ base: 'light', fontBase: "'Pretendard', system-ui, sans-serif" }),
    },
    options: {
      storySort: {
        order: ['Overview', 'Actions', 'Form', 'Feedback', 'Overlay', 'Navigation', 'Display', 'Layout'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
