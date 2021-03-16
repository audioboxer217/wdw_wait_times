FROM node:15

WORKDIR /usr/src/app

COPY cronjob.package.json ./package.json

RUN npm install

COPY src/update_db.js .

CMD [ "node", "update_db.js" ]