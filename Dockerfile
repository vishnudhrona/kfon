# Use a lightweight Nginx image for serving the prebuilt Vite app
FROM nginx:1.18.0-alpine

# Set working directory in container
WORKDIR /usr/share/nginx/html

# Remove the default nginx static files
RUN rm -rf ./*

# Copy the pre-built dist folder from your local machine to the container
# (Make sure you’ve already run `pnpm build` locally before building the image)
COPY dist/ ./

# Copy your custom nginx config (for SPA routing, etc.)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx default port)
EXPOSE 80

# Start nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]