analisar o contexto do projeto paulo-veritas que se encontra na pasta
  projetos, fazer um levantamento da situação atual e atualizar ou fazer
  caso não tenha o readme e o passo a passo para deploy e bild em ambiente
  local/teste e como fazer para deploy no github e servidor. mostrar diff
  para aprovação antes de aplicar.


• Vou levantar a estrutura, o estado do repositório e a infraestrutura/
  configuração de deploy. Não vou alterar arquivos agora: ao final,
  apresento um diff proposto para sua aprovação.

• Ran pwd && rg --files /home/ezequias/projetos/paulo-veritas -g '!
  │ *node_modules*' -g '!*.lock' | sed -n '1,240p'
  └ /home/ezequias
    /home/ezequias/projetos/paulo-veritas/media/bg-1.jpg
    … +43 lines (ctrl + t to view transcript)
    /home/ezequias/projetos/paulo-veritas/_app/immutable/nodes/3.C5GtSRkC.js

• Ran python3 -m http.server 4173 --bind 127.0.0.1
  this time

• Running python3 -m http.server 4173 --bind 127.0.0.1

✔ You approved codex to run curl -sS -I http://127.0.0.1:4173/ && curl -sS
  -o /dev/null -w '%{http_code}\... this time

• Ran curl -sS -I http://127.0.0.1:4173/ && curl -sS -o /dev/null -w
  │ '%{http_code}\n'
  │ http://127.0.0.1:4173/_app/immutable/assets/0.D18r2VAq.css && for page
  │ … +3 lines
  └ HTTP/1.0 200 OK
    Server: SimpleHTTP/0.6 Python/3.11.2
    … +10 lines (ctrl + t to view transcript)
    contato.html 200
    blog.html 200

↳ Interacted with background terminal
  └

• Ran python3 -m http.server 4173 --bind 127.0.0.1
  └ 127.0.0.1 - - [26/Jul/2026 15:10:01] "GET / HTTP/1.1" 200 -
    127.0.0.1 - - [26/Jul/2026 15:10:01] "GET /_app/immutable/
    … +44 lines (ctrl + t to view transcript)

    Keyboard interrupt received, exiting.

