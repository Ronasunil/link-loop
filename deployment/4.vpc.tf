resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr_blocks
  instance_tenancy     = "default"
  enable_dns_hostnames = true

  tags = {
    Name = "main_vpc"
  }
}