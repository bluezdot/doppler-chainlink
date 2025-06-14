FROM node:20

WORKDIR /app

# Install dependencies first for better caching
COPY package.json ./
RUN yarn

# Copy the rest of the monorepo
COPY . /app

EXPOSE 42069

CMD ["yarn", "dev"] 