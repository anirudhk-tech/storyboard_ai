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

# Create the application in cloud
resource "aws_instance" "app" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t2.micro"
  subnet_id                   = module.vpc.public_subnets[0]
  vpc_security_group_ids      = [aws_security_group.app_sg.id]
  associate_public_ip_address = true

  user_data = <<-EOF
    # bash
    set -eux

    # Install lightweight kubernetes with default Traefik Ingress controller
    curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="" sh -

    # Install helm
    curl -s https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

    # Pulling helm chart from github pages
    helm repo add storyboard_ai ${var.helm_repo_url}
    helm repo update

    # Install the chart named "helm-chart" version "0.1.0"
    helm install ${var.helm_release_name} \
      storyboard_ai/helm-chart \
      --version 0.1.0 \
      --namespace default \
      --create-namespace
  EOF

}
