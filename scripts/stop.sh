#!/bin/bash
set -e
. ~/.nvm/nvm.sh
. ~/.bashrc

cd /home/ubuntu/app
pm2 stop www || true