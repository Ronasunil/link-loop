#!/bin/bash


cd /home/ubuntu/project/link-loop

sudo rm -rf config.env
sudo rm -rf config.env.production

echo "after install..................."

sudo aws s3 sync s3://link-loop-env/production .
sudo apt install unzip
sudo unzip env-file.zip
sudo cp config.env.production config.env
sudo rm -rf config.env.production

sudo npm install



