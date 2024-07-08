FROM node:18.3.0-alpine3.15
COPY . /app
WORKDIR /app

ENV DOMAIN="localhost"
ENV RESTAPI_PORT=5444

RUN npm install

CMD ["npm", "start"]