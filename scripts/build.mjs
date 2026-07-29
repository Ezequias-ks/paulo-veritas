import { cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'site');
const outputDir = path.join(root, 'dist');
const assetPattern = /(?:href|src)=["']([^"']+)["']/gi;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  }))).flat();
}

function isLocalReference(reference) {
  return reference
    && !reference.startsWith('#')
    && !reference.startsWith('/')
    && !reference.startsWith('//')
    && !/^[a-z][a-z\d+.-]*:/i.test(reference);
}

async function validateReferences() {
  const files = await walk(sourceDir);
  const htmlFiles = files.filter((file) => file.endsWith('.html'));
  const missing = [];

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, 'utf8');
    for (const match of html.matchAll(assetPattern)) {
      const reference = match[1];
      if (!isLocalReference(reference)) continue;

      const relativePath = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
      if (!relativePath) continue;
      const resolvedPath = path.resolve(path.dirname(htmlFile), relativePath);
      const relativeToSource = path.relative(sourceDir, resolvedPath);

      if (relativeToSource.startsWith('..') || path.isAbsolute(relativeToSource)) {
        missing.push(`${path.relative(root, htmlFile)}: referência fora de site/: ${reference}`);
        continue;
      }

      try {
        await stat(resolvedPath);
      } catch {
        missing.push(`${path.relative(root, htmlFile)}: arquivo não encontrado: ${reference}`);
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(`Referências locais inválidas:\n${missing.join('\n')}`);
  }
}

try {
  await stat(path.join(sourceDir, 'index.html'));
} catch {
  throw new Error('site/index.html não encontrado.');
}

await validateReferences();
await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(sourceDir, outputDir, { recursive: true });
console.log('Build concluído: dist/');
