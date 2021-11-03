FROM nginx:alpine

EXPOSE 80
EXPOSE 22

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./docker/setenv.sh /root
RUN chmod +x /root/setenv.sh

RUN mkdir -p /app/www

COPY ./component-dist /app/www/

CMD ["/root/setenv.sh"]
