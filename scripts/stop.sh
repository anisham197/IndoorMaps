#!/bin/bash
set -e
. $HOME/.nvm/nvm.sh
. $HOME/.profile
. $HOME/.bashrc

pm2 delete www || true