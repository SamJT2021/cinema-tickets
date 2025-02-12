FROM node:20.16-alpine3.19 AS base

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "start"]