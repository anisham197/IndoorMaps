#!/bin/bash
apt-get -y update
apt-get -y install ruby
apt-get -y install wget
cd /home/ubuntu/user-data
wget https://aws-codedeploy-ap-south-1.s3.amazonaws.com/latest/install
chmod +x ./install
./install auto
wget https://s3.amazonaws.com/aws-cloudwatch/downloads/latest/awslogs-agent-setup.py
wget https://s3.amazonaws.com/aws-codedeploy-us-east-1/cloudwatch/codedeploy_logs.conf
chmod +x ./awslogs-agent-setup.py
python3 awslogs-agent-setup.py -n -r ap-south-1 -c s3://aws-codedeploy-us-east-1/cloudwatch/awslogs.conf
mkdir -p /var/awslogs/etc/config
cp codedeploy_logs.conf /var/awslogs/etc/config/
service awslogs restart