#!/bin/bash
set -e
. /home/ubuntu/.nvm/nvm.sh
. /home/ubuntu/.bashrc

cd /home/ubuntu/app

pm2 start npm --name www -- start
