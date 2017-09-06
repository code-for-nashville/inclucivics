# Create data object for aws caller
data "aws_caller_identity" "current" {}

# Create an AWS S3 bucket
resource "aws_s3_bucket" "data" {
  bucket = "inclucivics-data-${uuid()}"
  # ☠ careful the world is watching!!!
  acl    = "public-read"

  tags = {
    terraform_user = "${data.aws_caller_identity.current.user_id}"
    terraform = true
  }

  lifecycle {
    ignore_changes = ["bucket"]
  }
}

# Create a role for our Lambda function, "lambda_role"
data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name = "lambda_role"
  assume_role_policy = "${data.aws_iam_policy_document.assume_role.json}"
}

resource "aws_iam_role_policy_attachment" "lambda_s3" {
    role       = "${aws_iam_role.lambda.name}"
    policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

# Create the Lambda function
data "archive_file" "etl" {
    type        = "zip"
    source_dir = "scripts"
    output_path = "etl.zip"
}

resource "aws_lambda_function" "etl"{
  filename = "etl.zip"
  function_name    = "inclucivics-etl"
  role             = "${data.aws_iam_role.lambda.arn}"
  handler          = "data-import.main"
  source_code_hash = "${data.archive_file.etl.output_base64sha256}"
  runtime          = "nodejs6.10"

  environment {
    variables = {
      S3_BUCKET = "${aws_s3_bucket_object.last_modified.bucket}"
      S3_KEY = "${aws_s3_bucket_object.last_modified.key}"
    }
  }
}