• Explored
  └ List .
    Search ./.git/* in .
    Search https?://[^"[:space:]<>]+
    Search href="[^"]+"|<form[^>]*|action="[^"]+"|type="submit" in
    contato.html
    Search package.json in .

• Ran rg -o -i '.{0,160}<form class="form-grid".{0,1400}' contato.html |
  │ fold -w 160 | sed -n '1,18p' && printf '\n--- script form behavior
  │ ---\n' && rg -n -i 'form-grid|wa\.me|whatsapp|submit|window\.open|
  │ … +3 lines
  └ ferrer" class="button-light">Falar no WhatsApp</a></div> <div
    class="panel"><p class="eyebrow">Formulario</p> <h3
    … +26 lines (ctrl + t to view transcript)
    2026-05-18T22:34:08+00:00
    Primeiro commit estruturado

────────────────────────────────────────────────────────────────────────────

• Levantamento concluído: o site está funcional como publicação estática e o
  repositório está limpo, em main, sincronizado com origin/main (Ezequias-
  ks/paulo-veritas). Validei localmente todas as 6 páginas e os ativos
  principais: retornaram HTTP 200.

  Pontos importantes:

  - Não há README, package.json, fontes Svelte, nem configuração de CI/CD ou
    servidor.

  - O conteúdo atual é um artefato estático já gerado por SvelteKit (*.html,
    _app/, media/), com cerca de 7 MB.

  - Portanto, hoje não existe “build” reproduzível no repositório. Para
    alterar ou reconstruir o projeto, é necessário recuperar o repositório-
    fonte original.

  - O formulário de contato não envia dados a um backend: ele monta uma
    mensagem e abre o WhatsApp, o que é compatível com hospedagem estática.

  - Para GitHub Pages ou servidor web, basta publicar o conteúdo inteiro da
    raiz — inclusive _app/ e media/.

  Proponho adicionar somente um novo README.md, sem alterar o site ou a
  infraestrutura:

  diff --git a/README.md b/README.md
  new file mode 100644
  --- /dev/null
  +++ b/README.md
  @@ -0,0 +1,118 @@
  +# Veritas Psicologia
  +
  +Site institucional estático da Veritas Psicologia.
  +
  +## Situação atual do projeto
  +
  +Este repositório contém a versão já publicada/gerada do site:
  +
  +- páginas HTML: `index.html`, `sobre.html`, `servicos.html`,
  `duvidas.html`,
  +  `contato.html` e `blog.html`;
  +- assets da aplicação em `_app/`;
  +- imagens em `media/`;
  +- regras básicas de rastreamento em `robots.txt`.
  +
  +Não há `package.json`, código-fonte SvelteKit, dependências ou
  configuração de
  +build. Portanto, o repositório **não possui um comando de build
  reproduzível**.
  +Para reconstruir o site a partir do código, é necessário obter o projeto-
  fonte
  +original.
  +
  +O formulário da página de contato é estático: ao clicar em “Enviar via
  +WhatsApp”, a mensagem é preparada no navegador e aberta no WhatsApp. Não
  há
  +backend, banco de dados ou variáveis de ambiente em uso.
  +
  +## Requisitos
  +
  +- Git, para versionamento e envio ao GitHub;
  +- Python 3, apenas para testar localmente;
  +- acesso ao GitHub e, para o servidor próprio, acesso SSH/SFTP ao
  provedor.
  +
  +## Executar e testar localmente
  +
  +Não abra os arquivos HTML diretamente pelo navegador (`file://`), pois o
  +JavaScript da aplicação precisa ser servido por HTTP.
  +
  +Na raiz do projeto:
  +
  +```bash
  +cd /caminho/para/paulo-veritas
  +python3 -m http.server 4173
  +```
  +
  +Abra <http://localhost:4173>. Para encerrar o servidor, use `Ctrl+C`.
  +
  +Checklist de teste:
  +
  +1. Verifique as páginas inicial, Sobre, Especialidades, Dúvidas, Contato
  e Blog.
  +2. Verifique menu, links internos, imagens e fontes.
  +3. Teste o botão de WhatsApp e confirme o número/mensagem antes de
  publicar.
  +4. Em tela pequena, teste o menu responsivo.
  +
  +## Build
  +
  +Nesta versão não há build a executar: os arquivos da raiz já são o
  resultado
  +publicável. Para fazer uma nova publicação, valide localmente e envie
  todos os
  +arquivos atuais, incluindo `_app/` e `media/`.
  +
  +> Não execute `npm install` ou `npm run build` neste repositório: não há
  +> manifesto de dependências nem fontes para essas etapas.
  +
  +## Publicar alterações no GitHub
  +
  +Confira o estado, registre as mudanças e envie para o repositório remoto:
  +
  +```bash
  +git status
  +git add .
  +git commit -m "Descreve a alteração realizada"
  +git push origin main
  +```
  +
  +O remoto atual é `https://github.com/Ezequias-ks/paulo-veritas.git`.
  +
  +Antes de cada envio, confirme que arquivos sensíveis não estão sendo
  incluídos:
  +
  +```bash
  +git status
  +git diff --cached
  +```
  +
  +## Publicar com GitHub Pages
  +
  +O site é compatível com GitHub Pages.
  +
  +1. No GitHub, abra o repositório e acesse **Settings > Pages**.
  +2. Em **Build and deployment**, selecione **Deploy from a branch**.
  +3. Escolha a branch `main` e a pasta `/(root)`.
  +4. Salve e aguarde a URL gerada pelo GitHub.
  +5. Após futuros `git push origin main`, aguarde a atualização da
  publicação.
  +
  +Para domínio próprio, configure-o nessa mesma tela e crie, no provedor de
  DNS,
  +os registros solicitados pelo GitHub. Só habilite HTTPS após a validação
  do
  +domínio.
  +
  +## Publicar em servidor próprio
  +
  +O servidor deve servir arquivos estáticos. Não é necessário Node.js,
  banco de
  +dados nem processo em execução.
  +
  +### Via SSH com rsync
  +
  +Substitua os valores entre `<...>` pelos dados reais do servidor:
  +
  +```bash
  +rsync -avz --delete \
  +  --exclude '.git/' \
  +  /caminho/para/paulo-veritas/ \
  +  <usuario>@<servidor>:/var/www/<dominio>/
  +```
  +
  +`--delete` remove do servidor arquivos que não existem mais localmente;
  use-o
  +somente após conferir o destino.
  +
  +### Nginx
  +
  +Exemplo de bloco de servidor:
  +
  +```nginx
  +server {
  +    listen 80;
  +    }
  +}
  +```
  +
  +```bash
  +sudo nginx -t
  +sudo systemctl reload nginx
  +```
  +
  +Configure o DNS para apontar o domínio ao IP do servidor e habilite HTTPS
  +
  +No GitHub, reverta o commit que causou o problema e publique novamente:
  +
  +```bash
  +git revert <hash-do-commit>
  +
  +Em servidor próprio, republique a última versão validada do repositório.

  Se aprovar este diff, adiciono o README.md exatamente nessa linha, sem
  fazer deploy nem push.

─ Worked for 6m 45s ────────────────────────────────────────────────────────


› esqueça o readme.md. Agora elabore o plano para deixar o projeto pronto
  para build e deploy considerando que vai ser github e também vou hopedar
  na hostinger plano premium web hosting, vou usar o ssh da hostinger para
  cominicar com o github. vou sempre alterar e desenvolver localmente, aqui
  nesta maquina, e subir sempre para o github e atualizar o projeto na
  hostinger via ssh buscando no github. Mostrar o diff para aprovação antes
  de executar.


• Entendido — vou desconsiderar o README.md proposto. Como o repositório
  atual só tem o site já gerado, o plano precisará incluir a recuperação de
  uma base de desenvolvimento (SvelteKit) antes de existir um build
  confiável. Vou checar se o código-fonte está disponível em outra pasta
  local; não farei alterações.

• Explored
  └ Search package.json in projetos
    Search *veritas* in projetos

◦ Searching the web

• Searched the web for site:support.hostinger.com Node.js Hosting Web
  Hosting Premium SSH Git deployment ...

◦ Searching the web

• Searched the web for site:support.hostinger.com Node.js Hosting Web
  Hosting Premium SSH Git deployment ...

────────────────────────────────────────────────────────────────────────────

• A solução recomendada é separar desenvolvimento de publicação:

  Máquina local
    ├─ branch main        → código-fonte e configuração
    ├─ npm run build      → gera dist/
    └─ npm run deploy     → publica dist/ na branch production

  GitHub
    ├─ main               → desenvolvimento
    └─ production         → somente arquivos estáticos prontos para servir

  Hostinger Premium
    └─ public_html        → clone da branch production
                           → atualização por Git via SSH/hPanel

  Isso evita depender de Node.js ou de um build no plano compartilhado da
  Hostinger. O servidor apenas busca e serve HTML, CSS, JavaScript, _app/ e
  media/.

  A Hostinger Premium oferece SSH restrito ao diretório da hospedagem e
  suporta deploy de repositório Git. Para repositório privado, a chave SSH
  gerada na Hostinger deve ser adicionada no GitHub como deploy key com
  permissão somente de leitura. A própria Hostinger documenta o fluxo de Git
  e a exigência de que o diretório de instalação esteja vazio no primeiro
  deploy: deploy de repositório Git
  (https://support.hostinger.com/en/articles/1583302-how-to-deploy-a-git-repository)
  e acesso SSH
  (https://support.hostinger.com/en/articles/1583645-how-to-enable-ssh-access).

  ## Situação que precisa ser resolvida primeiro

  O repositório atual só contém o site compilado. Não há fontes Svelte nem
  package.json; logo, não é possível reconstruir ou evoluir a aplicação
  original com segurança.

  Para não bloquear a publicação, proponho uma primeira etapa pragmática:
  transformar a versão estática atual em um projeto com build reproduzível.
  O conteúdo passará a viver em site/, e o build apenas validará e copiará
  esse conteúdo para dist/. Depois, se desejado, podemos fazer uma migração
  separada e controlada para SvelteKit usando fontes reais.

  ## Plano de implementação

  1. Preservar o estado atual em uma tag Git antes de reorganizar arquivos.
  2. Mover o conteúdo publicável atual para site/.
  3. Criar scripts Node sem dependências externas:
      - npm run dev: servidor local em http://localhost:4173;
      - npm run build: valida referências locais e gera dist/;
      - npm run preview: testa exatamente o conteúdo de dist/;
      - npm run deploy: publica dist/ na branch production.

  4. Adicionar .nvmrc, package.json, .gitignore e scripts de validação/
     publicação.

  5. Subir main; o deploy local criará/atualizará production.
  6. Na Hostinger:
      - habilitar SSH;
      - configurar uma chave SSH de leitura para o GitHub;
      - configurar o repositório/branch production no hPanel, com destino
        public_html;

      - inicialmente fazer o deploy pelo hPanel para evitar conflito com
        arquivos existentes;

      - em seguida, atualizar por SSH com git pull --ff-only ou habilitar o
        webhook de auto-deploy da Hostinger.

  7. Testar localmente, em URL temporária e no domínio com HTTPS.

  ## Diff proposto, ainda não aplicado

  diff --git a/.gitignore b/.gitignore
  @@
   node_modules/
  +dist/
  +.env.local
  +
  diff --git a/.nvmrc b/.nvmrc
  new file mode 100644
  +22
  +
  diff --git a/package.json b/package.json
  new file mode 100644
  +{
  +  "name": "paulo-veritas",
  +  "private": true,
  +  "version": "1.0.0",
  +  "scripts": {
  +    "dev": "node scripts/server.mjs site 4173",
  +    "build": "node scripts/build.mjs",
  +    "preview": "node scripts/server.mjs dist 4173",
  +    "deploy": "node scripts/deploy.mjs"
  +  },
  +  "engines": {
  +    "node": ">=22"
  +  }
  +}
  +
  diff --git a/scripts/build.mjs b/scripts/build.mjs
  new file mode 100644
  +// Valida os HTMLs e arquivos referenciados em site/.
  +// Remove a saída anterior e copia site/ integralmente para dist/.
  +// Falha quando houver referência local quebrada.
  +
  diff --git a/scripts/server.mjs b/scripts/server.mjs
  new file mode 100644
  +// Servidor HTTP local, sem dependências externas.
  +// Recebe o diretório a servir e a porta como argumentos.
  +
  diff --git a/scripts/deploy.mjs b/scripts/deploy.mjs
  new file mode 100644
  +// Exige git limpo e um build válido.
  +// Publica somente o conteúdo de dist/ na branch production.
  +// Não envia credenciais nem faz qualquer acesso à Hostinger.
  +
  diff --git a/site/index.html b/site/index.html
  new file mode 100644
  +<!-- conteúdo atual de index.html, movido sem alterações -->
  +
  diff --git a/site/sobre.html b/site/sobre.html
  new file mode 100644
  +<!-- conteúdo atual, movido sem alterações -->
  +
  diff --git a/site/servicos.html b/site/servicos.html
  new file mode 100644
  +<!-- conteúdo atual, movido sem alterações -->
  +
  diff --git a/site/duvidas.html b/site/duvidas.html
  new file mode 100644
  +<!-- conteúdo atual, movido sem alterações -->
  new file mode 100644
  +<!-- conteúdo atual, movido sem alterações -->
  +
  diff --git a/site/blog.html b/site/blog.html
  new file mode 100644
  +<!-- conteúdo atual, movido sem alterações -->
  +
  diff --git a/site/_app/... b/site/_app/...
  similarity index 100%
  rename from _app/...
  rename to site/_app/...
  +
  diff --git a/site/media/... b/site/media/...
  similarity index 100%
  rename from media/...
  rename to site/media/...
  +
  diff --git a/site/robots.txt b/site/robots.txt
  similarity index 100%
  rename from robots.txt
  rename to site/robots.txt

  A configuração de SSH na Hostinger e a chave de deploy no GitHub não
  entram no repositório nem neste diff; são credenciais e devem ser feitas
  no painel/servidor.

  Se aprovar, implemento essa estrutura e apresento o diff real completo
  antes de qualquer commit, push ou conexão com a Hostinger.

─ Worked for 1m 12s ────────────────────────────────────────────────────────


› aprovado.


• Vou implementar a estrutura aprovada sem conectar à Hostinger, criar
  chaves, fazer commit ou push. Primeiro verifico a versão local do Node e
  eventuais instruções do projeto; depois reorganizo o artefato estático,
  adiciono os scripts e valido dev, build e preview.

• Ran find .. -name AGENTS.md -print && node --version && npm --version &&
  │ git status --short --branch
  └ v20.20.1
    10.8.2
    ## main...origin/main
    ?? README.md

• Ran for guide in /home/ezequias/AGENTS.md /home/ezequias/projetos/
  │ AGENTS.md /home/ezequias/projetos/paulo-veritas/AGENTS.md; do if [ -f
  │ "$guide" ]; then printf '%s\n' "$guide"; cat "$guide"; fi; done
  │ … +4 lines
  └ /home/ezequias/.nvm/versions/node/v20.20.1/bin/node
    v20.20.1
    10.8.2
    ## main...origin/main
    ?? README.md

────────────────────────────────────────────────────────────────────────────

• Encontrei um README.md não rastreado já presente no diretório; como você
  pediu para esquecê-lo, vou preservá-lo sem tocar nele. A máquina tem Node
  20.20.1, então ajustarei a exigência do projeto para Node 20 (em vez do 22
  inicialmente sugerido).

• Ran mkdir -p site && git mv index.html sobre.html servicos.html
  │ duvidas.html contato.html blog.html robots.txt _app media site/ &&
  │ find site -maxdepth 2 -type f | sort | sed -n '1,80p' && git status
  │ … +1 lines
  └ site/_app/version.json
    site/blog.html
    … +60 lines (ctrl + t to view transcript)
    R  sobre.html -> site/sobre.html
    ?? README.md

• Edited 6 files (+179 -0)
  └ projetos/paulo-veritas/.gitignore (+1 -0)
    19  node_modules/
    20 +dist/
    21

  └ projetos/paulo-veritas/.nvmrc (+1 -0)
    1 +20.20.1

  └ projetos/paulo-veritas/package.json (+15 -0)
     1 +{
     2 +  "name": "paulo-veritas",
     3 +  "version": "1.0.0",
     4 +  "private": true,
     5 +  "description": "Pipeline de desenvolvimento e publicação do site e
        stático Veritas Psicologia.",
     6 +  "scripts": {
     7 +    "dev": "node scripts/server.mjs site 4173",
     8 +    "build": "node scripts/build.mjs",
     9 +    "preview": "node scripts/server.mjs dist 4173",
    10 +    "deploy": "node scripts/deploy.mjs"
    11 +  },
    12 +  "engines": {
    13 +    "node": ">=20.20.1"
    14 +  }
    15 +}

  └ projetos/paulo-veritas/scripts/build.mjs (+70 -0)
     1 +import { cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/prom
        ises';
     2 +import path from 'node:path';
     3 +import { fileURLToPath } from 'node:url';
     4 +
     5 +const root = path.resolve(path.dirname(fileURLToPath(import.meta.url
        )), '..');
     6 +const sourceDir = path.join(root, 'site');
     7 +const outputDir = path.join(root, 'dist');
     8 +const assetPattern = /(?:href|src)=["']([^"']+)["']/gi;
     9 +
    10 +async function walk(directory) {
    11 +  const entries = await readdir(directory, { withFileTypes: true });
    12 +  return (await Promise.all(entries.map(async (entry) => {
    13 +    const fullPath = path.join(directory, entry.name);
    14 +    return entry.isDirectory() ? walk(fullPath) : [fullPath];
    15 +  }))).flat();
    16 +}
    17 +
    18 +function isLocalReference(reference) {
    19 +  return reference
    20 +    && !reference.startsWith('#')
    21 +    && !reference.startsWith('/')
    22 +    && !reference.startsWith('//')
    23 +    && !/^[a-z][a-z\d+.-]*:/i.test(reference);
    24 +}
    25 +
    26 +async function validateReferences() {
    27 +  const files = await walk(sourceDir);
    28 +  const htmlFiles = files.filter((file) => file.endsWith('.html'));
    29 +  const missing = [];
    30 +
    31 +  for (const htmlFile of htmlFiles) {
    32 +    const html = await readFile(htmlFile, 'utf8');
    33 +    for (const match of html.matchAll(assetPattern)) {
    34 +      const reference = match[1];
    35 +      if (!isLocalReference(reference)) continue;
    36 +
    37 +      const relativePath = decodeURIComponent(reference.split(/[?#]/
        , 1)[0]);
    38 +      if (!relativePath) continue;
    39 +      const resolvedPath = path.resolve(path.dirname(htmlFile), rela
        tivePath);
    40 +      const relativeToSource = path.relative(sourceDir, resolvedPath
        );
    41 +
    42 +      if (relativeToSource.startsWith('..') || path.isAbsolute(relat
        iveToSource)) {
    43 +        missing.push(`${path.relative(root, htmlFile)}: referência f
        ora de site/: ${reference}`);
    44 +        continue;
    45 +      }
    46 +
    47 +      try {
    48 +        await stat(resolvedPath);
    49 +      } catch {
    50 +        missing.push(`${path.relative(root, htmlFile)}: arquivo não
        encontrado: ${reference}`);
    51 +      }
    52 +    }
    53 +  }
    54 +
    55 +  if (missing.length > 0) {
    56 +    throw new Error(`Referências locais inválidas:\n${missing.join('
        \n')}`);
    57 +  }
    58 +}
    59 +
    60 +try {
    61 +  await stat(path.join(sourceDir, 'index.html'));
    62 +} catch {
    63 +  throw new Error('site/index.html não encontrado.');
    64 +}
    65 +
    66 +await validateReferences();
    67 +await rm(outputDir, { recursive: true, force: true });
    68 +await mkdir(outputDir, { recursive: true });
    69 +await cp(sourceDir, outputDir, { recursive: true });
    70 +console.log('Build concluído: dist/');

  └ projetos/paulo-veritas/scripts/deploy.mjs (+40 -0)
     1 +import { cp, mkdtemp, rm } from 'node:fs/promises';
     2 +import os from 'node:os';
     3 +import path from 'node:path';
     4 +import { spawnSync } from 'node:child_process';
     5 +import { fileURLToPath } from 'node:url';
     6 +
     7 +const root = path.resolve(path.dirname(fileURLToPath(import.meta.url
        )), '..');
     8 +const outputDir = path.join(root, 'dist');
     9 +const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'pau
        lo-veritas-deploy-'));
    10 +
    11 +function run(command, args, options = {}) {
    12 +  const result = spawnSync(command, args, { cwd: root, encoding: 'ut
        f8', stdio: 'pipe', ...options });
    13 +  if (result.status !== 0) throw new Error(result.stderr.trim() || r
        esult.stdout.trim() || `${command} falhou.`);
    14 +  return result.stdout.trim();
    15 +}
    16 +
    17 +if (process.env.DEPLOY_CONFIRM !== 'production') {
    18 +  throw new Error('Deploy bloqueado. Execute: DEPLOY_CONFIRM=product
        ion npm run deploy');
    19 +}
    20 +
    21 +if (run('git', ['status', '--porcelain']) !== '') {
    22 +  throw new Error('Há alterações locais. Revise, faça commit ou guar
        de-as antes do deploy.');
    23 +}
    24 +
    25 +run(process.execPath, ['scripts/build.mjs']);
    26 +const remoteUrl = run('git', ['remote', 'get-url', 'origin']);
    27 +
    28 +try {
    29 +  run('git', ['init', '--initial-branch=production', temporaryDirect
        ory]);
    30 +  run('git', ['-C', temporaryDirectory, 'config', 'user.name', 'paul
        o-veritas deploy']);
    31 +  run('git', ['-C', temporaryDirectory, 'config', 'user.email', 'dep
        loy@localhost']);
    32 +  await cp(outputDir, temporaryDirectory, { recursive: true });
    33 +  run('git', ['-C', temporaryDirectory, 'add', '--all']);
    34 +  run('git', ['-C', temporaryDirectory, 'commit', '-m', 'Deploy stat
        ic site']);
    35 +  run('git', ['-C', temporaryDirectory, 'remote', 'add', 'origin', r
        emoteUrl]);
    36 +  run('git', ['-C', temporaryDirectory, 'push', '--force-with-lease'
        , 'origin', 'production']);
    37 +  console.log('Branch production atualizada no origin. Atualize a Ho
        stinger a partir dela.');
    38 +} finally {
    39 +  await rm(temporaryDirectory, { recursive: true, force: true });
    40 +}

  └ projetos/paulo-veritas/scripts/server.mjs (+52 -0)
     1 +import { createReadStream } from 'node:fs';
     2 +import { access, stat } from 'node:fs/promises';
     3 +import http from 'node:http';
     4 +import path from 'node:path';
     5 +import { fileURLToPath } from 'node:url';
     6 +
     7 +const root = path.resolve(path.dirname(fileURLToPath(import.meta.url
        )), '..');
     8 +const directoryName = process.argv[2];
     9 +const port = Number(process.argv[3] ?? 4173);
    10 +const siteRoot = path.resolve(root, directoryName ?? 'site');
    11 +const mimeTypes = {
    12 +  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=ut
        f-8',
    13 +  '.ico': 'image/x-icon', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg
        ',
    14 +  '.js': 'text/javascript; charset=utf-8', '.json': 'application/jso
        n; charset=utf-8',
    15 +  '.otf': 'font/otf', '.png': 'image/png', '.svg': 'image/svg+xml',
        '.txt': 'text/plain; charset=utf-8',
    16 +  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2
        '
    17 +};
    18 +
    19 +try {
    20 +  await access(siteRoot);
    21 +} catch {
    22 +  throw new Error(`Diretório não encontrado: ${directoryName}`);
    23 +}
    24 +
    25 +const server = http.createServer(async (request, response) => {
    26 +  try {
    27 +    const pathname = decodeURIComponent(new URL(request.url, 'http:/
        /localhost').pathname);
    28 +    const requestedPath = pathname === '/' ? '/index.html' : pathnam
        e;
    29 +    const filePath = path.resolve(siteRoot, `.${requestedPath}`);
    30 +    const relativePath = path.relative(siteRoot, filePath);
    31 +
    32 +    if (relativePath.startsWith('..') || path.isAbsolute(relativePat
        h)) {
    33 +      response.writeHead(403).end('Forbidden');
    34 +      return;
    35 +    }
    36 +
    37 +    const file = await stat(filePath);
    38 +    if (!file.isFile()) throw new Error('Not found');
    39 +
    40 +    response.writeHead(200, {
    41 +      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()
        ] ?? 'application/octet-stream',
    42 +      'Content-Length': file.size
    43 +    });
    44 +    createReadStream(filePath).pipe(response);
    45 +  } catch {
    46 +    response.writeHead(404, { 'Content-Type': 'text/plain; charset=u
        tf-8' }).end('Not found');
    47 +  }
    48 +});
    49 +
    50 +server.listen(port, '127.0.0.1', () => {
    51 +  console.log(`Servindo ${path.relative(root, siteRoot) || '.'} em h
        ttp://127.0.0.1:${port}`);
    52 +});

• Edited projetos/paulo-veritas/scripts/deploy.mjs (+5 -3)
     1 -import { cp, mkdtemp, rm } from 'node:fs/promises';
     1 +import { cp, mkdtemp, readdir, rm } from 'node:fs/promises';
     2  import os from 'node:os';
  └
    > paulo-veritas@1.0.0 build
    … +68 lines (ctrl + t to view transcript)
    ?? package.json
    ?? scripts/

✔ You approved codex to run npm run preview this time

◦ Running npm run preview
  └
    > paulo-veritas@1.0.0 preview
    > node scripts/server.mjs dist 4173

    Servindo dist em http://127.0.0.1:4173

✔ You approved codex to run curl -sS -o /dev/null -w 'index: %{http_code}\n'
  http://127.0.0.1:4173/ && cu... this time

• Ran curl -sS -o /dev/null -w 'index: %{http_code}\n'
  │ http://127.0.0.1:4173/ && curl -sS -o /dev/null -w 'css:
  │ %{http_code}\n'
  │ … +5 lines
  └ inexistente: 404

↳ Interacted with background terminal
  └

• Ran npm run preview
  └
    > paulo-veritas@1.0.0 preview
    > node scripts/server.mjs dist 4173

    Servindo dist em http://127.0.0.1:4173

────────────────────────────────────────────────────────────────────────────

• O build foi gerado e o preview respondeu corretamente: páginas, CSS e
  ativos retornaram 200; uma rota inexistente retornou 404. O servidor local
  foi encerrado. Agora faço a checagem final de integridade do diff; não
  haverá commit, push, criação de branch production nem acesso à Hostinger.

• Ran git diff --check && git diff --cached --check && git diff --stat &&
  │ printf '\n--- novos arquivos ---\n' && git status --short | rg '^\?\?'
  │ && printf '\n--- scripts disponíveis ---\n' && npm run
  └  .gitignore | 1 +
     1 file changed, 1 insertion(+)
    … +15 lines (ctrl + t to view transcript)
      deploy
        node scripts/deploy.mjs

• Ran git diff --cached --stat && git diff --cached --summary && git status
  │ --short
  └  {_app => site/_app}/immutable/assets/0.D18r2VAq.css         |   0
     .../immutable/assets/Acumin Pro Condensed._q2DblQp.otf      | Bin
    … +137 lines (ctrl + t to view transcript)
    ?? package.json
    ?? scripts/

• Ran git add .gitignore .nvmrc package.json scripts site && git diff
  │ --cached --check && git diff --cached --stat && git status --short
  └  .gitignore                                         |   1 +
     .nvmrc                                             |   1 +
    … +102 lines (ctrl + t to view transcript)
    R  sobre.html -> site/sobre.html
    ?? README.md

────────────────────────────────────────────────────────────────────────────

• Implementação concluída e validada.

  - Criei o pipeline em projetos/paulo-veritas/package.json, com dev, build,
    preview e deploy.

  - Movi o site publicado, sem alterar seu conteúdo, para projetos/paulo-
    veritas/site.

  - O build gera dist/, que permanece ignorado pelo Git.
  - Adicionei scripts de build, servidor local e publicação em projetos/
    paulo-veritas/scripts.

  - Testes aprovados: build concluído; todas as páginas e CSS responderam
    200 no preview; rota inexistente respondeu 404.

  - Não fiz commit, push, criei a branch production ou acessei a Hostinger.

  Fluxo a partir daqui:

  npm run dev
  npm run build
  npm run preview

  Após revisar e commitar as mudanças em main:

  git push origin main
  DEPLOY_CONFIRM=production npm run deploy

  O último comando publica somente dist/ na branch production. Na Hostinger,
  configure o repositório privado pela URL SSH, escolha a branch production
  e use uma pasta public_html inicialmente vazia. Depois, a atualização
  manual via SSH será:

  cd /home/<usuario>/domains/<dominio>/public_html
  git pull --ff-only origin production

  A mudança está toda preparada no stage, exceto por um README.md não
  rastreado que já existia e foi preservado conforme pedido. Ele impedirá o
  deploy enquanto permanecer ali; antes do primeiro deploy, será preciso
  decidir se ele deve ser removido ou incluído no Git.