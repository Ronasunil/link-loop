resource "aws_alb" "main" {
  name                       = "main-alb"
  internal                   = false
  load_balancer_type         = "application"
  security_groups            = [aws_security_group.alb_sg.id]
  subnets                    = [aws_subnet.public_subnet_a.id, aws_subnet.private_subnet_b.id]
  enable_deletion_protection = false


  tags = {
    Name = "alb"
  }
}


resource "aws_alb_listener" "https_listner" {
  load_balancer_arn = aws_alb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = var.https_policy
  certificate_arn   = aws_acm_certificate.dev_cert.arn
  depends_on        = [aws_alb_target_group.alb_tg, aws_acm_certificate.dev_cert]

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.alb_tg.arn
  }

}


resource "aws_alb_listener" "http_listner" {
  load_balancer_arn = aws_alb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = 443
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}


resource "aws_alb_listener_rule" "service_rule" {
  listener_arn = aws_alb_listener.http_listner.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.alb_tg.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
  depends_on = [aws_alb.main, aws_alb_target_group.alb_tg]
}