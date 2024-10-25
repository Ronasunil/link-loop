#!/bin/bash

echo "before install..................."
pwd
cd /home/ubuntu/project

if [ -d "link-loop"]; then
    sudo rm -rf link-loop
else
    echo "No dir to delete"

fi