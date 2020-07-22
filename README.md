<p align="center">
  <img src="https://i.imgur.com/5wtqEys.png" alt="Logo Mia Ajuda" width="50%"/>
</p>

<p align="center">
<a href="https://play.google.com/store/apps/details?id=com.unb.miaajuda" target="_blank"><img src="https://img.shields.io/badge/Mia%20Ajuda-Google%20Play-yellow"></a>
<a href="https://miaajuda.netlify.app/" target="_blank"><img src="https://img.shields.io/badge/Mia%20Ajuda-Website-blue"></a>
<a href="https://mia-ajuda.github.io/Documentation/#/" target="_blank"><img src="https://img.shields.io/badge/Mia%20Ajuda-Docs-purple"></a>
<a href="https://github.com/mia-ajuda/Backend/pulls" target="_blank"><img src="https://img.shields.io/github/issues-pr/mia-ajuda/Backend?color=red&label=Pull%20Requests"></a>
</p>

## Rode o Backend com Docker

### Dependências

Inicialmente, instale localmente as seguintes dependências:

1. Instale o [Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/);
2. Instale o [Docker Compose](https://docs.docker.com/compose/install/).

### Arquivos de Configuração

1. A aplicação utiliza-se de autenticação por meio do [firebase](https://firebase.google.com/), logo, insira na pasta `src/config` o arquivo `firebaseConfig-dev.js`. O arquivo de configuração obtido do firebase deve apresentar a seguinte fisionomia:

```js
const config = {
  type: '',
  project_id: '',
  private_key_id: '',
  private_key: '',
  client_email: '',
  client_id: '',
  auth_uri: '',
  token_uri: '',
  auth_provider_x509_cert_url: '',
  client_x509_cert_url: '',
};

const databaseURL = '';

module.exports = {
  config,
  databaseURL,
};
```

2. Crie um arquivo `.env` na raiz do projeto e preencha as seguintes variáveis de ambiente:

```env
LATITUDE_ENV=
LONGITUDE_ENV=
SENTRY_DSN=
NODE_ENV=development
DATABASE_URL=mongodb://mongo/miaAjudaDB
```

* O preenchimento do serviço de monitoramento de erros ([Sentry](https://sentry.io/)) é opcional. A latitude e a longitude serão utilizadas para popular exemplos de pedido de ajuda próximos a essa coordenada.

### Inicialização do Projeto

1. Na pasta principal do projeto, construa e inicialize a aplicação com o comando:

```bash
sudo docker-compose -f docker-compose.yml up --build
```

2. O backend estará disponível em: `http://localhost:8000/`.

### Configuração do ESLint

1. Instale globalmente o pacote do eslint: `npm i -g eslint`;
2. Na raiz do projeto, verifique a corretude do código com `eslint . --ext .js`; ou
3. Configure uma extensão no seu editor de texto preferido (exemplo: [VSCode - ESLINT](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint));
4. Abra o seu editor de texto na raiz do projeto `/Backend` e comece a desenvolver.
