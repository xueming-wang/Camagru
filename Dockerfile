FROM node:18-alpine

WORKDIR /APP

COPY . .

RUN npm install
