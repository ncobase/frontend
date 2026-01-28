import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";

import pkg from './package.json';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

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
        { find: '@ncobase/react', replacement: pathResolve('src/components/ui') }
      ]
    },
    build: {
      minify: 'esbuild',
      target: 'es2015',
      cssTarget: 'chrome80',
      rollupOptions: {
        treeshake: false,
        output: {
          compact: true,
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
      reportCompressedSize: false
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
