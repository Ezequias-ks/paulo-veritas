import { cp, mkdtemp, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'dist');
const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'paulo-veritas-deploy-'));

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', stdio: 'pipe', ...options });
  if (result.status !== 0) throw new Error(result.stderr.trim() || result.stdout.trim() || `${command} falhou.`);
  return result.stdout.trim();
}

if (process.env.DEPLOY_CONFIRM !== 'production') {
  throw new Error('Deploy bloqueado. Execute: DEPLOY_CONFIRM=production npm run deploy');
}

if (run('git', ['status', '--porcelain']) !== '') {
  throw new Error('Há alterações locais. Revise, faça commit ou guarde-as antes do deploy.');
}

run(process.execPath, ['scripts/build.mjs']);
const remoteUrl = run('git', ['remote', 'get-url', 'origin']);

try {
  run('git', ['init', '--initial-branch=production', temporaryDirectory]);
  run('git', ['-C', temporaryDirectory, 'config', 'user.name', 'paulo-veritas deploy']);
  run('git', ['-C', temporaryDirectory, 'config', 'user.email', 'deploy@localhost']);
  for (const entry of await readdir(outputDir)) {
    await cp(path.join(outputDir, entry), path.join(temporaryDirectory, entry), { recursive: true });
  }
  run('git', ['-C', temporaryDirectory, 'add', '--all']);
  run('git', ['-C', temporaryDirectory, 'commit', '-m', 'Deploy static site']);
  run('git', ['-C', temporaryDirectory, 'remote', 'add', 'origin', remoteUrl]);
  run('git', ['-C', temporaryDirectory, 'push', '--force', 'origin', 'production']);
  console.log('Branch production atualizada no origin. Atualize a Hostinger a partir dela.');
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
