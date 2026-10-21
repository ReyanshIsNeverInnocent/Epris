import { handleLoveScoreRequest } from '../server/webhooks.js';

export default async function loveScore(req, res) {
  try {
    await handleLoveScoreRequest(req, res);
  } catch (error) {
    console.error(`Love score handler failed (${error.name}).`);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unable to calculate the love score.' }));
    }
  }
}
