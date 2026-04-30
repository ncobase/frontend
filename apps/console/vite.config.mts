import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

import pkg from './package.json';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

const normalizePath = (id: string) => id.replaceAll('\\', '/');
const isNodePackage = (id: string, packageName: string) =>
  id.includes(`/node_modules/${packageName}/`);

const moduleSideEffects = (id: string): boolean => {
  const normalizedId = normalizePath(id);

  if (normalizedId.includes('.css')) return true;
  if (
    normalizedId.includes('/apps/console/src/components/ui/') ||
    normalizedId.includes('/packages/react/src/') ||
    normalizedId.includes('/packages/charts/src/')
  ) {
    return false;
  }

  return true;
};

const manualChunks = (id: string): string | undefined => {
  const normalizedId = normalizePath(id);

  if (normalizedId.includes('vite/preload-helper')) return 'preload_helper';

  if (!normalizedId.includes('node_modules')) return undefined;

  if (
    isNodePackage(normalizedId, 'react') ||
    isNodePackage(normalizedId, 'react-dom') ||
    isNodePackage(normalizedId, 'scheduler') ||
    isNodePackage(normalizedId, 'react-router')
  ) {
    return 'vendor_react';
  }
  if (isNodePackage(normalizedId, '@tanstack/react-query')) return 'vendor_query';
  if (
    isNodePackage(normalizedId, 'i18next') ||
    isNodePackage(normalizedId, 'i18next-http-backend') ||
    isNodePackage(normalizedId, 'react-i18next')
  ) {
    return 'vendor_i18n';
  }
  if (normalizedId.includes('/node_modules/@radix-ui/')) return 'vendor_radix';
  if (
    isNodePackage(normalizedId, 'clsx') ||
    isNodePackage(normalizedId, 'tailwind-merge') ||
    isNodePackage(normalizedId, 'class-variance-authority')
  ) {
    return 'vendor_ui_utils';
  }
  if (
    isNodePackage(normalizedId, 'prop-types') ||
    isNodePackage(normalizedId, 'react-is') ||
    isNodePackage(normalizedId, 'hoist-non-react-statics')
  ) {
    return 'vendor_react_compat';
  }
  if (isNodePackage(normalizedId, 'jsencrypt') || isNodePackage(normalizedId, 'nanoid')) {
    return 'vendor_runtime_utils';
  }
  if (normalizedId.includes('@tabler/icons-react/dist/esm/icons/')) {
    return 'vendor_tabler_icons';
  }
  if (
    normalizedId.includes('@tabler/icons-react/dist/esm/createReactComponent') ||
    normalizedId.includes('@tabler/icons-react/dist/esm/defaultAttributes')
  ) {
    return 'vendor_tabler_icons';
  }
  if (normalizedId.includes('recharts')) return 'vendor_recharts';
  if (normalizedId.includes('monaco-editor')) return 'vendor_monaco';
  if (isNodePackage(normalizedId, 'zrender') || isNodePackage(normalizedId, 'echarts')) {
    return 'vendor_echarts';
  }
  if (normalizedId.includes('lodash')) return 'vendor_lodash';
  if (normalizedId.includes('xlsx')) return 'vendor_xlsx';
  if (normalizedId.includes('react-syntax-highlighter')) return 'vendor_syntax_highlighter';
  if (normalizedId.includes('highlight.js') || normalizedId.includes('lowlight')) {
    return 'vendor_highlight';
  }
  if (normalizedId.includes('@tiptap')) return 'vendor_tiptap';
  if (normalizedId.includes('prosemirror')) return 'vendor_prosemirror';

  return undefined;
};

const setupPlugins = ({}: ImportMetaEnv) => ([
  react(),
  tailwindcss()
]);

// noinspection JSUnusedGlobalSymbols
export default (({ mode }: ConfigEnv): UserConfig => {
  const root = pathResolve('.');
  const ENV = loadEnv(mode, root) as unknown as ImportMetaEnv;

  const proxy = ENV.VITE_API_PROXY ? {
    '/api': {
      target: ENV.VITE_API_URL,
      changeOrigin: true,
      secure: false,
      rewrite: (path: string) => path.replace(/^\/api/, '')
    }
  } : undefined;

  return {
    define: {
      _APP_VERSION: JSON.stringify(pkg.version),
      'process.env': {}
    },
    plugins: setupPlugins(ENV),
    resolve: {
      alias: [
        { find: '@', replacement: pathResolve('src') },
        { find: '#', replacement: pathResolve('types') },
        { find: '@ncobase/charts', replacement: pathResolve('../../packages/charts/src') },
        { find: '@ncobase/react', replacement: pathResolve('src/components/ui') }
      ]
    },
    build: {
      minify: 'esbuild',
      target: 'es2015',
      cssTarget: 'chrome80',
      rollupOptions: {
        treeshake: {
          moduleSideEffects
        },
        output: {
          compact: true,
          manualChunks,
          chunkFileNames: 'assets/js/[name].[hash].js',
          entryFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: ({ name }) => {
            if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
              return 'assets/images/[name].[hash][extname]';
            }
            if (/\.css$/.test(name ?? '')) {
              return 'assets/css/[name].[hash][extname]';
            }
            return 'assets/[name].[hash][extname]';
          }
        }
      },
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1200
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020'
      }
    },
    server: {
      port: +ENV.VITE_PORT || 5173,
      proxy
    }
  };
});
