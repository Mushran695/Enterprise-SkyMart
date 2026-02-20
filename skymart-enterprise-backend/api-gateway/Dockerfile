FROM nginx:stable-alpine
# Copy the standard main config (optional) and the site server block into conf.d
# We keep the main `nginx.conf` in the image default; ensure the server block is placed
# into `/etc/nginx/conf.d/default.conf` so nginx's main config (http { include /etc/nginx/conf.d/*.conf; }) can include it.
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
