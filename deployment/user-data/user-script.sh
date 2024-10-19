#!/bin/bash

exec > /tmp/user_data.log 2>&1


check_dependency() {

    if command -v $1 > /dev/null 2>&1; then
        return 0

    else 
        return 1
    fi

}

# check unzip is installed
if check_dependency "unzip"; then
    echo "unzip is already installed"
else
    sudo apt-get install unzip awscli
fi    

# check node is installed

if check_dependency "node"; then
    echo "node is already installed"
else   
    echo "node is installing..."
    sudo apt-get update && sudo apt-get upgrade
    sudo apt-get install -y curl
    curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
    sudo -E bash nodesource_setup.sh
    sudo apt-get install -y nodejs
    echo node -v

fi

sudo npm install -g typescript
# check git is installed

if check_dependency "git"; then
    echo "git is already installed"
else
    echo "git is installing..."
    sudo apt install git-all
    echo git -v
fi

if check_dependency "docker"; then
    echo "docker is installed"
else
    echo "docker is installing..."

    sudo apt-get update
    sudo apt-get install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    echo "docker -v"
    sudo systemctl start docker
    sudo docker pull redis
    sudo docker run -d --name link-loop-redis -p 6379:6379  redis   

fi
#install pm2

if check_dependency "pm2"; then
    echo "pm2 already installed"
else
    echo "pm2 is installing..."
    npm install -g pm2
fi


git clone -b development https://github.com/Ronasunil/link-loop.git
cd /link-loop

aws s3 sync s3://link-loop-env/development .
unzip env-file.zip
cp config.env.development config.env

npm install
npm run build
npm run start