import { defineConfig } from 'vite';
import { handleWebhookRequest } from './server/webhooks.js';
import { seo } from './seo.js';

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

function seoMetadataPlugin() {
  return {
    name: 'seo-metadata',
    transformIndexHtml: {
      handler() {
        return [
          { tag: 'title', children: seo.title, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'description', content: seo.description }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'theme-color', content: seo.themeColor }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:title', content: seo.title }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:description', content: seo.description }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:card', content: seo.image ? 'summary_large_image' : 'summary' }, injectTo: 'head' },
          ...(seo.image
            ? [
                { tag: 'meta', attrs: { property: 'og:image', content: seo.image }, injectTo: 'head' },
                { tag: 'meta', attrs: { name: 'twitter:image', content: seo.image }, injectTo: 'head' },
              ]
            : []),
        ];
      },
    },
  };
}

export default defineConfig({
  plugins: [webhookApiPlugin(), seoMetadataPlugin()],
  server: {
    // Vite's Windows file-serving guard rejects paths containing "~", including this workspace path.
    host: '127.0.0.1',
    fs: {
      strict: false,
    },
  },
});
