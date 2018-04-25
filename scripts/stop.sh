#!/bin/bash
echo "Stopping Application"
. /home/ubuntu/.nvm/nvm.sh
. /home/ubuntu/.profile
. /home/ubuntu/.bashrc

pm2 stop www || true