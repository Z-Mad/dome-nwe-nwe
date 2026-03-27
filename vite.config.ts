import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import devInspector from 'vite-plugin-dev-inspector'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
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
      // reactInspector(),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
      devInspector({
        toggleButtonVisibility: 'always',
        launchEditor: 'trae',
      }),
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
      __SCS_IM_CENTER__: JSON.stringify('/scs-im-center'), // 消息中心
      __SCS_AGENT__: JSON.stringify('/scs-service-agent'), // 智能体服务
      __SCS_MARKET_CENTER__: JSON.stringify('/scs-service-market-center'), // 智能体市场中心
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  }
})
