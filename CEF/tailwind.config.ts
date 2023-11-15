import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons';
import { playv } from './theme';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
  theme: {
    extend: {},
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(['carbon']),
    }),
    forms,
    typography,
    skeleton({
      themes: {
        custom: [playv],
      },
    }),
  ],
} satisfies Config;
