FROM node:12.18-alpine
ENV NODE_ENV=production
ENV DOCKER=true
WORKDIR /ROOT
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm install -g @vue/cli
COPY . .
EXPOSE 8080
CMD ["npm", "run" , "serve"]

