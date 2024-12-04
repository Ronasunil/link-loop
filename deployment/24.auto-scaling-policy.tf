resource "aws_autoscaling_policy" "ec2_scale_up" {
  name                   = "ec2-scale-up"
  scaling_adjustment     = 1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.ec2_autoscaling.name
}


resource "aws_cloudwatch_metric_alarm" "ec2_scale_up_alarm" {
  alarm_name          = "ec2-scale-up-alarm"
  alarm_description   = "monitor ec2 cpu utilization"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  statistic           = "Average"
  threshold           = "80"

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.ec2_autoscaling.name
  }
  alarm_actions = [aws_autoscaling_policy.ec2_scale_up.arn]
}

resource "aws_autoscaling_policy" "ec2_scale_down" {
  name                   = "ec2-scale-down"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.ec2_autoscaling.name
}


resource "aws_cloudwatch_metric_alarm" "ec2_scale_down_alarm" {
  alarm_name          = "ec2-scale-down-alarm"
  alarm_description   = "monitor ec2 cpu utilization"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  statistic           = "Average"
  threshold           = "30"

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.ec2_autoscaling.name
  }
  alarm_actions = [aws_autoscaling_policy.ec2_scale_down.arn]
}