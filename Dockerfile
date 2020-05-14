FROM node:12.2.0-alpine

# Define o diretório de trabalho como /app
WORKDIR /app
# Copia os arquivos locais para o container
COPY ./ ./
# Instala as dependências do projeto
RUN yarn install
