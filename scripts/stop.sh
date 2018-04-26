#!/bin/bash
set -e
echo "Step1: '$NVM_DIR'"
. $HOME/.nvm/nvm.sh
echo "Step2: '$NVM_DIR'"
. $HOME/.profile
echo "Step3: '$NVM_DIR'"
. $HOME/.bashrc
echo "Step4: '$NVM_DIR'"

pm2 delete www || true