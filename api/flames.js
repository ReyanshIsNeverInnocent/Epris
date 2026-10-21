import { handleWebhookRequest } from '../server/webhooks.js';

export default async function flamesWebhook(req, res) {
  try {
    await handleWebhookRequest(req, res, 'flames');
  } catch (error) {
    console.error(`FLAMES webhook handler failed (${error.name}).`);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unable to process webhook request.' }));
    }
  }
}
