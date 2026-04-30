import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

import pkg from './package.json';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

const manualChunks = (id: string): string | undefined => {
  const normalizedId = id.replaceAll('\\', '/');

  if (!normalizedId.includes('node_modules')) return undefined;

  if (normalizedId.includes('@tabler/icons-react/dist/esm/icons/')) {
    return 'vendor_tabler_icons';
  }
  if (
    normalizedId.includes('@tabler/icons-react/dist/esm/createReactComponent') ||
    normalizedId.includes('@tabler/icons-react/dist/esm/defaultAttributes')
  ) {
    return 'vendor_tabler_icons';
  }
  if (normalizedId.includes('monaco-editor')) return 'vendor_monaco';
  if (normalizedId.includes('zrender') || normalizedId.includes('echarts')) return 'vendor_echarts';
  if (normalizedId.includes('recharts')) return 'vendor_recharts';
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
