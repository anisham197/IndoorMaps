#!/bin/bash
set -e
set -i

source /home/ubuntu/.bashrc

cd /home/ubuntu/app
pm2 stop www || true