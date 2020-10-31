FROM node:14

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
COPY lib lib/
RUN npm ci --only=production

# Setup key.json
COPY . .
ARG ENCRYPTION_KEY
RUN bash .keys/decrypt.sh

# Build the app
ARG VERCEL_GITHUB_COMMIT_REF
ARG VERCEL_GITHUB_COMMIT_SHA
RUN npm run build
CMD [ "npm", "start" ]