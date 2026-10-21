import { defineConfig } from 'vite';
import { handleWebhookRequest } from './server/webhooks.js';

export default defineConfig({
  plugins: [{
    name: 'discord-webhook-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const handled = await handleWebhookRequest(req, res);
          if (!handled) next();
        } catch (error) {
          console.error('Webhook API request failed:', error);
          if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unable to process webhook request.' }));
          }
        }
      });
    },
  }],
  server: {
    // Vite's Windows file-serving guard rejects paths containing "~", including this workspace path.
    host: '127.0.0.1',
    fs: {
      strict: false,
    },
  },
});
