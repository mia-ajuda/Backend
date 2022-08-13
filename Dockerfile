FROM node:lts-alpine

# Define o diretório de trabalho como /app
WORKDIR /app
# Copia os arquivos locais para o container
COPY ./ ./
# Instala as dependências do projeto
RUN yarn install

COPY ./ ./

CMD ["yarn", "start"]
