import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
         proxy: {
          // ajax
          [env.VITE_BASE_API]: {
            target: env.VITE_BASE_URL,
            changeOrigin: true,
            rewrite: (path) => path.replace(new RegExp(`^${env.VITE_BASE_API}`), ''),
          },
        },
      },
      plugins: [
        react(),
        tailwindcss(),
      ],
      preview: {
      host: true,
      proxy: {
        // ajax
        [env.VITE_BASE_API]: {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
      define: {
         __SCS_AUTH__: JSON.stringify('/scs-auth'), // 登录服务
         __SCS_SERVICE__: JSON.stringify('/scs-service-system'), // 用户相关
         __SCS_RESOURCE__: JSON.stringify('/scs-ops-resource'), // 文件上传
         __SCS_AGENT__: JSON.stringify('/scs-service-agent'), // 智能体服务
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      test: {
        environment: "node",
        include: ["src/**/*.test.ts"]
      }
    };
});
