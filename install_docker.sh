#!/bin/bash
# Actualizar e instalar Docker
yum update -y
amazon-linux-extras install docker -y
service docker start
usermod -a -G docker ec2-user

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Preparar carpeta para tu app
mkdir -p /home/ec2-user/app
chown -R ec2-user:ec2-user /home/ec2-user/app
