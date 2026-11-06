# Use the small official Nginx image to serve this static website.
FROM nginx:alpine

# Copy every page and browser-side file into Nginx's public web directory.
COPY index.html login.html signup.html profile.html style.css script.js auth.js /usr/share/nginx/html/

# Document that the container serves HTTP on port 80.
EXPOSE 80
