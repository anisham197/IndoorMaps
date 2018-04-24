#!/bin/bash
source /home/ubuntu/.bashrc

if [ ! -z "$DEPLOYMENT_GROUP_NAME" ]; then
 export NODE_ENV=$DEPLOYMENT_GROUP_NAME
fi

cd /home/ubuntu/app

pm2 start bin/www -n www -i 0