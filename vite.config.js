import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // Vite's Windows file-serving guard rejects paths containing "~", including this workspace path.
    host: '127.0.0.1',
    fs: {
      strict: false,
    },
  },
});
