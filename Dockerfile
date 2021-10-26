FROM node:14-alpine
MAINTAINER Ameen Sayegh
COPY ./* ~/app/
EXPOSE 80
WORKDIR ~/app
RUN npm install
CMD ["node", "main.js"]
