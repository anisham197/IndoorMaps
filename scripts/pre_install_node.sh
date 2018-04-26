#!/bin/bash
set -e
echo "Step1: '$NVM_DIR'"
. $HOME/.bashrc
echo "Step2: '$NVM_DIR'"
if [ -f $HOME/.nvm/nvm.sh ]; then
    . $HOME/.nvm/nvm.sh
fi
echo "Step3: '$NVM_DIR'"
. $HOME/.profile
echo "Step4: '$NVM_DIR'"

echo "Starting installation of nvm, node, npm and pm2 as user '$USER'"
# START UBUNTU USERSPACE
echo "Setting up nvm"
if command -v nvm | grep -w 'nvm'; then
  echo "nvm already installed. Skipping nvm installation"
else
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.9/install.sh | bash
  if [ $? -eq 0 ]; then
      echo "Installed nvm successfully."
  else
      echo "nvm installation failed. Exiting."
      exit 1
  fi
fi
# Dot source the files to ensure that variables are available within the current shell
. "$HOME/.nvm/nvm.sh"
. "$HOME/.profile"
. "$HOME/.bashrc"

if ! command -v nvm | grep -w 'nvm'; then
  echo "nvm could not be found even after sourcing. Exiting."
  exit 1
fi

echo "Setting up NodeJS Environment"
if [ -x "$(command -v node)" ]; then
  echo "NodeJS already installed"
  if node --version | grep -w 'v8.11.1'; then
    echo "NodeJS v8.11.1 already installed. Skipping NodeJS v8.11.1 installation"
  else
    echo "NodeJS verion $(node --version) found. Installing v8.11.1"
    nvm install 8.11.1
    if [ $? -eq 0 ]; then
        nvm alias default 8.11.1
        echo "Installed NodeJS v8.11.1 successfully"
    else
        echo "NodeJS v8.11.1 installation failed. Exiting."
        exit 1
    fi
  fi
else
  echo "NodeJS not installed"
  nvm install 8.11.1
    if [ $? -eq 0 ]; then
        nvm alias default 8.11.1
        echo "Installed NodeJS v8.11.1 successfully"
    else
        echo "NodeJS v8.11.1 installation failed. Exiting."
        exit 1
    fi
fi

if ! [ -x "$(command -v npm)" ]; then
  echo "npm not found. Exiting."
  exit 1
fi

echo "Setting up pm2"
if [ -x "$(command -v pm2)" ]; then
  echo "pm2 already installed"
else
  npm install -g pm2
  if [ $? -eq 0 ]; then
    echo "Installed pm2 successfully"
  else
    echo "pm2 installation failed. Exiting."
    exit 1
  fi
fi

echo "nvm version: $(nvm --version)"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo "pm2 version: $(pm2 --version)"

echo 'Completed nvm, node, npm and pm2 installation'