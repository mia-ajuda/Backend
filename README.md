# Mia Ajuda - Backend

<a href="https://mia-ajuda.github.io/Documentation/#/" target="_blank"><img src="https://img.shields.io/badge/Mia%20Ajuda-2020.1-purple"></a>

## Rode com Docker

Para executar localmente a aplicação, proceda com os seguintes passos:

1. Instale o Docker [neste link](https://docs.docker.com/install/linux/docker-ce/ubuntu/).
2. Instale o Docker Compose [neste link](https://docs.docker.com/compose/install/).
3. Pegue o arquivo firebaseConfig.js e firebaseConfig-dev.js do drive na pasta firebase e coloque-o dentro da pasta config do projeto.
4. Crie um arquivo .env e dentro dele crie 2 váriaveis de ambiente LATITUDE_ENV= e LONGITUDE_ENV=
5. Coloque a latitude e longitude de sua casa nas variáveis de ambiente.
6. Na pasta principal do projeto, construa e inicialize a aplicação com o comando: `sudo docker-compose -f docker-compose.yml up --build`.
7. O backend estará disponível em: `http://localhost:8000/`.

*   Observação: por padrão, o docker-compose iniciará a API com `yarn start`.
