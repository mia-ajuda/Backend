# Mia Ajuda - Backend

<a href="https://2019-2-arquitetura-desenho.github.io/wiki/" target="_blank"><img src="https://img.shields.io/badge/Mia%20Ajuda-2020.1-purple"></a>

## Sobre o projeto

Projeto criado e desenvolvido por professores e estudantes da Faculdade do Gama (FGA), da Universidade de Brasília, com o intuito de contribuir com a sociedade em um momento de necessidade que estamos vivendo em relação à CoVid-19. O aplicativo tem o propósito de ser uma ferramenta de incentivo a ações sociais de ajuda e colaboração entre pessoas de comunidades e vizinhanças. O Mia Ajuda serve como um meio de ligação entre pessoas necessitadas e voluntários que possam ajudar, seja de forma imaterial (entretenimento, companhia, amparo psicológico), como de forma material (comida, objetos, itens de higiene pessoal).

## Rode com Docker

Para executar localmente a aplicação, proceda com os seguintes passos:

1. Instale o Docker [neste link](https://docs.docker.com/install/linux/docker-ce/ubuntu/).
2. Instale o Docker Compose [neste link](https://docs.docker.com/compose/install/).
3. Na pasta principal do projeto, construa e inicialize a aplicação com o comando: `sudo docker-compose -f docker-compose.yml up --build`.
4. O backend estará disponível em: `http://localhost:8000/`.

*   Observação: por padrão, o docker-compose iniciará a API com `yarn start`.