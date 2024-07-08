FROM node:18.3.0-alpine3.15
COPY . /app
WORKDIR /app

RUN npm install

ENV WEBAPP_PORT=5443
ENV RESTAPI_PORT=5444
ENV DOMAIN="localhost"
ENV IP=127.0.0.1
ENV SECRET="abcdfg"
ENV MONGO_CONNETION_STRING="mongodb://admin:password@localhost:5445/"

CMD ["npm", "start"]