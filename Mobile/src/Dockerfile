# Use the official Node.js 20.18.0 image as the base
FROM node:20.18.0

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker caching
COPY package.json ./
COPY package-lock.json ./

# Install dependencies using npm
RUN npm install

# Install Expo CLI globally
RUN npm install -g expo-cli

# Copy the rest of the application code
COPY . .

# Expose the port Expo uses (default is 19000 for the dev server)
EXPOSE 19000

# Start the Expo development server using npx expo start
CMD ["npx", "expo", "start", "--no-dev"] 
# --no-dev flag to disable dev mode for a more production-like environment inside Docker