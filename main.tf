provider "aws" {
  profile = "combinatorist"
  region = "us-east-1"
}

data "aws_caller_identity" "current" {}

# terraform {
#     backend "s3" {
#         bucket = "combinatorist-terraform-state"
#         key = "metadata-api.tfstate"
#         region = "us-east-1"
#     }
# }
