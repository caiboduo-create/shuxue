import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 前端开发服务器跑在 5173，所有 /api 请求自动转发到后端 3001
// 这样前端代码里只写 fetch('/api/xxx')，不用关心跨域。
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
