import { defineConfig } from 'vite';
import { handleWebhookRequest } from './server/webhooks.js';

function webhookApiPlugin() {
  const middleware = async (req, res, next) => {
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
  };

  return {
    name: 'discord-webhook-api',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [webhookApiPlugin()],
  server: {
    // Vite's Windows file-serving guard rejects paths containing "~", including this workspace path.
    host: '127.0.0.1',
    fs: {
      strict: false,
    },
  },
});
