#/bin/bash


aws s3 sync s3://link-loop-env/development .
unzip env-file.zip
cp config.env.development config.env
rm config.env.development
sed -i "s/REDIS_CLIENT=.*/REDIS_CLIENT=redis:\/\/$ELASTIC_CACHE_ENDPOINT:6379/" config.env
sed -i "s|^REDIS_HOST=.*|REDIS_HOST=$ELASTIC_CACHE_ENDPOINT|" config.env
rm -rf env-file.zip
cp config.env config.env.development
zip env-file.zip config.env.development
aws s3 cp env-file.zip s3://link-loop-env/development/ 
rm -rf env-file.zip


