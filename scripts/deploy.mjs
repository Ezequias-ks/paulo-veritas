import { cp, mkdtemp, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'dist');
const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'paulo-veritas-deploy-'));

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
    ...options
  });

  if (result.status !== 0) {
    throw new Error(
      result.stderr.trim() ||
      result.stdout.trim() ||
      `${command} falhou.`
    );
  }

  return result.stdout.trim();
}

if (process.env.DEPLOY_CONFIRM !== 'production') {
  throw new Error(
    'Deploy bloqueado. Execute: DEPLOY_CONFIRM=production npm run deploy'
  );
}

if (run('git', ['status', '--porcelain']) !== '') {
  throw new Error(
    'Há alterações locais. Revise, faça commit ou guarde-as antes do deploy.'
  );
}

run(process.execPath, ['scripts/build.mjs']);

const remoteUrl = run('git', ['remote', 'get-url', 'origin']);
const currentBranch = run('git', ['branch', '--show-current']);

try {
  // Cria um repositório temporário contendo apenas o conteúdo de dist/
  run('git', ['init', '--initial-branch=production', temporaryDirectory]);

  run('git', [
    '-C',
    temporaryDirectory,
    'config',
    'user.name',
    'paulo-veritas deploy'
  ]);

  run('git', [
    '-C',
    temporaryDirectory,
    'config',
    'user.email',
    'deploy@localhost'
  ]);

  for (const entry of await readdir(outputDir)) {
    await cp(
      path.join(outputDir, entry),
      path.join(temporaryDirectory, entry),
      { recursive: true }
    );
  }

  run('git', ['-C', temporaryDirectory, 'add', '--all']);
  run('git', ['-C', temporaryDirectory, 'commit', '-m', 'Deploy static site']);

  run('git', [
    '-C',
    temporaryDirectory,
    'remote',
    'add',
    'origin',
    remoteUrl
  ]);

  run('git', [
    '-C',
    temporaryDirectory,
    'push',
    '--force-with-lease',
    'origin',
    'production'
  ]);

  console.log('✔ Branch production publicada com sucesso.');

  //
  // Sincroniza a production local com a publicada
  //
  try {
    run('git', ['fetch', 'origin']);

    run('git', ['checkout', 'production']);

    run('git', ['reset', '--hard', 'origin/production']);

    if (currentBranch !== 'production') {
      run('git', ['checkout', currentBranch]);
    }

    console.log('✔ Branch production local sincronizada.');
  } catch (error) {
    console.warn('');
    console.warn('ATENÇÃO:');
    console.warn(
      'O deploy foi publicado, porém não foi possível sincronizar a branch production local.'
    );
    console.warn(error.message);
  }

  console.log('');
  console.log('Agora atualize a Hostinger executando:');
  console.log('');
  console.log('git fetch origin');
  console.log('git checkout production');
  console.log('git reset --hard origin/production');
  console.log('git clean -fd');

} finally {
  await rm(temporaryDirectory, {
    recursive: true,
    force: true
  });
}