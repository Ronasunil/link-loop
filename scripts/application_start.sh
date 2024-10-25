#!/bin/bash

echo "app start..................."

cd /home/ubuntu/project
cd link-loop

sudo pm2 stop all 
sudo pm2 delete all

sudo npm run build
sudo npm start 


