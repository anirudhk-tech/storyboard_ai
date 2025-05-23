variable "aws_region" { 
  type = string  
  default = "us-east-1" 
}

variable "project_name" { 
  type = string  
  default = "storyboard" 
}

variable "vpc_cidr" { 
  type = string  
  default = "10.0.0.0/16" 
}

variable "azs" { 
  type = list(string) 
  default = ["us-east-1a","us-east-1b"] 
}

variable "public_subnets" { 
  type = list(string) 
  default = ["10.0.1.0/24","10.0.2.0/24"] 
}

variable "private_subnets" { 
  type = list(string) 
  default = ["10.0.11.0/24","10.0.12.0/24"] 
}

variable "helm_repo_url" {
  description = "Git repo (HTTPS) that holds your Helm chart"
  type        = string
}

variable "helm_release_name" {
  description = "What you want the release to be called (helm install <name> …)"
  type        = string
  default     = "storyboard"
}

variable "openai_key" {
  description = "OpenAI API key for the frontend"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Postgres password for the backend"
  type        = string
  sensitive   = true
}

variable "ssh_key_name" {
  description = "Key used to SSH into EC2 instance"
  type        = string
}

variable "public_domain" {
  description = "The domain name that the website is deployed on"
  type        = string
}

variable "frontend_service_port" {
  description = "The port that the frontend is served on"
  type        = number
  default     = 3000
}

variable "backend_service_port" {
  description = "The port that the backend is served on"
  type        = number
  default     = 4000
}

variable "chart_version" {
  description = "Version of helm chart"
  type        = string
}

