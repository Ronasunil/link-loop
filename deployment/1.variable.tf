variable "aws_region" {
  description = "Region of aws"
  type        = string
  default     = "us-east-1"
}


variable "main_domain" {
  description = "Domain of the site"
  type        = string
  default     = "expora.info"
}

variable "dev_api_domain" {
  description = "Dev api domain"
  type        = string
  default     = "api.stagging.expora.info"
}


variable "vpc_cidr_blocks" {
  description = "VPC CIDR BLOCKS"
  type        = string
  default     = "10.0.0.0/16"
}


variable "vpc_availability_zones" {
  description = "Avialability zones of vpc"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}


variable "vpc_public_subnets" {
  description = "VPC public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "vpc_private_subnets" {
  description = "VPc private subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "global_cidr_block" {
  description = "Global cidr block"
  type        = string
  default     = "0.0.0.0/0"
}


variable "bastion_host-cidr" {
  description = "Bastion host cidr"
  type        = string
  default     = "152.58.202.240/32"
}


variable "https_policy" {
  description = "https policy"
  type        = string
  default     = "ELBSecurityPolicy-2016-08"
}


variable "iam_role_name" {
  description = "IAM role name"
  type        = string
  default     = "rona"
}


variable "iam_role_policy" {
  description = "IAM role policy"
  type        = string
  default     = "rona-policy"
}


variable "iam_role_profile_name" {
  description = "IAM role policy name"
  type        = string
  default     = "profile-rona"
}

variable "elastic_cache_node_type" {
  description = "Elastic cache node type"
  type        = string
  default     = "cache.t2.micro"
}


variable "elastic_cache_parameter_name" {
  description = "Elastic cache parameter name"
  type        = string
  default     = "default.redis7"
}


variable "ec2_instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.large"
}


variable "bastion_instance_type" {
  description = "Bastion instance type"
  type        = string
  default     = "t2.micro"
}


variable "code_deploy_role_name" {
  description = "Code deploy role name"
  type        = string
  default     = "link-loop-code-deploy"
}

variable "prefix" {
  description = "prefix"
  type        = string
  default     = "link-loop"
}


variable "project" {
  description = "project"
  type        = string
  default     = "linkloop"
}