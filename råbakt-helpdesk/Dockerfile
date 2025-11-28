# Use the official Node.js 20.4.0 LTS image as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN apk add --no-cache nodejs npm && \
    npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that your application listens on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]