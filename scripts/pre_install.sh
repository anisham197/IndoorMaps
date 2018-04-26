#!/bin/bash

# update instance
apt-get -y update

if [ -x "$(command -v nginx)" ]; then
  echo "nginx already installed"
else
  apt-get -y install nginx
  if [ $? -eq 0 ]; then
    echo "Installed nginx successfully"
  else
    echo "nginx installation failed. Exiting."
    exit 1
  fi
fi

if [ ! -f /etc/nginx/sites-enabled/laberinto ]; then
  echo "nginx configuration for laberinto not found. Adding config file."
  cat > /etc/nginx/sites-available/laberinto << 'EOF'
server {
    listen 80;
    server_name beta.vendor.maps.goflo.in;

    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         "http://127.0.0.1:3000";
    }
}
EOF
  if [ -f /etc/nginx/sites-enabled/default ]; then
    rm -rf /etc/nginx/sites-enabled/default
  fi
  ln -s /etc/nginx/sites-available/laberinto /etc/nginx/sites-enabled/laberinto
else
  echo "nginx config file for laberinto found."
fi

service nginx restart
if [ $? -eq 0 ]; then
  echo "Started/Restarted nginx successfully"
else
  echo "Could not restart nginx. Exiting."
  exit 1
fi