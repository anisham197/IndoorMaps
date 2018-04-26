#!/bin/bash
set -e
echo "Step1: '$NVM_DIR'"
. $HOME/.bashrc
echo "Step2: '$NVM_DIR'"
. $HOME/.profile
echo "Step3: '$NVM_DIR'"
if [ -f $HOME/.nvm/nvm.sh ]; then
    . $HOME/.nvm/nvm.sh
fi
echo "Step4: '$NVM_DIR'"

pm2 delete www || true