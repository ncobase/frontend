import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config.mts';

export default defineConfig(env =>
  mergeConfig(
    typeof viteConfig === 'function' ? viteConfig(env) : viteConfig,
    defineConfig({
      test: {
        exclude: ['e2e/**', 'dist/**', 'node_modules/**']
      }
    })
  )
);
