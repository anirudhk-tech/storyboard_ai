# Define terraform module
terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Define provider and region
provider "aws" {
  region = var.aws_region
}

# Create space in cloud with this config
module "vpc" {
  source = "./modules/vpc"

  name            = var.project_name
  cidr            = var.vpc_cidr
  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
  enable_nat_gateway = false
}

# Gateway to allow access to application
resource "aws_security_group" "app_sg" {
  name        = "${var.project_name}-sg"
  description = "Allow HTTP and SSH"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "NodePort for nginx"
    from_port   = 30080
    to_port     = 30080
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

# Spin up an ubuntu instance
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]   # Canonical account
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"] 
  }
}

# Give static eip for url
resource "aws_eip" "app_eip" {
  domain = "vpc"
  tags = {
    Name = "${var.project_name}-eip"
  }
}

resource "aws_eip_association" "app" {
  instance_id   = aws_instance.app.id
  allocation_id = aws_eip.app_eip.id
}

# Create the application in cloud
resource "aws_instance" "app" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t2.micro"
  key_name                    = "${var.ssh_key_name}"
  subnet_id                   = module.vpc.public_subnets[0]
  vpc_security_group_ids      = [aws_security_group.app_sg.id]
  associate_public_ip_address = true

  user_data = <<-EOF
  #!/usr/bin/env bash
  set -eux

  # 1. Install k3s & Helm
  curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="" sh -
  export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
  curl -s https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

  # 2. Add swap
  fallocate -l 1G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile

  # 3. Wait for the new chart version, then install it
  helm repo add storyboard_ai ${var.helm_repo_url}
  helm repo update
  until helm search repo storyboard_ai/helm-chart --version ${var.chart_version} | grep -q ${var.chart_version}; do
    echo "Waiting for Helm chart ${var.chart_version}…"
    sleep 5
    helm repo update
  done
  nohup helm upgrade --install ${var.helm_release_name} \
    storyboard_ai/helm-chart \
    --version ${var.chart_version} \
    --namespace default \
    --create-namespace \
    --set frontend.env.openaiKey=${var.openai_key} \
    --set backend.env.postgresPassword=${var.db_password} \
    --set db.password=${var.db_password} \
  > /var/log/helm.log 2>&1 &

  # 4. Install host-level nginx + certbot
  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y nginx certbot python3-certbot-nginx

  cat <<EOF2 > /etc/nginx/sites-available/default
  server {
    listen 80;
    server_name ${var.public_domain};

    # redirect all traffic to HTTPS
    return 301 https://$host$request_uri;
  }

  server {
    listen 443 ssl http2;
    server_name ${var.public_domain};

    ssl_certificate     /etc/letsencrypt/live/ai.storyboard.website/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ai.storyboard.website/privkey.pem;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    
    # forward everything into the chart’s nginx on NodePort 30080
    location / {
      proxy_pass         http://127.0.0.1:30080;
      proxy_http_version 1.1;
      proxy_set_header   Host              \$host;
      proxy_set_header   X-Real-IP         \$remote_addr;
      proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Proto \$scheme;
    }
  }
  EOF2

  nginx -t
  systemctl reload nginx

  # 6. Let’s Encrypt
  certbot --nginx \
    --agree-tos --redirect --hsts \
    -m anirudhkuppili@gmail.com \
    -d ai.${var.public_domain}

  exit 0
  EOF
}
