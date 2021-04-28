FROM node:12.18-alpine
ENV NODE_ENV=development
WORKDIR /ROOT
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install -g @vue/cli-service
RUN npm install --silent && mv node_modules ../
COPY . .
EXPOSE 8080
CMD ["npm", "run" , "serve"]

