resource "aws_launch_template" "autoscaling_template" {
  name     = "autoscaling-template"
  image_id = data.aws_ami.latest_ubuntu.id

  instance_type = var.ec2_instance_type
  key_name      = "link-loop"

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.auto_scaling_sg.id]
  }

  user_data = filebase64("${path.module}/user-data/user-script.sh")

  lifecycle {
    create_before_destroy = true
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.main_iam_role_profile.name
  }

  tags = {
    Name = "autoscaling-launch-template"
  }

}


 