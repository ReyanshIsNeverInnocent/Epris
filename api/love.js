import { handleWebhookRequest } from '../server/webhooks.js';

export default async function loveWebhook(req, res) {
  try {
    await handleWebhookRequest(req, res, 'love');
  } catch (error) {
    console.error(`Love webhook handler failed (${error.name}).`);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unable to process webhook request.' }));
    }
  }
}
