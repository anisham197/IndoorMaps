#!/bin/bash
set -e
echo "Step1: '$NVM_DIR'"
if [ -f $HOME/.nvm/nvm.sh ]; then
    . $HOME/.nvm/nvm.sh
fi
echo "Step2: '$NVM_DIR'"
. $HOME/.profile
echo "Step3: '$NVM_DIR'"
. $HOME/.bashrc
echo "Step4: '$NVM_DIR'"

cd /home/ubuntu/app

pm2 start npm --name www -- start