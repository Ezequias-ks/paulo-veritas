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
  +    server_name <dominio> www.<dominio>;
  +    root /var/www/<dominio>;
  +    index index.html;
  +
  +    location / {
  +        try_files $uri $uri/ =404;
  +    }
  +}
  +```
  +
  +Após criar ou alterar a configuração:
  +
  +```bash
  +sudo nginx -t
  +sudo systemctl reload nginx
  +```
  +
  +Configure o DNS para apontar o domínio ao IP do servidor e habilite HTTPS
  com
  +o mecanismo usado pelo provedor (por exemplo, Certbot/Let's Encrypt).
  +
  +## Reversão
  +
  +No GitHub, reverta o commit que causou o problema e publique novamente:
  +
  +```bash
  +git revert <hash-do-commit>
  +git push origin main
  +```
  +
  +Em servidor próprio, republique a última versão validada do repositório.