#referencias 
#		https://nodejs.org/uk/docs/guides/nodejs-docker-webapp/
#		https://github.com/nodejs/docker-node/blob/c044d61e6d02756bb8ed1557b2f0c7a0d7fead6f/8.4/alpine/Dockerfile
#		



FROM node:alpine

# Set the working directory to /app
WORKDIR /app

# agrego sólo package.json
ADD ./package.json /app/package.json
#instalar las dependencias de package.json
RUN echo "v2"
RUN npm install
RUN mkdir shared

#instalar curl para poder correr el codecove
RUN npm install -g codecov
#agrego el resto de los archivos
ADD ./server.js /app/server.js
ADD ./wait-for-it.sh /app/wait-for-it.sh
ADD ./src /app/src
ADD ./database.js /app/database.js
ADD ./restartDatabase.js /app/restartDatabase.js
ADD ./integration-test /app/integration-test
ADD ./public /app/public

ADD ./test-cover-enviar-en-docker.sh /app/test-cover-enviar-en-docker.sh

RUN ["chmod", "+x" , "/app/wait-for-it.sh"]

#npm start hace que esto ande en el port 8080
EXPOSE 8080


CMD [ "npm", "start" ]
