output "vpc_id"                 { value = module.this.vpc_id }
output "public_subnets"         { value = module.this.public_subnets }
output "private_subnets"        { value = module.this.private_subnets }
output "default_security_group_id" { value = module.this.default_security_group_id }