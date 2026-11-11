import type { Preview } from '@storybook/react-vite';
import { Controls, Description, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks';
import { create } from 'storybook/theming';
import '../src/index.css';
import './fonts.css';

const preview: Preview = {
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
