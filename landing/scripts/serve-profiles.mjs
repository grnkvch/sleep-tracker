import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const roots = {
  4173: 'dist/telegram',
  4174: 'dist/pwa',
  4175: 'dist/hybrid'
};
const host = process.env.LANDING_SERVE_HOST ?? '127.0.0.1';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

for (const [portText, root] of Object.entries(roots)) {
  const port = Number(portText);
  createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', `http://127.0.0.1:${port}`);
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const relative = normalize(pathname).replace(/^[/\\]+/, '');
      if (relative.startsWith('..')) throw new Error('Invalid path');
      let path = join(root, relative);
      try {
        if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
      } catch {
        path = join(root, '404.html');
        response.statusCode = 404;
      }
      const body = await readFile(path);
      response.setHeader('Content-Type', mime[extname(path)] ?? 'application/octet-stream');
      response.end(body);
    } catch {
      response.statusCode = 500;
      response.end('Internal error');
    }
  }).listen(port, host);
}

process.stdout.write('Profile servers ready on 4173, 4174, 4175\n');
