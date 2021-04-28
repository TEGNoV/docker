FROM node:12.18-alpine
ENV NODE_ENV=production
WORKDIR /ROOT
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm install -g nodemon
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
