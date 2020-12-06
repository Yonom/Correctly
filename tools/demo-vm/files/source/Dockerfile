FROM node:14

WORKDIR /var/task

# Install dependencies
COPY package*.json ./
COPY lib lib/
RUN npm i

# Build the app
COPY . .
ENV VERCEL_GITHUB_COMMIT_REF=virtualbox
ENV VERCEL_GITHUB_COMMIT_SHA=demo
RUN npm run build

ENV PORT=80
CMD [ "npm", "start" ]
