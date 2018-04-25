#!/bin/bash

. /home/ubuntu/.nvm/nvm.sh
. /home/ubuntu/.profile
. /home/ubuntu/.bashrc

cd /home/ubuntu/app
pm2 stop www || true