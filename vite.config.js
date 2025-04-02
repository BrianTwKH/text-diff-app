import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // 自動開啟預設瀏覽器
  },
  base: '/text-diff-app/', // 在此處加入儲存庫名稱，前後都要有斜線
});
