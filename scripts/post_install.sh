#!/bin/bash
set -e

cd /home/ubuntu/app
npm install

# setup NODE_ENV
if [ ! -z "$DEPLOYMENT_GROUP_NAME" ]; then
    export NODE_ENV=$DEPLOYMENT_GROUP_NAME

    hasEnv=`grep "export NODE_ENV" ~/.bash_profile | cat`
    if [ -z "$hasEnv" ]; then
        echo "export NODE_ENV=$DEPLOYMENT_GROUP_NAME" >> ~/.bash_profile
    else
        sed -i "/export NODE_ENV=\b/c\export NODE_ENV=$DEPLOYMENT_GROUP_NAME" ~/.bash_profile
    fi
fi

# rc denotes "run-control"
# add app to startup
hasRc=`grep "su -l $USER -c \"cd /home/ubuntu/app;sh ./scripts/run.sh\"" /etc/rc.local | cat`
if [ -z "$hasRc" ]; then
    # sudo sh -c "echo 'su -l $USER -c \"cd /home/ubuntu/app;sh ./scripts/run.sh\"' >> /etc/rc.local"
    sudo sed -i -e '$i \cd /home/ubuntu/app;sh ./scripts/run.sh\n' /etc/rc.local
fi