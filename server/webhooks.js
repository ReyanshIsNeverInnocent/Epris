const FLAMES_RESULTS = new Set([
  'F · Friends',
  'L · Love',
  'A · Affection',
  'M · Marriage',
  'E · Enemies',
  'S · Siblings',
]);
const REQUEST_LIMIT = 10;
const WINDOW_MS = 60_000;
const requestCounts = new Map();

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function isValidName(name) {
  return typeof name === 'string' && name.trim().length > 0 && name.length <= 40;
}

function safeEmbedName(name) {
  return name.trim().replaceAll('@', '@\u200b');
}

function isRateLimited(ip) {
  const now = Date.now();
  const current = requestCounts.get(ip);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    requestCounts.set(ip, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > REQUEST_LIMIT;
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 4096) throw new Error('Request body is too large.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function handleWebhookRequest(req, res) {
  const path = new URL(req.url, 'http://localhost').pathname;
  const tool = path === '/api/flames' ? 'flames' : path === '/api/love' ? 'love' : null;
  if (!tool) return false;

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return true;
  }

  if (!req.headers['content-type']?.includes('application/json')) {
    sendJson(res, 415, { error: 'Expected a JSON request.' });
    return true;
  }

  const ip = req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    sendJson(res, 429, { error: 'Too many comparisons. Try again in a minute.' });
    return true;
  }

  let payload;
  try {
    payload = await readJson(req);
  } catch {
    sendJson(res, 400, { error: 'Invalid or oversized JSON request.' });
    return true;
  }

  const { firstName, secondName, result } = payload ?? {};
  const validResult = tool === 'flames'
    ? FLAMES_RESULTS.has(result)
    : Number.isInteger(result) && result >= 55 && result <= 100;
  if (!isValidName(firstName) || !isValidName(secondName) || !validResult) {
    sendJson(res, 400, { error: 'Names or comparison result are invalid.' });
    return true;
  }

  const webhookUrl = process.env[tool === 'flames' ? 'FLAMES_WEBHOOK_URL' : 'LOVE_WEBHOOK_URL'];
  if (!webhookUrl) {
    sendJson(res, 503, { error: 'Webhook is not configured on the server.' });
    return true;
  }

  const embed = {
    title: tool === 'flames' ? 'FLAMES Result' : 'Love Match Result',
    color: tool === 'flames' ? 0xE98B9F : 0xD97791,
    fields: [
      { name: 'First name', value: safeEmbedName(firstName), inline: true },
      { name: 'Second name', value: safeEmbedName(secondName), inline: true },
      { name: 'Result', value: tool === 'flames' ? result : `${result}%`, inline: false },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'Épris · just for fun' },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [embed],
        allowed_mentions: { parse: [] },
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.error(`Discord webhook returned HTTP ${response.status} for ${tool}.`);
      sendJson(res, 502, { error: 'Discord could not accept the comparison.' });
      return true;
    }
  } catch (error) {
    console.error(`Discord webhook request failed for ${tool} (${error.name}).`);
    sendJson(res, 502, { error: 'Unable to reach Discord.' });
    return true;
  }

  sendJson(res, 200, { ok: true });
  return true;
}
