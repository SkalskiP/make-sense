import {
  defineConfig,
  loadEnv,
  UserConfig,
  UserConfigExport,
} from 'vite';

import react from '@vitejs/plugin-react';

export default ({ mode }: UserConfig): UserConfigExport => {
  process.env = { ...process.env, ...loadEnv(mode || 'development', process.cwd()) };
  return defineConfig({
    plugins: [react()],
    build: {
      minify: 'terser',
      sourcemap: mode === 'development',
      chunkSizeWarningLimit: 1024 * 1024,
      rollupOptions: {
        treeshake: true,
        maxParallelFileReads: 4,
        output: {
          manualChunks: {
            lodash: ['lodash'],
            classnames: ['classnames'],
            runtime: ['react', 'react-is'],
            'runtime-dom': ['react-dom'],

            ai: ['@tensorflow/tfjs',
              '@tensorflow/tfjs-backend-cpu',
              '@tensorflow/tfjs-backend-webgl',
              '@tensorflow/tfjs-core',
              '@tensorflow/tfjs-node'],
            models: [
              '@tensorflow-models/coco-ssd',
              '@tensorflow-models/posenet',
            ],
            ui: ['@mui/material', '@mui/system'],
            moment: ['moment']

          },
        },
      },
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    },
    css: {
      modules: {
        generateScopedName: mode === 'development' ? '[name]__[local]___[hash:base64:5]' : '[hash:base64:8]',
        scopeBehaviour: 'local',
        localsConvention: 'camelCase',
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
  });
};
