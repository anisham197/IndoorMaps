#!/bin/bash
set -e

# update instance
apt-get -y update

cat > /tmp/subscript.sh << EOF
echo 'Starting installation of nvm, node, npm and pm2' >> /home/ubuntu/logs.txt
# START UBUNTU USERSPACE
echo "Setting up NodeJS Environment"
# TODO - check if nvm, nodejs is already installed
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.9/install.sh | bash
echo 'export NVM_DIR="$HOME/.nvm"' >> /home/ubuntu/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> /home/ubuntu/.bashrc
# Dot source the files to ensure that variables are available within the current shell
. /home/ubuntu/.nvm/nvm.sh
. /home/ubuntu/.profile
. /home/ubuntu/.bashrc
# Install NVM, NPM, Node.JS & Grunt
nvm install 8.11.1
nvm alias default 8.11.1
nvm ls
node --version
npm install -g pm2
pm2 update
echo 'Completed nvm, node, npm and pm2 installation' >> /home/ubuntu/logs.txt
EOF

chown ubuntu:ubuntu /tmp/subscript.sh && chmod a+x /tmp/subscript.sh
# sleep 1; su - ubuntu -c "/tmp/subscript.sh"