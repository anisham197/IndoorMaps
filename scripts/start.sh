#!/bin/bash
set -e
set -i 
source ~/.bashrc

cd /home/ubuntu/app

pm2 start npm --name www -- start
