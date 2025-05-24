# Stage 1: Build the Angular app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files from the angular-dynamic-variables folder
COPY angular-dynamic-variables/package*.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm ci

# Install Angular CLI globally
RUN npm install -g @angular/cli@19

# Copy source code from the angular-dynamic-variables folder
COPY angular-dynamic-variables/ ./

# Build the Angular app for production
RUN ng build --configuration production

# Stage 2: Serve the app with nginx
FROM nginx:alpine

# Install bash for better script debugging
RUN apk add --no-cache bash

# Copy the built app from the previous stage
COPY --from=build /app/dist/angular-dynamic-variables/browser /usr/share/nginx/html/

# Copy your entry point script and template
COPY generate-env-config.sh /usr/local/bin/generate-env-config.sh
COPY env-config.template.js /usr/local/bin/env-config.template.js

# Fix line endings, verify, and make executable
RUN dos2unix /usr/local/bin/generate-env-config.sh || sed -i 's/\r$//' /usr/local/bin/generate-env-config.sh && \
    chmod +x /usr/local/bin/generate-env-config.sh && \
    ls -la /usr/local/bin/generate-env-config.sh && \
    head -1 /usr/local/bin/generate-env-config.sh | od -c

# Create the env-config.js file with proper permissions
RUN touch /usr/share/nginx/html/env-config.js && chmod 666 /usr/share/nginx/html/env-config.js

# Expose port 80
EXPOSE 80

# Run the script to generate env config before starting the application
ENTRYPOINT ["/bin/bash", "/usr/local/bin/generate-env-config.sh"]