resource "aws_s3_bucket" "website" {
  bucket = "terraform-demo-${uuid()}"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  tags = {
    terraform_user = "${data.aws_caller_identity.current.user_id}"
    terraform = true
  }
  lifecycle {
    ignore_changes = ["bucket"]
  }
}

resource "aws_s3_bucket_object" "home_page" {
  bucket = "${aws_s3_bucket.website.bucket}"
  key    = "index.html"
  source = "index.html"
  acl    = "public-read"
  etag   = "${md5(file("index.html"))}"
  content_type = "text/html"
  storage_class = "REDUCED_REDUNDANCY"


  tags = {
    terraform_user = "${data.aws_caller_identity.current.user_id}"
    terraform = true
  }
}

resource "aws_s3_bucket_object" "error_page" {
  bucket = "${aws_s3_bucket.website.bucket}"
  key    = "error.html"
  source = "error.html"
  acl    = "public-read"
  etag   = "${md5(file("error.html"))}"
  content_type = "text/html"
  storage_class = "REDUCED_REDUNDANCY"


  tags = {
    terraform_user = "${data.aws_caller_identity.current.user_id}"
    terraform = true
  }
}

resource "aws_s3_bucket_object" "architecture_image" {
  bucket = "${aws_s3_bucket.website.bucket}"
  key    = "docs/architecture.dot.png"
  source = "docs/architecture.dot.png"
  acl    = "public-read"
  etag   = "${md5(file("docs/architecture.dot.png"))}"
  storage_class = "REDUCED_REDUNDANCY"

  tags = {
    terraform_user = "${data.aws_caller_identity.current.user_id}"
    terraform = true
  }
}

resource "aws_s3_bucket_object" "last_modified" {
  bucket = "${aws_s3_bucket.website.bucket}"
  key    = "last_modified.html"
  content = "initialize"
  acl    = "public-read"
  # etag   = "${md5(file("docs/architecture.dot.png"))}"
  content_type = "text/html"
  storage_class = "REDUCED_REDUNDANCY"

  tags = {
    terraform_user = "${data.aws_caller_identity.current.user_id}"
    terraform = true
  }
}
