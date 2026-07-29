# Paulo Veritas

Site institucional estático da Veritas Psicologia.

## Estrutura

- `site/`: arquivos que devem ser editados e que compõem o site publicado;
- `site/media/`: imagens do site;
- `site/_app/`: CSS, JavaScript e fontes já gerados;
- `scripts/`: ferramentas locais de servidor, build e publicação;
- `dist/`: saída gerada pelo build. Não é versionada.

O projeto atual é uma versão estática já gerada. Não há código-fonte Svelte nem
dependências de front-end a instalar. Altere os arquivos HTML e os assets em
`site/`; não edite `dist/`, pois ele é recriado a cada build.

## Requisitos locais

- Git;
- Node.js 20.20.1 ou superior. A versão indicada está em `.nvmrc`.

Não é necessário executar `npm install`: os scripts usam somente módulos
internos do Node.js.

## Editar e testar localmente

1. Entre na pasta do projeto:

   ```bash
   cd /home/ezequias/projetos/paulo-veritas
   ```

2. Edite os arquivos necessários em `site/`, por exemplo:

   ```bash
   site/index.html
   site/contato.html
   site/media/
   ```

3. Inicie o servidor local:

   ```bash
   npm run dev
   ```

4. Abra <http://127.0.0.1:4173> no navegador. Use `Ctrl+C` para encerrar.

5. Gere e valide a versão que será publicada:

   ```bash
   npm run build
   npm run preview
   ```

`npm run build` verifica referências locais dos HTMLs e cria `dist/`. O comando
`preview` serve exatamente esse conteúdo em <http://127.0.0.1:4173>.

## Publicar no GitHub

A branch `main` guarda os arquivos de desenvolvimento. A branch `production`
guarda somente o conteúdo estático de `dist/`, que será usado pela Hostinger.

Após testar as alterações, registre e envie a `main`:

```bash
git status
git add .
git commit -m "Descreve a alteração"
git push origin main
```

Em seguida, com o repositório sem alterações pendentes, publique a versão
estática na branch `production`:

```bash
DEPLOY_CONFIRM=production npm run deploy
```

O script executa o build, cria uma publicação limpa e substitui apenas a branch
remota `production`. Ele não acessa a Hostinger. A confirmação explícita evita
publicações acidentais.

> Antes de publicar, `git status --short` deve estar vazio. Não deixe senhas,
> chaves SSH ou arquivos `.env` no repositório.

## Configuração inicial da Hostinger via SSH

Esta configuração é feita uma única vez. Use o hPanel para habilitar o acesso
SSH e copie o host, usuário e porta apresentados nele.

### 1. Dar acesso da Hostinger ao repositório privado

1. No hPanel, abra **SSH Access** e gere uma chave SSH para a hospedagem.
2. Copie a chave pública gerada.
3. No GitHub, abra o repositório em **Settings > Deploy keys > Add deploy key**.
4. Cole a chave, dê um nome como `Hostinger produção` e mantenha a permissão de
   escrita desabilitada. A Hostinger precisa somente ler o repositório.

### 2. Clonar a branch de produção no diretório público

O diretório `public_html` deve estar vazio no primeiro clone. Conecte usando os
dados fornecidos pelo hPanel:

```bash
ssh -p <PORTA_SSH> <USUARIO_SSH>@<HOST_SSH>
```

No servidor, ajuste `<DOMINIO>` e execute:

```bash
cd /home/<USUARIO_SSH>/domains/<DOMINIO>/public_html
git clone --branch production git@github.com:Ezequias-ks/paulo-veritas.git .
```

Confirme se o site abriu no domínio antes de seguir. Se a estrutura de pastas
for diferente, use o caminho de raiz exibido no hPanel em vez do exemplo acima.

## Atualizar a Hostinger após cada publicação

Depois de executar `DEPLOY_CONFIRM=production npm run deploy` na máquina local,
conecte ao servidor:

```bash
ssh -p <PORTA_SSH> <USUARIO_SSH>@<HOST_SSH>
cd /home/<USUARIO_SSH>/domains/<DOMINIO>/public_html
git status --short
git pull --ff-only origin production
```

`git status --short` deve estar vazio. Não edite arquivos diretamente na
Hostinger: isso pode impedir a atualização por `git pull` e as alterações serão
perdidas na publicação seguinte. Faça toda edição localmente em `site/`.

## Fluxo resumido

```text
editar site/ → npm run build/preview → commit e push da main
→ DEPLOY_CONFIRM=production npm run deploy → SSH na Hostinger → git pull
```

## Reversão

Para voltar ao conteúdo de um commit anterior, reverta-o na `main`, envie ao
GitHub e publique novamente:

```bash
git revert <HASH_DO_COMMIT>
git push origin main
DEPLOY_CONFIRM=production npm run deploy
```

Por fim, conecte à Hostinger e execute `git pull --ff-only origin production`.
