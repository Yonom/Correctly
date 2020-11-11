FROM node:14

WORKDIR /var/task

# Install dependencies
COPY package*.json ./
COPY lib lib/
RUN npm ci --only=production

# Setup key.json
COPY . .
ARG ENCRYPTION_KEY
RUN bash .keys/decrypt.sh

# Build the app
ENV NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR /var/task/
ENV VERCEL_GITHUB_COMMIT_REF
ENV VERCEL_GITHUB_COMMIT_SHA
ENV NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_AUTH_TOKEN
RUN npm run build

CMD [ "npm", "start" ]
