FROM nginx:1.9.15-alpine
ARG DIST_FOLDER
RUN mkdir -p /usr/share/nginx/html/app
COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY ${DIST_FOLDER} /usr/share/nginx/html/app
RUN nginx -t
RUN rm -Rf /etc/nginx/conf.d
RUN ls -lah /etc/nginx
RUN ls -lah /usr/share/nginx/html
RUN ls -lah /usr/share/nginx/html/app
WORKDIR /usr/share/nginx/html/app
CMD ["nginx", "-g", "daemon off;"]