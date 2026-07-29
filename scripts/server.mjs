import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directoryName = process.argv[2];
const port = Number(process.argv[3] ?? 4173);
const siteRoot = path.resolve(root, directoryName ?? 'site');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.otf': 'font/otf', '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2'
};

try {
  await access(siteRoot);
} catch {
  throw new Error(`Diretório não encontrado: ${directoryName}`);
}

const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const requestedPath = pathname === '/' ? '/index.html' : pathname;
    const filePath = path.resolve(siteRoot, `.${requestedPath}`);
    const relativePath = path.relative(siteRoot, filePath);

    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    const file = await stat(filePath);
    if (!file.isFile()) throw new Error('Not found');

    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      'Content-Length': file.size
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Servindo ${path.relative(root, siteRoot) || '.'} em http://127.0.0.1:${port}`);
});
