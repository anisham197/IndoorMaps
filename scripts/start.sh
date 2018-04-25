#!/bin/bash
set -e
echo "Starting Application"
. /home/ubuntu/.nvm/nvm.sh
. /home/ubuntu/.profile
. /home/ubuntu/.bashrc

cd /home/ubuntu/app

pm2 start npm --name www -- start
