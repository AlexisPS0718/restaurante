FROM node:18 AS Proyecto

ENV NODE_ENV = proyecto

WORKDIR /usr/src/frontend

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run dev

CMD [ "npm", "run", "dev" ]