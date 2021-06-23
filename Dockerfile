# STAGE 0
FROM node
WORKDIR /usr/src/app


COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN yarn install

COPY . /usr/src/app
ENV PORT 3000
EXPOSE 3000
CMD yarn serve -s build -p 3000
