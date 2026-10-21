import { handleWebhookRequest } from '../server/webhooks.js';

export default async function loveWebhook(req, res) {
  const handled = await handleWebhookRequest(req, res);
  if (!handled && !res.headersSent) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found.' }));
  }
}
