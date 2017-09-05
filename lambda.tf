# define Archives to autozip the lambda source code
# from https://github.com/hashicorp/terraform/issues/8344#issuecomment-265548941

data "archive_file" "refresh_stats_zip" {
    type        = "zip"
    source_file = "refresh_stats.py"
    output_path = "refresh_stats.zip"
}

# Don't want to give developers permissions to create / destroy roles
# Currently finds the role by name in an existing account
# It would be better to read it directly from a terraform project
# Or, when necessary a different person is required to apply security changes
data "aws_iam_role" "lambda" {
  role_name = "lambda_role"
}

resource "aws_lambda_function" "refresh_stats"{
  filename = "refresh_stats.zip"
  function_name    = "refresh_stats"
  role             = "${data.aws_iam_role.lambda.arn}"
  handler          = "refresh_stats.last_modified"
  source_code_hash = "${data.archive_file.refresh_stats_zip.output_base64sha256}"
  runtime          = "python3.6"

  environment {
    variables = {
      S3_BUCKET = "${aws_s3_bucket_object.last_modified.bucket}"
      S3_KEY = "${aws_s3_bucket_object.last_modified.key}"
    }
  }
}

# The rest pertains to scheduling and triggering the lambda
resource "aws_cloudwatch_event_rule" "every5minutes" {
  name        = "every5minutes"
  description = "Run every 5 minutes"
  # This can also take cron expression
  schedule_expression = "cron(* * * * ? *)"
  is_enabled = true
}

resource "aws_cloudwatch_event_target" "refresh_stats" {
  rule      = "${aws_cloudwatch_event_rule.every5minutes.name}"
  target_id = "trigger-refresh_stats-lambda"
  arn       = "${aws_lambda_function.refresh_stats.arn}"
  # role_arn  = "${data.aws_iam_role.lambda.arn}"
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id   = "AllowExecutionFromCloudWatch"
  action         = "lambda:InvokeFunction"
  function_name  = "${aws_lambda_function.refresh_stats.function_name}"
  principal      = "events.amazonaws.com"
  source_arn     = "${aws_cloudwatch_event_rule.every5minutes.arn}"
}
