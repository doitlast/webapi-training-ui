# Stage 1: Build the React app
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the React app using nginx
FROM nginx:alpine

# Copy the built React app from the builder stage to nginx's html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Optionally, customize nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP
EXPOSE 80

# nginx starts automatically
CMD ["nginx", "-g", "daemon off;"]