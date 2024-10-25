
# Basion host
resource "aws_security_group" "bastion_host_sg" {
  name        = "bastion_host_sg"
  description = "Allow ssh access to bastion host"
  vpc_id      = aws_vpc.main.id


  tags = {
    Name = "bastion-host-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "bastion_host_sg_ingress_rule" {
  security_group_id = aws_security_group.bastion_host_sg.id
  ip_protocol       = "TCP"
  cidr_ipv4         = var.bastion_host-cidr
  from_port         = 22
  to_port           = 22

}



resource "aws_vpc_security_group_egress_rule" "bastion_host_sg_egress" {
  security_group_id = aws_security_group.bastion_host_sg.id
  ip_protocol       = "-1"
  cidr_ipv4         = var.global_cidr_block

}

# Application load balancer
resource "aws_security_group" "alb_sg" {
  name        = "alb_sg"
  description = "Allow access through http and https"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name = "alb-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "alb_sg__http_ingress" {
  from_port         = 80
  to_port           = 80
  ip_protocol       = "TCP"
  security_group_id = aws_security_group.alb_sg.id
  cidr_ipv4         = var.global_cidr_block
}


resource "aws_vpc_security_group_ingress_rule" "alb_sg__http_egress" {
  ip_protocol       = "TCP"
  security_group_id = aws_security_group.alb_sg.id
  from_port         = 443
  to_port           = 443
  cidr_ipv4         = var.global_cidr_block
}

resource "aws_vpc_security_group_egress_rule" "alb_sg_egress" {
  security_group_id = aws_security_group.alb_sg.id
  ip_protocol       = "-1"
  cidr_ipv4         = var.global_cidr_block
}

# Auto scaling
resource "aws_security_group" "auto_scaling_sg" {
  name        = "auto_scaling_sg"
  description = "Allow internet access to instance in auto scaling group"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name = "auto-scaling-sg"
  }
}



resource "aws_security_group_rule" "auto_scaling_http_ingress" {
  type                     = "ingress"
  protocol                 = "TCP"
  security_group_id        = aws_security_group.auto_scaling_sg.id
  from_port                = 80
  to_port                  = 80
  source_security_group_id = aws_security_group.alb_sg.id
}


resource "aws_security_group_rule" "auto_scaling_https_ingress" {
  type                     = "ingress"
  protocol                 = "TCP"
  security_group_id        = aws_security_group.auto_scaling_sg.id
  from_port                = 443
  to_port                  = 443
  source_security_group_id = aws_security_group.alb_sg.id
}


resource "aws_security_group_rule" "auto_scaling_ssh_ingress" {
  type                     = "ingress"
  protocol                 = "TCP"
  security_group_id        = aws_security_group.auto_scaling_sg.id
  from_port                = 22
  to_port                  = 22
  source_security_group_id = aws_security_group.bastion_host_sg.id
}

resource "aws_security_group_rule" "auto_scaling_web_server_ingress" {
  type                     = "ingress"
  protocol                 = "TCP"
  security_group_id        = aws_security_group.auto_scaling_sg.id
  from_port                = 5000
  to_port                  = 5000
  source_security_group_id = aws_security_group.alb_sg.id
}

resource "aws_vpc_security_group_egress_rule" "auto_scaling_egress" {
  ip_protocol       = "-1"
  security_group_id = aws_security_group.auto_scaling_sg.id
  cidr_ipv4         = var.global_cidr_block
}

# Elastic cache
resource "aws_security_group" "elastic_cache_sg" {
  name        = "elastic_cache_sg"
  description = "Allow access to elastic cache service"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name = "elastic-cache-sg"
  }
}


resource "aws_security_group_rule" "elastic_cache_server_ingress" {
  type                     = "ingress"
  protocol                 = "TCP"
  from_port                = 6379
  to_port                  = 6379
  security_group_id        = aws_security_group.elastic_cache_sg.id
  source_security_group_id = aws_security_group.auto_scaling_sg.id

  depends_on = [ aws_security_group.auto_scaling_sg ]
}


resource "aws_security_group_rule" "elastic_cache_ssh" {
  type                     = "ingress"
  protocol                 = "TCP"
  from_port                = 6379
  to_port                  = 6379
  security_group_id        = aws_security_group.elastic_cache_sg.id
  source_security_group_id = aws_security_group.bastion_host_sg.id

    depends_on = [aws_security_group.bastion_host_sg ]
}