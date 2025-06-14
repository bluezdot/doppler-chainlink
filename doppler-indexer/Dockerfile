FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for native modules if needed
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json ./

# Install dependencies
RUN yarn

# Copy source code
COPY . .

# Expose port
EXPOSE 42069
