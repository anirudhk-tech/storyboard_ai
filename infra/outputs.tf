output "app_public_dns" {
  description = "Public DNS name of the EC2 running your app"
  value       = aws_instance.app.public_dns
}

output "app_public_ip" {
  description = "Elastic IP of the app"
  value       = aws_eip.app_eip.public_ip
}
