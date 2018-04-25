#!/bin/bash
set -e
set -i

source /home/ubuntu/.bashrc

cd /home/ubuntu/app

/home/ubuntu/.nvm/versions/node/v8.11.1/bin/pm2 start bin/www -n www -i 0
