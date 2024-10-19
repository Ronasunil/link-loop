resource "aws_placement_group" "placement_group" {
  name     = "placment-group"
  strategy = "spread"
}


resource "aws_autoscaling_group" "ec2_autoscaling" {
  name                      = "ec2-autoscaling"
  max_size                  = 5
  min_size                  = 2
  health_check_grace_period = 300
  health_check_type         = "ELB"
  desired_capacity          = 2
  force_delete              = true
  placement_group           = aws_placement_group.placement_group.id
  vpc_zone_identifier       = [aws_subnet.private_subnet_a.id, aws_subnet.private_subnet_b.id]
  target_group_arns         = [aws_alb_target_group.alb_tg.arn]

  launch_template {
    id      = aws_launch_template.autoscaling_template.id
    version = "$Latest"
  }



  depends_on = [aws_launch_template.autoscaling_template]

}