#!/bin/bash

exec > /tmp/user_data.log 2>&1


check_dependency() {

    if command -v $1 > /dev/null 2>&1; then
        return 0

    else 
        return 1
    fi

}

#  install zip package
sudo apt install unzip


#  install codedeploy agent
sudo apt update
sudo apt install ruby-full -y
sudo apt install wget -y
cd /home/ubuntu
sudo wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
sudo chmod +x ./install
sudo ./install auto


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

#aws-cli installing
sudo curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
#  unzip is installed
sudo apt install unzip
sudo unzip awscliv2.zip
sudo ./aws/install --bin-dir /usr/local/bin --install-dir /usr/local/aws-cli --update

# folder
sudo mkdir /home/ubuntu/project
cd /home/ubuntu/project

git clone -b production https://github.com/Ronasunil/link-loop.git
cd link-loop

sudo aws s3 sync s3://link-loop-env/production .
sudo apt install unzip
sudo unzip env-file.zip
sudo cp config.env.production config.env
sudo rm -rf config.env.production

sudo npm install
sudo npm run build
sudo npm run start