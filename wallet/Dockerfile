# Based on recommendations from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# Speed up Docker creation using cached layers: http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# Requires that:
#  - "@nestjs/cli": "^7.5.1" is moved from dev-dependencies to dependencies
#  - existence of package-lock.json 
#  - run "npm install" and "npm run build" locally to update package-lock.json
ENV NODE_ENV=production
RUN npm ci

# Set node environment variable to production

# Bundle app source
# TODO: should we only copy a whitelist or use docker ignore for blacklist?
COPY . . 

# RUN npm rebuild bcrypt --build-from-source

RUN npm run build

# No port exposed for microservice.
CMD [ "npm", "run", "start:dev" ]

# dev image: https://www.docker.com/blog/advanced-dockerfiles-faster-builds-and-smaller-images-using-buildkit-and-multistage-builds/
# docker build optimisation: https://brianchristner.io/what-is-docker-buildkit/