#!/bin/bash
source /home/ubuntu/.bashrc

cd /home/ubuntu/app

pm2 start bin/www -n www -i 0