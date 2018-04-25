#!/bin/bash
set -e
. $HOME/.nvm/nvm.sh
. $HOME/.profile
. $HOME/.bashrc

cd /home/ubuntu/app

pm2 start npm --name www -- start