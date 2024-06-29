# Use the official Node.js image as a base image
FROM node:20

WORKDIR /usr/src/app

COPY ./package.json ./
RUN npm install
COPY ./ .
RUN npm run build
ENV NODE_ENV=production
CMD ["npm", “run” ,"start"] # will launch the remix app when we run this Docker image.
