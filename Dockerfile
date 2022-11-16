FROM node:18



COPY package*.json ./

RUN npm config set legacy-peer-deps true

RUN npm i


COPY . .

CMD ["npm", "run" ,"start:dev"]

