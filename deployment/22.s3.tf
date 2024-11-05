resource "aws_s3_bucket" "code_deploy" {
  bucket = "${local.prefix}-backend"

  tags = {
    Name        = "link-loop-bucket"
    Environment = terraform.workspace
  }

  force_destroy = true
  lifecycle {
    create_before_destroy = true
  }

}


resource "aws_s3_bucket_ownership_controls" "code_deploy_ownership" {
  bucket = aws_s3_bucket.code_deploy.id


  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}


resource "aws_s3_bucket_acl" "code_deploy_backend_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.code_deploy_ownership]
  bucket     = aws_s3_bucket.code_deploy.id
  acl        = "private"
}


resource "aws_s3_bucket_versioning" "code_deploy_backend_versioning" {
  bucket = aws_s3_bucket.code_deploy.id
  versioning_configuration {
    status = "Enabled"
  }
}


resource "aws_s3_bucket_public_access_block" "code_deploy_backend_public_access" {
  bucket = aws_s3_bucket.code_deploy.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}