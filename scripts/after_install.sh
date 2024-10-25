#!/bin/bash


cd /home/ubuntu/project/link-loop

sudo rm -rf config.env
sudo rm -rf config.env.stagging

echo "after install..................."

sudo aws s3 sync s3://link-loop-env/stagging .
sudo apt install unzip
sudo unzip env-file.zip
sudo cp config.env.stagging config.env
sudo rm -rf config.env.stagging

sudo npm install



