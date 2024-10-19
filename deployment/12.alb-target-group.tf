resource "aws_alb_target_group" "alb_tg" {
  name     = "main-tg"
  vpc_id   = aws_vpc.main.id
  port     = 5000
  protocol = "HTTP"

  health_check {
    path                = "/health"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 100
    matcher             = "200"
    interval            = 120
  }

  stickiness {
    type        = "app_cookie"
    cookie_name = "session"
  }


}