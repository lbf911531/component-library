#! /bin/sh -e

echo "setting environment config"
echo "$ARTEMIS_URL"

cat >> /etc/nginx/conf.d/hly-admin.conf <<EOF

  server {
    listen      80;
    server_name   localhost;
    gzip on;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    #gzip_http_version 1.0;
    gzip_comp_level 2;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary off;
    gzip_disable "MSIE [1-6]\.";

    proxy_read_timeout 600;

    location /base/ {
      proxy_pass http://49.235.130.71:3000/base/;
    }

    location /workflow/ {
      proxy_pass http://49.235.130.71:3000/workflow/;
    }

    location /file/ {
      proxy_pass http://49.235.130.71:3000/file/;
    }

    location /budget/ {
      proxy_pass http://49.235.130.71:3000/budget/;
    }

    location /expense/ {
      proxy_pass http://49.235.130.71:3000/expense/;
    }

    location / {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

        index index.html;
        alias /app/www/;
    }
 }

EOF

echo "starting web server"

nginx -g 'daemon off;'
