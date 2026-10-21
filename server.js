import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleWebhookRequest } from './server/webhooks.js';

const root = resolve(fileURLToPath(new URL('./dist/', import.meta.url)));
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
  try {
    if (await handleWebhookRequest(req, res)) return;
  } catch (error) {
    console.error('Webhook API request failed:', error);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unable to process webhook request.' }));
    }
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405);
    res.end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400);
    res.end();
    return;
  }
  if (pathname.startsWith('/api/')) {
    res.writeHead(404);
    res.end();
    return;
  }

  const requestedFile = resolve(root, `.${pathname}`);
  if (requestedFile !== root && !requestedFile.startsWith(`${root}${sep}`)) {
    res.writeHead(403);
    res.end();
    return;
  }

  let file = requestedFile;
  try {
    await access(file);
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
  } catch {
    file = resolve(root, 'index.html');
  }

  try {
    const fileStat = await stat(file);
    res.writeHead(200, {
      'Content-Type': mimeTypes[extname(file)] || 'application/octet-stream',
      'Content-Length': fileStat.size,
    });
    if (req.method === 'HEAD') res.end();
    else createReadStream(file).pipe(res);
  } catch (error) {
    console.error('Unable to serve built app:', error);
    res.writeHead(404);
    res.end();
  }
});

server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Épris server listening on port ${process.env.PORT || 3000}`);
});
