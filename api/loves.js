import { handleWebhookRequest } from '../server/webhooks.js';

export default async function lovesWebhook(req, res) {
  try {
    await handleWebhookRequest(req, res, 'loves');
  } catch (error) {
    console.error(`LOVES Pyramid webhook handler failed (${error.name}).`);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unable to process webhook request.' }));
    }
  }
}
