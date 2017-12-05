FROM node:8.2

ENV NODE_ENV=development
ENV DEBUG=true

#RUN npm install -g nodemon

WORKDIR /home/node/server/client
COPY client .
#COPY client/package.json .
#COPY client/package-lock.json .
#RUN ["npm", "install"]

WORKDIR /home/node/server
COPY package.json .
COPY package-lock.json .
RUN ["npm", "install"]

#EXPOSE 3000
EXPOSE 3001
EXPOSE 5858
VOLUME ["/home/node/server/src"]
#VOLUME ["/home/node/server/client/src"]
#VOLUME ["/home/node/server/client/public"]
VOLUME ["/home/node/server/client/build"]

#RUN chown -R node:users /home/node/server
USER node
CMD [ "npm", "start" ]

