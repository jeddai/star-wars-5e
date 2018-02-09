FROM node:carbon
WORKDIR /home/jeddai/star-wars-5e
COPY package*.json ./
COPY .npmrc ./
RUN npm install
COPY . .
RUN npm run build-prod
EXPOSE 443
ENV PORT 443
ENV ENV prod
CMD ["npm", "start"]
