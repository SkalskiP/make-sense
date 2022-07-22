# Create image based on the official Node image from dockerhub
FROM node:14.17.6 as cache-image
WORKDIR /usr/src/app
# RUN npm install

# Build frontend
FROM cache-image as builder
WORKDIR /usr/src/app
COPY . /usr/src/app

# RUN yarn build
COPY package.json ./
RUN npm install
RUN npm rebuild node-sass
RUN export PUBLIC_URL=http://localhost:3000/labeler
# Build frontend
# FROM cache-image as builder
# WORKDIR /usr/src/app
COPY . .
CMD ["npm", "start"]