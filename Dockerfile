# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:16 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
# RUN CI=true npm test
RUN npm run build
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
# server environment
FROM nginx:latest

#Copy certificate to /etc/ssl
COPY --from=build-stage /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY taskmanager.conf /etc/nginx/conf.d/nginx.conf

CMD ["nginx", "-g", "daemon off;"]