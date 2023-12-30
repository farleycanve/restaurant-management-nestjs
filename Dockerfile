#Development stage
FROM node:18-alpine as base

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

#expose the port where the listening is, should change to 6868 if running real beta
EXPOSE 6868

CMD ["yarn", "start:prod"]
