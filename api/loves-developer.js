import { handleLovesDeveloperRequest } from '../server/webhooks.js';

export default async function lovesDeveloper(req, res) {
  try {
    await handleLovesDeveloperRequest(req, res);
  } catch (error) {
    console.error(`LOVES developer handler failed (${error.name}).`);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unable to check the LOVES result.' }));
    }
  }
}
