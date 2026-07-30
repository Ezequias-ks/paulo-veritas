# Paulo Veritas

Site institucional estático da Veritas Psicologia.

## Estrutura

- `site/`: arquivos editáveis que compõem o site publicado.
- `site/media/`: imagens, ícones e demais arquivos estáticos.
- `site/_app/`: CSS, JavaScript e fontes já gerados.
- `scripts/`: ferramentas locais de desenvolvimento, build e deploy.
- `dist/`: saída gerada pelo build. Não é versionada.

O projeto atual é uma versão estática já gerada. Não há código-fonte Svelte nem dependências de front-end a instalar. Todas as alterações devem ser feitas em `site/`. Nunca edite `dist/`, pois ela é recriada automaticamente durante o build.

---

# Requisitos

- Git
- Node.js 20.20.1 ou superior (versão indicada em `.nvmrc`)

Não é necessário executar `npm install`, pois os scripts utilizam apenas módulos nativos do Node.js.

---

# Desenvolvimento local

Entre na pasta do projeto:

```bash
cd /home/ezequias/projetos/paulo-veritas
```

Edite os arquivos necessários em `site/`.

Exemplos:

```text
site/index.html
site/sobre.html
site/contato.html
site/media/
```

Inicie o servidor local:

```bash
npm run dev
```

Acesse:

```
http://127.0.0.1:4173
```

Quando terminar:

```
Ctrl + C
```

---

# Build

Gere a versão que será publicada:

```bash
npm run build
```

Visualize exatamente o conteúdo que será enviado:

```bash
npm run preview
```

---

# Publicação

A branch **main** contém o projeto de desenvolvimento.

A branch **production** contém exclusivamente os arquivos estáticos da pasta `dist`, utilizados pela hospedagem.

Antes de publicar:

```bash
git status --short
```

O resultado deve estar vazio.

Em seguida:

```bash
git add .
git commit -m "Descrição da alteração"
git push origin main
```

Publique:

```bash
DEPLOY_CONFIRM=production npm run deploy
```

O script:

- executa o build;
- cria um repositório Git temporário contendo apenas `dist`;
- recria a branch `production`;
- publica a branch `production` no GitHub.

Após o término será exibida uma mensagem confirmando a publicação.

---

# Atualizar a Hostinger

Conecte-se ao servidor:

```bash
ssh -p <PORTA_SSH> <USUARIO>@<HOST>
```

Entre na pasta do site:

```bash
cd /home/<USUARIO>/domains/<DOMINIO>/public_html
```

Atualize a branch publicada:

```bash
git fetch origin
git checkout production
git reset --hard origin/production
git clean -fd
```

Este procedimento sincroniza completamente o conteúdo publicado.

**Não utilize**:

```bash
git pull
```

A branch `production` é recriada durante o deploy e, por isso, o uso de `git pull` pode gerar divergências de histórico.

Nunca edite arquivos diretamente na Hostinger.

Todas as alterações devem ser feitas localmente em `site/`.

---

# Primeira configuração da Hostinger

Execute apenas uma vez.

## 1. Habilitar acesso SSH

No hPanel:

- habilite o SSH;
- gere uma chave SSH;
- copie a chave pública.

No GitHub:

Settings → Deploy keys → Add deploy key

Cole a chave pública.

Permissão:

- Somente leitura.

---

## 2. Primeiro clone

O diretório `public_html` deve estar vazio.

Conecte via SSH:

```bash
ssh -p <PORTA> <USUARIO>@<HOST>
```

Depois:

```bash
cd /home/<USUARIO>/domains/<DOMINIO>/public_html

git clone --branch production git@github.com:Ezequias-ks/paulo-veritas.git .
```

Confira:

```bash
git status
```

Resultado esperado:

```text
On branch production
Your branch is up to date with 'origin/production'.

nothing to commit, working tree clean
```

---

# Fluxo completo

```text
Editar arquivos em site/
        │
        ▼
npm run dev
        │
        ▼
npm run build
        │
        ▼
npm run preview
        │
        ▼
git add .
git commit
git push origin main
        │
        ▼
DEPLOY_CONFIRM=production npm run deploy
        │
        ▼
SSH Hostinger
        │
        ▼
git fetch origin
git checkout production
git reset --hard origin/production
git clean -fd
```

---

# Reverter uma publicação

Reverta o commit na `main`:

```bash
git revert <HASH>
git push origin main
```

Publique novamente:

```bash
DEPLOY_CONFIRM=production npm run deploy
```

Atualize a Hostinger:

```bash
git fetch origin
git checkout production
git reset --hard origin/production
git clean -fd
```

---

# Boas práticas

- Nunca edite arquivos em `dist/`.
- Nunca edite arquivos diretamente na Hostinger.
- Sempre publique a partir da branch `main`.
- Antes de publicar, confirme que `git status --short` está vazio.
- Nunca versione senhas, arquivos `.env` ou chaves privadas.