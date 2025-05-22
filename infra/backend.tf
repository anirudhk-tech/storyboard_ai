terraform {
  backend "s3" {
    bucket         = "storyboard-tfstate"
    key            = "state/storyboard-prod.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
