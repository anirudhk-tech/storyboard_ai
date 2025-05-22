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


