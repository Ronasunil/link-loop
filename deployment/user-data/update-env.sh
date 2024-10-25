#!/bin/bash


aws s3 sync s3://link-loop-env/stagging .
unzip env-file.zip
cp config.env.stagging config.env
rm config.env.stagging
sed -i "s/REDIS_CLIENT=.*/REDIS_CLIENT=redis:\/\/$ELASTIC_CACHE_ENDPOINT:6379/" config.env
sed -i "s|^REDIS_HOST=.*|REDIS_HOST=$ELASTIC_CACHE_ENDPOINT|" config.env
rm -rf env-file.zip
cp config.env config.env.stagging
zip env-file.zip config.env.stagging
aws s3 cp env-file.zip s3://link-loop-env/stagging/ 
rm -rf env-file.zip


