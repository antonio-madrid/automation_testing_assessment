# base image
FROM node:12-alpine

ENV APP /app

# set working directory
WORKDIR $APP

# install and cache app dependencies
COPY package.json $APP/package.json
RUN npm install  --silent

COPY . $APP

# start app
CMD ["npm", "start"]
