provider "aws" {
  region = "us-east-1"
}

# data bucket lambda writes to
resource "aws_s3_bucket" "data" {
  acl = "public-read"
  # The bucket name is hardcoded into the app
  # Make sure to change there if you change me!
  bucket = "codefornashville-inclucivics-c9b520"

  cors_rule {
    allowed_methods =["GET"]
    allowed_origins = ["*"]
  }

  versioning {
    enabled = true
  }
}

# handler archive
data "archive_file" "ingest" {
    type        = "zip"
    source_dir  = "ingest"
    output_path = "ingest.zip"
}

data "aws_iam_policy_document" "s3" {
  statement {
    sid = "1"
    actions = [
      "s3:*",
    ]
    resources = [
      "${aws_s3_bucket.data.arn}",
      "${aws_s3_bucket.data.arn}/*",
    ]
  }
}

module "scheduled_ingest" {
  source              = "github.com/terraform-community-modules/tf_aws_lambda_scheduled"
  lambda_name         = "inclucivics_ingest"
  runtime             = "nodejs6.10"
  lambda_zipfile      = "ingest.zip"
  source_code_hash    = "${data.archive_file.ingest.output_base64sha256}"
  handler             = "index.handler"
  schedule_expression = "rate(1 day)"
  timeout             = 200
  iam_policy_document = "${data.aws_iam_policy_document.s3.json}"
}
