FROM node:14

WORKDIR /usr/src/app

# Setup key.json
COPY .keys .keys/
ARG ENCRYPTION_KEY
RUN bash .keys/decrypt.sh

# Install dependencies
COPY package*.json ./
COPY lib lib/
RUN npm ci --only=production

# Build the app
COPY . .
RUN npm run build

CMD [ "npm", "start", "--" ]