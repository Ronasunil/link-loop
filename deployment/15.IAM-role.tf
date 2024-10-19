resource "aws_iam_role" "main_iam-role" {
  name = "ec2_iam_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = ["ec2.amazonaws.com", "autoscaling.amazonaws.com"]
      }
    }]
  })


  tags = {
    tag-key = "main-iam-role"
  }
}

resource "aws_iam_policy" "main_iam_role_policy" {
  policy = <<EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": [
          "ec2:*",
          "s3:*",
          "autoscaling:*",
          "elasticloadbalancing:*",
          "cloudwatch:*",
          "logs:*",
          "sns:*",
          "ssm:*"
        ],
        "Effect": "Allow",
        "Resource": "*"
      }
    ]
  }
  EOF

}


resource "aws_iam_role_policy_attachment" "main_iam_role_attachment" {
  role = aws_iam_role.main_iam-role.name
  policy_arn = aws_iam_policy.main_iam_role_policy.arn
}


resource "aws_iam_instance_profile" "main_iam_role_profile" {
  name = var.iam_role_profile_name
  role = aws_iam_role.main_iam-role.name
  
}