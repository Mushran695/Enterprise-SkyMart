FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy only server block config
COPY nginx.conf /etc/nginx/conf.d/default.conf
