provider "aws" {
  profile = "combinatorist"
  region = "us-east-1"
}

data "aws_caller_identity" "current" {}

terraform {
    backend "s3" {
        # S3 bucket names are globally unique, so we'll get conflict
        # But we can't auto-create *backend* buckets in same terraform project
        # Create your (versioned!) bucket
        # Enter bucket name in command prompt after running `terraform init`
        # Bug: terraform uses default profile to access to s3 remote
        # So you really need `terraform init --backend-config 'profile=<profile>`
        # (see https://github.com/hashicorp/terraform/issues/5839#issuecomment-239900719)

        bucket = "terraform-state-b5d3b702-2814-d332-00bd-91ef2fcb6296"
        region = "us-east-1"
        key = "terraform-demo.tfstate" # resolve conflict if exists
    }
}
