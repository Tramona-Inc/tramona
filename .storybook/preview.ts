import { withPerformance } from 'storybook-addon-performance';
import '../src/styles/tailwind-colors.css';
import '../src/styles/globals.css';
import { SessionProviderDecorator } from './decorators/withSessionProvider';

/** @type {NonNullable<import('@storybook/react').Story['decorators']>} */
export const decorators = [SessionProviderDecorator, withPerformance];

/** @type {import('@storybook/react').Parameters} */
export const parameters = {
  controls: {
    disable: true,
    expanded: true,
  },
  docs: {
    source: {
      excludeDecorators: true,
    },
  },
};
