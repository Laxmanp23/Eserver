FROM node:20.16.0
COPY . .
RUN npm install
EXPOSE 9000
CMD [ "node" ,"index.js" ]
