#!/bin/bash
set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

# update instance
apt-get -y update

cat > /tmp/subscript.sh << EOF
# START UBUNTU USERSPACE
echo "Setting up NodeJS Environment"
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.9/install.sh | bash
echo 'export NVM_DIR="$HOME/.nvm"' >> /home/ubuntu/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> /home/ubuntu/.bashrc
# Dot source the files to ensure that variables are available within the current shell
. /home/ubuntu/.nvm/nvm.sh
. /home/ubuntu/.profile
. /home/ubuntu/.bashrc
# Install NVM, NPM, Node.JS & Grunt
nvm install --lts
nvm ls
node --version
npm install -g pm2
pm2 update
echo 'Completed nvm, node, npm and pm2 installation' >> /home/ubuntu/logs.txt
EOF

chown ubuntu:ubuntu /tmp/subscript.sh && chmod a+x /tmp/subscript.sh
echo 'Starting installation of nvm, node, npm and pm2' >> /home/ubuntu/logs.txt
sleep 1; su - ubuntu -c "/tmp/subscript.sh"