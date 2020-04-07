# Mia Ajuda - Backend

<a href="https://mia-ajuda.github.io/Documentation/#/" target="_blank"><img src="https://img.shields.io/badge/Mia%20Ajuda-2020.1-purple"></a>

## Rode com Docker

Para executar localmente a aplicação, proceda com os seguintes passos:

1. Instale o Docker [neste link](https://docs.docker.com/install/linux/docker-ce/ubuntu/).
2. Instale o Docker Compose [neste link](https://docs.docker.com/compose/install/).
3. Na pasta principal do projeto, construa e inicialize a aplicação com o comando: `sudo docker-compose -f docker-compose.yml up --build`.
4. O backend estará disponível em: `http://localhost:8000/`.

*   Observação: por padrão, o docker-compose iniciará a API com `yarn start`.