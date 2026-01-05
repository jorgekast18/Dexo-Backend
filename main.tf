terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# --- 1. RED (Networking) - La parte nueva para arreglar tu error ---

# Creamos una red privada virtual (VPC)
resource "aws_vpc" "lab_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = "lab-vpc" }
}

# Creamos una puerta de enlace para salir a Internet
resource "aws_internet_gateway" "lab_igw" {
  vpc_id = aws_vpc.lab_vpc.id
  tags = { Name = "lab-igw" }
}

# Creamos una subred pública (donde vivirá tu servidor)
resource "aws_subnet" "lab_subnet" {
  vpc_id                  = aws_vpc.lab_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true # ¡Importante! Para que te de IP pública
  availability_zone       = "us-east-1a"
  tags = { Name = "lab-subnet" }
}

# Tabla de enrutamiento para permitir tráfico de internet
resource "aws_route_table" "lab_rt" {
  vpc_id = aws_vpc.lab_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.lab_igw.id
  }
  tags = { Name = "lab-rt" }
}

# Asociamos la tabla a nuestra subred
resource "aws_route_table_association" "lab_assoc" {
  subnet_id      = aws_subnet.lab_subnet.id
  route_table_id = aws_route_table.lab_rt.id
}

# --- 2. SEGURIDAD (Firewall) ---

resource "aws_security_group" "lab_sg" {
  name        = "lab_security_group"
  description = "Permitir SSH y trafico web"
  vpc_id      = aws_vpc.lab_vpc.id # <--- AQUI estaba el error, ahora le decimos explícitamente la VPC

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress { # Tu Microservicio 1
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress { # Tu Microservicio 2
    from_port   = 8081
    to_port     = 8081
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- 3. INSTANCIA (Servidor) ---

resource "aws_instance" "lab_server" {
  ami           = "ami-0cff7528ff583bf9a" # Amazon Linux 2 (us-east-1)
  instance_type = "t2.micro"

  # Conectamos el servidor a la subred y firewall que acabamos de crear
  subnet_id              = aws_subnet.lab_subnet.id
  vpc_security_group_ids = [aws_security_group.lab_sg.id]

  user_data = file("install_docker.sh")

  tags = {
    Name = "Servidor-Laboratorio-Uni"
  }
}

output "server_ip" {
  value = aws_instance.lab_server.public_ip
}
