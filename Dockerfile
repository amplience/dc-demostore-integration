FROM node:14

# create app directory
WORKDIR /usr/src/app

COPY package.json .

RUN npm install -g ts-node
RUN npm install

COPY . .

EXPOSE 6393

# ENTRYPOINT [ "npm", "run", "dev" ]
ENTRYPOINT [ "npm", "run", "start" ]
