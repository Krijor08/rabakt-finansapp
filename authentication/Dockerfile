FROM node:20-alpine

WORKDIR /app

COPY ../råbakt-helpdesk ./ 

RUN npm install

ENV PORT=3000

EXPOSE 3000
CMD ["node", "server.js"]
