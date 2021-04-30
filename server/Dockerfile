FROM --platform=linux/amd64 node:12.18-alpine
ENV NODE_ENV=production
ENV DOCKER=true
WORKDIR /ROOT
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN apk add g++ make python
RUN npm install sqlite3
RUN npm install --production --silent && mv node_modules ../
RUN npm install -g nodemon
RUN npm install express --save
RUN npm i express-session
COPY . .
EXPOSE 3000
CMD ["npm", "run" , "dev"]

