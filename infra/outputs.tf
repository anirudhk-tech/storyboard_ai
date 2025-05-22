output "app_public_dns" {
  description = "Elastic, Persisitent DNS of the app"
  value       = aws_eip.app_eip.public_dns
}

output "app_public_ip" {
  description = "Elastic IP of the app"
  value       = aws_eip.app_eip.public_ip
}
