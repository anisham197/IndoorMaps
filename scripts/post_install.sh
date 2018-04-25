#!/bin/bash
set -e
set -i

source /home/ubuntu/.bashrc

cd /home/ubuntu/app

echo 'Running npm install' >> /home/ubuntu/logs.txt

pwd >> /home/ubuntu/logs.txt

echo "Current user: "$USER >> /home/ubuntu/logs.txt

echo "Path: "$PATH >> /home/ubuntu/logs.txt

echo "NVM_DIR: "$NVM_DIR >> /home/ubuntu/logs.txt

npm install

echo 'Completed npm install' >> /home/ubuntu/logs.txt



# # setup NODE_ENV
# if [ ! -z "$DEPLOYMENT_GROUP_NAME" ]; then
#     export NODE_ENV=$DEPLOYMENT_GROUP_NAME

#     hasEnv=`grep "export NODE_ENV" ~/.bash_profile | cat`
#     if [ -z "$hasEnv" ]; then
#         echo "export NODE_ENV=$DEPLOYMENT_GROUP_NAME" >> ~/.bash_profile
#     else
#         sed -i "/export NODE_ENV=\b/c\export NODE_ENV=$DEPLOYMENT_GROUP_NAME" ~/.bash_profile
#     fi
# fi

# rc denotes "run-control"
# add app to startup
hasRc=`grep "su -l $USER -c \"cd /home/ubuntu/app;sh ./scripts/run.sh\"" /etc/rc.local | cat`
if [ -z "$hasRc" ]; then
    # sudo sh -c "echo 'su -l $USER -c \"cd /home/ubuntu/app;sh ./scripts/run.sh\"' >> /etc/rc.local"
    sudo sed -i -e '$i \cd /home/ubuntu/app;sh ./scripts/run.sh\n' /etc/rc.local
fi