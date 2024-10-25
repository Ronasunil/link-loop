resource "aws_iam_role" "codedeploy_iam_role" {
  name = var.code_deploy_role_name
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "codedeploy.amazonaws.com"
        }
      },
    ]
  })

  tags = {
    tag-key = "codedeply-policy"
    Name    = "link-loop-codedeploy-policy"
  }
}


resource "aws_iam_policy" "codedeploy_policy" {
  name        = "codedeploy-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "codedeploy:*",
          "iam:PassRole",
          "ec2:*",
          "s3:*",
          "autoscaling:*",
          "elasticloadbalancing:*",
          "cloudwatch:*",
          "logs:*",
          "sns:*",
          "ssm:*"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}


resource "aws_iam_role_policy_attachment" "codedeploy_policy_attachment" {
  role       = aws_iam_role.codedeploy_iam_role.name
  policy_arn = aws_iam_policy.codedeploy_policy.arn
}