#!/bin/bash

# update instance
apt-get -y update
if [ -x "$(command -v nginx)" ]; then
  echo "nginx already installed"
else
cat > /etc/nginx/sites-available/laberinto << EOF
server {
    listen 80;
    server_name beta.vendor.maps.goflo.in;

    location / {
        proxy_set_header   X-Forwarded-For \$remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         "http://127.0.0.1:3000";
    }
}
EOF
  apt-get -y install nginx
  service nginx start

  ln -s /etc/nginx/sites-available/laberinto /etc/nginx/sites-enabled/laberinto
  service nginx restart
fi
