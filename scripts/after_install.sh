#!/bin/bash


cd /home/ubuntu/project/link-loop

sudo rm -rf config.env
sudo rm -rf config.env.development

echo "after install..................."

sudo aws s3 sync s3://link-loop-env/development .
sudo apt install unzip
sudo unzip env-file.zip
sudo cp config.env.development config.env
sudo rm -rf config.env.development

sudo npm install



