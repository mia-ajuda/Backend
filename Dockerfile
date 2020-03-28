FROM node:12.2.0-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY ./ ./